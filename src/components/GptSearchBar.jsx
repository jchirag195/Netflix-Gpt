import React, { useEffect, useRef, useState } from 'react';
import lang from '../utils/languageConstants';
import { useDispatch, useSelector } from 'react-redux';
import openai from '../utils/openAI';
import { API_OPTIONS, OpenAI_KEY } from '../utils/constant';
import { addGptMovieResult, clearGptResults } from '../utils/GptSlice';
import { FaRobot } from 'react-icons/fa';
import _ from 'lodash';

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
    return json.results;
  };

  const handleGPTSearch = async () => {
    const inputQuery = searchText.current?.value;
    if (!inputQuery) return;

    dispatch(clearGptResults());
    setIsLoading(true);

    const gptQuery = `You are a movie recommendation system. 
    Provide exactly 5 movie names for the query: "${inputQuery}". 
    Return them in a single line, comma-separated, no extra text.`;

    try {
      const openaiResults = await openai.chat.completions.create({
        model: 'qwen/qwen2.5-vl-32b-instruct:free',
        messages: [{ role: 'user', content: gptQuery }],
        headers: { Authorization: `Bearer ${OpenAI_KEY}` },
      });

      const raw = openaiResults?.choices?.[0,1,2,3,4]?.message?.content || '';
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
          return results?.[0] ? [results[0,1,2,3,4]] : [];
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
    dispatch(addGptMovieResult({ movieNames: [inputQuery], movieResults: [results.slice(0, 1)] }));
  };

  const debouncedLiveSearch = useRef(
    _.debounce(async (text) => {
      if (!text || isGptSearchActive) {
        dispatch(clearGptResults());
        return;
      }

      const results = await searchMovieTMDB(text);
      dispatch(addGptMovieResult({ movieNames: [text], movieResults: [results.slice(0, 1)] }));
    }, 500)
  ).current;

  useEffect(() => {
    if (!isGptSearchActive) {
      debouncedLiveSearch(query);
    }
  }, [query, isGptSearchActive, debouncedLiveSearch]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl items-center">
      <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
        {/* Search Form */}
        <form
          onSubmit={handleManualSearch}
          className="flex w-full bg-gray-800 rounded-lg overflow-hidden shadow-md border-2 border-black"
        >
          <input
            ref={searchText}
            type="text"
            className="flex-grow p-3 text-white text-xl rounded-l-lg border-3 border-gray-700 focus:border-red-800 focus:ring-2 focus:ring-red-500 focus:outline-none shadow-lg transition-all duration-300 hover:bg-opacity-90"
            placeholder={lang[langKey].gptSearchPlaceholder}
            aria-label="Search movies"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            value={query}
          />
          {!isGptSearchActive ? (
            <button
              type="submit"
              className="bg-red-700 text-white px-6 hover:bg-red-800 transition-all rounded-r-lg cursor-pointer"
              aria-label="Manual Search"
            >
              {lang[langKey].search}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGPTSearch}
              className="bg-green-700 text-white px-6 hover:bg-green-800 transition-all rounded-r-lg cursor-pointer"
              aria-label="GPT Search"
            >
              {isLoading ? 'Loading...' : 'AI Search'}
            </button>
          )}
        </form>

        {/* Toggle GPT Search Button */}
        {!isGptSearchActive ? (
          <button
            type="button"
            onClick={() => setIsGptSearchActive(true)}
            className="relative flex items-center bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold text-lg shadow-md border-2 border-blue-700 cursor-pointer"
            aria-label="Ask AI"
          >
            <span className="text-xs text-gray-300 font-medium">Ask AI</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsGptSearchActive(false)}
            className="relative flex items-center bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold text-lg shadow-md border-2 border-blue-700 cursor-pointer"
            aria-label="GPT Mode On"
          >
            <FaRobot className="text-xl sm:text-2xl text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-ping"></span>
          </button>
        )}
      </div>
    </div>
  );
};

export default GptSearchBar;
