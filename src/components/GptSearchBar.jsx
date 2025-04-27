import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import openai from '../utils/openAI';
import { API_OPTIONS, OpenAI_KEY } from '../utils/constant';
import { addGptMovieResult, clearGptResults } from '../utils/GptSlice';
import { FaRobot, FaStar } from 'react-icons/fa';

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);

  const [query, setQuery] = useState('');
  const [isGptSearchActive, setIsGptSearchActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchMovieTMDB = async (movie) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movie)}&include_adult=false&language=en-US&page=1`,
      API_OPTIONS
    );
    const json = await response.json();
    return json.results.slice(0, 5);
  };

  const handleGPTSearch = async () => {
    const inputQuery = searchText.current?.value;
    if (!inputQuery) return;

    dispatch(clearGptResults());
    setIsLoading(true);

    const gptQuery = `You are a movie recommendation system. Provide exactly 5 movie names for: "${inputQuery}". Return them comma-separated.`;

    try {
      const openaiResults = await openai.chat.completions.create({
        model: 'qwen/qwen2.5-vl-32b-instruct:free',
        messages: [{ role: 'user', content: gptQuery }],
        headers: { Authorization: `Bearer ${OpenAI_KEY}` },
      });

      const raw = openaiResults?.choices?.[0]?.message?.content || '';
      const movieArray = raw
        .replace(/\*\*/g, '')
        .replace(/^\d+\.\s*/gm, '')
        .split(',')
        .map((movie) => movie.trim())
        .filter(Boolean)
        .slice(0, 5);

      const movieResults = await Promise.all(
        movieArray.map(async (movie) => {
          const results = await searchMovieTMDB(movie);
          return results.slice(0, 5);
        })
      );

      dispatch(addGptMovieResult({ movieNames: movieArray, movieResults }));
    } catch (error) {
      console.error('GPT Search Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSearch = async (e) => {
    e.preventDefault();
    if (isGptSearchActive) return;

    const inputQuery = searchText.current?.value;
    if (!inputQuery) return;

    dispatch(clearGptResults());
    const results = await searchMovieTMDB(inputQuery);
    dispatch(addGptMovieResult({ movieNames: [inputQuery], movieResults: [results.slice(0, 5)] }));
  };

  const debouncedLiveSearch = useRef(
    _.debounce(async (text) => {
      if (!text || isGptSearchActive) {
        dispatch(clearGptResults());
        return;
      }

      const results = await searchMovieTMDB(text);
      dispatch(addGptMovieResult({ movieNames: [text], movieResults: [results.slice(0, 5)] }));
    }, 500)
  ).current;

  useEffect(() => {
    if (!isGptSearchActive) {
      debouncedLiveSearch(query);
    }
  }, [query, isGptSearchActive, debouncedLiveSearch]);

  const toggleGptMode = () => {
    setIsGptSearchActive((prev) => !prev);
    dispatch(clearGptResults());
    setQuery('');
    if (searchText.current) searchText.current.value = '';
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
      <form
        onSubmit={handleManualSearch}
        className="flex flex-col sm:flex-row gap-2 sm:gap-0 w-full max-w-xl bg-gray-800 rounded-lg shadow-md border border-gray-700"
      >
        <input
          ref={searchText}
          type="text"
          className="flex-grow min-w-0 p-2 sm:p-3 text-white text-sm sm:text-base lg:text-lg bg-gray-900 border-none focus:outline-none focus:ring-2 focus:ring-red-500 rounded-l-lg"
          placeholder="Search movies here..."
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
        {isGptSearchActive ? (
          <button
            type="button"
            onClick={handleGPTSearch}
            className="bg-green-700 text-white px-6 hover:bg-green-800 transition-all rounded-r-lg cursor-pointer"
          >
            {isLoading ? 'Loading...' : 'AI Search'}
          </button>
        ) : (
          <button
            type="submit"
            className="bg-red-700 text-white px-6 hover:bg-red-800 transition-all rounded-r-lg cursor-pointer"
          >
            Search
          </button>
        )}
      </form>

      {/* Toggle buttons */}
      {!isGptSearchActive ? (
        <button
          onClick={toggleGptMode}
          className="flex items-center ml-2 px-3 py-2 bg-black/30 backdrop-blur-md rounded-xl shadow-md hover:scale-105 transition-transform"
          aria-label="Ask AI"
        >
          <FaStar className="text-yellow-400 focus-ring text-xl sm:text-2xl md:text-3xl p-2 bg-gray-800 rounded-full shadow-md hover:scale-105 transition-transform sm:text-4xl animate-pulse" />
          <span className="text-xs sm:text-sm md:text-base text-gray-200 font-medium">Ask AI</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={toggleGptMode}
          className="flex flex-col items-center px-3 py-2 bg-black/30 backdrop-blur-md rounded-xl shadow-md hover:scale-105 transition-transform"
        >
          <div className="relative flex items-center justify-center">
            <FaRobot className="text-green-400 text-xl sm:text-2xl md:text-3xl animate-bounce" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          </div>
        </button>
      )}
    </div>
  );
};

export default GptSearchBar;
