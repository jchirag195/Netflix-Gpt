import React, { useRef } from 'react';
import lang from '../utils/languageConstants';
import { useDispatch, useSelector } from 'react-redux';
import openai from '../utils/openAI';
import { API_OPTIONS, OpenAI_KEY } from '../utils/constant';
import { addGptMovieResult } from '../utils/GptSlice';

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const langKey = useSelector(store => store.config.lang);
  const searchText = useRef(null);

  const searchMovieTMDB = async (movie) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movie)}&include_adult=false&language=en-US&page=1`,
      API_OPTIONS
    );
    const json = await response.json();
    return json.results;
  };

  const handleGptSearchClick = async () => {
    const gptQuery = `You are a movie recommendation system. 
    Provide exactly 5 movie names for the query: "${searchText.current.value}". 
    Return them in a single line, comma-separated, with no extra text, explanations, or formatting. 
    Example output: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya.`;

    try {
      const openaiResults = await openai.chat.completions.create({
        model: 'qwen/qwen2.5-vl-32b-instruct:free',
        messages: [{ role: 'user', content: gptQuery }],
        headers: { "Authorization": `Bearer ${OpenAI_KEY}` },
      });

      if (openaiResults.choices && openaiResults.choices.length > 0) {
        let rawResponse = openaiResults.choices[0].message.content;

        let movieArray = rawResponse
          .replace(/\*\*/g, '')
          .replace(/^\d+\.\s*/gm, '')
          .split(',')
          .map(movie => movie.trim())
          .filter(movie => movie.length > 0);

        const TmdbResults = await Promise.all(
          movieArray.map(async (movie) => await searchMovieTMDB(movie))
        );

        dispatch(addGptMovieResult({ movieNames: movieArray, movieResults: TmdbResults }));
      }
    } catch (error) {
      console.error("Error fetching movie recommendations:", error);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleGptSearchClick();
      }}
      className="flex w-full bg-gray-800 rounded-lg overflow-hidden shadow-md border-2 border-black"
    >
      <input
        ref={searchText}
        type="text"
        className="flex-grow p-3 text-white text-xl rounded-l-lg border-3 border-gray-700 focus:border-red-800 focus:ring-2 focus:ring-red-500 focus:outline-none shadow-lg transition-all duration-300 hover:bg-opacity-90"
        placeholder={lang[langKey].gptSearchPlaceholder}
        aria-label="Search movies"
      />
      <button
        type="submit"
        className="bg-red-700 text-white px-6 hover:bg-red-800 transition-all rounded-r-lg cursor-pointer"
        aria-label="Perform search"
      >
        {lang[langKey].search}
      </button>
    </form>
  );
};

export default GptSearchBar;
