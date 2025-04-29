import React, { useEffect, useRef, useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import _ from 'lodash';
import openai from '../utils/openAI';
import { API_OPTIONS, OpenAI_KEY } from '../utils/constant';
import { addGptMovieResult, clearGptResults } from '../utils/GptSlice';
import { FaRobot, FaStar, FaSearch, FaEye } from 'react-icons/fa';
import lang from '../utils/languageConstants'

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const searchText = useRef(null);
  const isLoading = useSelector((store) => store.gpt.isLoading);

  const [query, setQuery] = useState('');
  const [isGptSearchActive, setIsGptSearchActive] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const searchMovieTMDB = async (movie) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movie)}&include_adult=false&language=en-US&page=1`,
      API_OPTIONS
    );
    const json = await response.json();
    return json.results?.slice(0, 5) || [];
  };

  const handleGPTSearch = async () => {
    const inputQuery = searchText.current?.value;
    if (!inputQuery) return;

    dispatch(clearGptResults());
    dispatch(setGptLoading(true))

    const gptPrompt = `You are a movie recommendation system. Give exactly 5 movie names (only names, comma-separated) for: "${inputQuery}".`;

    try {
      const openaiResults = await openai.chat.completions.create({
        model: 'qwen/qwen2.5-vl-32b-instruct:free',
        messages: [{ role: 'user', content: gptPrompt }],
        headers: { Authorization: `Bearer ${OpenAI_KEY}` },
      });

      const rawText = openaiResults?.choices?.[0]?.message?.content || '';
      const movieArray = rawText
        .replace(/\*\*/g, '')
        .replace(/^\d+\.\s*/gm, '')
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean)
        .slice(0, 5);

      const movieResults = await Promise.all(
        movieArray.map((movie) => searchMovieTMDB(movie))
      );

      dispatch(addGptMovieResult({ movieNames: movieArray, movieResults }));
    } catch (error) {
      console.error('GPT Search Error:', error);
    } finally {
      dispatch(setGptLoading(false));
    }
  };

  const handleManualSearch = async (e) => {
    e.preventDefault();
    if (isGptSearchActive) return;

    const inputQuery = searchText.current?.value;
    if (!inputQuery) return;

    dispatch(clearGptResults());
    const results = await searchMovieTMDB(inputQuery);
    dispatch(addGptMovieResult({ movieNames: [inputQuery], movieResults: [results] }));
  };

  const debouncedLiveSearch = useRef(
    _.debounce(async (text) => {
      if (!text || isGptSearchActive) {
        dispatch(clearGptResults());
        return;
      }

      const results = await searchMovieTMDB(text);
      dispatch(addGptMovieResult({ movieNames: [text], movieResults: [results] }));
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

  const langKey = useSelector((state) => state.config.lang);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      {/* Search Form */}
      <form
        onSubmit={handleManualSearch}
        className="flex items-center w-full max-w-2xl"
      >
        {/* Wrapper around input + button */}
        <div className={`flex flex-grow items-center bg-black rounded-full px-4 py-2 border-2 border-gray-900 
          transition-all duration-300
          ${isFocused ? 'shadow-[0_0_10px_2px_rgba(239,68,68,0.8)]' : 'shadow-none'}
        `}>
          
          {/* Eye Icon + Input */}
          <div className="relative flex-grow">
            <FaEye
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500"
              size={16}
            />
            <input
              ref={searchText}
              type="text"
              className="w-full pl-10 pr-4 py-2 text-white bg-transparent focus:outline-none text-sm sm:text-base"
              placeholder={lang[langKey].gptSearchPlaceholder}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              value={query}
            />
          </div>

          {/* Search Button */}
          <button
            type={isGptSearchActive ? 'button' : 'submit'}
            onClick={isGptSearchActive ? handleGPTSearch : undefined}
            className="p-2 flex items-center justify-center text-gray-400 hover:text-white transition cursor-pointer"
          >
            <FaSearch />
          </button>
        </div>
      </form>

      {/* Tiny AI toggle button */}
      <div className="flex items-center ml-3" style={{ width: '110px' }}>
        <button
          onClick={toggleGptMode}
          className="w-full p-2 rounded-full transition focus:outline-none h-full"
          title={isGptSearchActive ? "Normal Search" : "Ask AI"}
        >
          <div className="flex flex-col items-center pt-2 cursor-pointer">
            {/* Star icon and text */}
            <div className={`${isGptSearchActive ? 'hidden' : 'flex flex-col items-center'}`}>
              <div className="p-2 rounded-full border bg-black/120 relative group">
                <FaStar className="text-yellow-500 animate-pulse" size={20}  style={{
        filter: 'drop-shadow(0 0 6px rgba(250, 204, 21, 0.8))',
        textShadow: '0 0 10px #facc15'
      }} />
      <div className="absolute inset-0 rounded-full bg-yellow-500/20 animate-ping -z-10"></div>
              </div>
              
              <span className="mt-1 text-xs text-gray-300">Ask AI</span>
            </div>

            {/* Robot icon */}
            <div className={`relative ${isGptSearchActive ? 'block' : 'hidden'}`}>
        <FaRobot
          className="text-white animate-bounce"
          size={32}
          style={{
            backgroundColor: 'blue',
            padding: '5px',
            borderRadius: '50%',
          }}
        />
        {/* Blinking green status dot */}
        <div 
          className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-pulse"
          style={{
            transform: 'translate(25%, -25%)',
            boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)',
            animation: 'blink 1.5s infinite',
          }}
        />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default GptSearchBar;
