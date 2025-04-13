import React, { useRef } from 'react';
import lang from '../utils/languageConstants';
import { useDispatch, useSelector } from 'react-redux';
import openai from '../utils/openAI';
import { API_OPTIONS, OpenAI_KEY } from '../utils/constant';
import { addGptMovieResult, clearGptResults } from '../utils/GptSlice';
import { FaRobot } from 'react-icons/fa';

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);

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

    const gptQuery = `You are a movie recommendation system. 
    Provide exactly 5 movie names for the query: "${inputQuery}". 
    Return them in a single line, comma-separated, no extra text.`;

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
        .filter(Boolean);

      const movieResults = await Promise.all(movieArray.map(searchMovieTMDB));
      dispatch(addGptMovieResult({ movieNames: movieArray, movieResults }));
    } catch (error) {
      console.error('GPT Search Error:', error);
    }
  };

  const handleManualSearch = async (e) => {
    e.preventDefault();
    const inputQuery = searchText.current?.value;
    if (!inputQuery) return;

    dispatch(clearGptResults());

    const results = await searchMovieTMDB(inputQuery);
    dispatch(addGptMovieResult({ movieNames: [inputQuery], movieResults: [results] }));
  };

  return (
    <div className="flex justify-center mt-6 px-4 sm:px-8">
    <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
      {/* Search Form */}
      <form
        onSubmit={handleManualSearch}
        className="flex w-full bg-gray-800 rounded-lg overflow-hidden shadow-md border-2 border-black"
      >
        <input
          ref={searchText}
          type="text"
          className="flex-grow p-3 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] text-white text-xl rounded-l-lg border-3 border-gray-700 focus:border-red-800 focus:ring-2 focus:ring-red-500 focus:outline-none shadow-lg transition-all duration-300 hover:bg-opacity-90"
          placeholder={lang[langKey].gptSearchPlaceholder}
          aria-label="Search movies"
          />
          <button
            type="submit"
            className="bg-red-700 text-white px-6 hover:bg-red-800 transition-all rounded-r-lg cursor-pointer"
            aria-label="Manual Search"
          >
            {lang[langKey].search}
          </button>
        </form>

        {/* GPT Search Button */}
        <button
          type="button"
          onClick={handleGPTSearch}
          className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold text-lg shadow-md border-2 border-blue-700 cursor-pointer"
          aria-label="GPT Search"
        >
          <FaRobot className="text-xl sm:text-2xl text-white animate-bounce" />
        </button>
      </div>
    </div>
  );
};

export default GptSearchBar;
