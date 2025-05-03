import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MovieCard from './MovieCard';

const GptMovieSuggestions = () => {
  const { movieResults, movieNames } = useSelector((store) => store.gpt);
  const topMovies = useSelector((store) => store.movies.topRatedMovies);

  const [maxCards, setMaxCards] = useState(5);

  useEffect(() => {
    const updateCardCount = () => {
      const width = window.innerWidth;
      if (width < 1024) {
        setMaxCards(4); // sm & md devices
      } else {
        setMaxCards(5); // lg and up
      }
    };

    updateCardCount(); // Initial
    window.addEventListener('resize', updateCardCount);
    return () => window.removeEventListener('resize', updateCardCount);
  }, []);

  let displayMovies = [];

  if (
    Array.isArray(movieResults) &&
    movieResults.length > 0 &&
    movieResults.some((r) => Array.isArray(r) && r.length > 0)
  ) {
    const allMovies = movieResults.flat().filter((movie) => movie && movie.poster_path);
    displayMovies = allMovies.slice(0, maxCards);
  }

  if (displayMovies.length === 0) {
    displayMovies = topMovies?.slice(0, maxCards) || [];
  }

  if (displayMovies.length === 0) {
    return (
      <div className="p-4 md:p-8 flex justify-center">
        <ShimmerUI /> 
      </div>
    );
  }

  const placeholders = Array(maxCards - displayMovies.length).fill(null);

  return (
    <div className="p-4 md:p-8 flex justify-center">
      <div className="rounded-2xl p-5 mt-20 sm:justify-center bg-black/40 backdrop-blur-sm shadow-xl border border-white/10 w-full max-w-[1200px]">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
          {movieNames?.length
            ? 'GPTflix Presents: Your Must-See Picks'
            : movieResults?.length
            ? 'Search Results'
            : 'Top Movies'}
        </h2>
            
        <div className="
          grid 
    grid-cols-2 
    sm:grid-cols-2 
    md:grid-cols-2 
    lg:grid-cols-5 
    gap-x-4 gap-y-6
    justify-items-center
    sm:justify-center
        ">
          {displayMovies.map((movie, index) => (
            <div key={movie.id || index} className="w-[140px] sm:w-[150px] md:w-[160px] lg:w-[160px]">
              <MovieCard movie={movie} list_name="gpt" />
              {movie?.title && (
                <p className="text-white mt-2 text-sm text-center max-w-[90%] truncate">
                  {movie.title}
                </p>
              )}
            </div>
          ))}

          {placeholders.map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="w-[140px] h-[200px] 
                md:w-[160px] md:h-[220px]
                bg-gray-800 rounded-xl opacity-20 border border-gray-700"
            />
          ))}
          
        </div>
      </div>
    </div>
  );
};

export default GptMovieSuggestions;
