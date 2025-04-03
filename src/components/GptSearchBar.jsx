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
        console.log(searchText.current.value);

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

                console.log(movieArray);

                const TmdbResults = await Promise.all(
                    movieArray.map(async (movie) => await searchMovieTMDB(movie))
                );
                console.log(TmdbResults);
                dispatch(addGptMovieResult({movieNames: movieArray,movieResults: TmdbResults}));
            }
        } catch (error) {
            console.error("Error fetching movie recommendations:", error);
        }
    };

    return (
        <div className='pt-[10%] flex justify-center'>
            <form className='w-1/2 bg-black grid grid-cols-12' onSubmit={(e) => e.preventDefault()}>
                <input 
                    ref={searchText} 
                    type='text' 
                    className='p-4 m-4 col-span-9 bg-white' 
                    placeholder={lang[langKey].gptSearchPlaceholder} 
                />
                <button 
                    className='py-2 px-4 bg-red-700 text-white rounded-lg col-span-3 m-4 cursor-pointer' 
                    onClick={handleGptSearchClick}
                >
                    {lang[langKey].search}
                </button>
            </form>
        </div>
    );
};

export default GptSearchBar;