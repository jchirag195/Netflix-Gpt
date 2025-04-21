import React from 'react';
import { useSelector } from 'react-redux';
import MovieCard from './MovieCard';

const GptMovieSuggestions = () => {
  const { movieResults, movieNames } = useSelector((store) => store.gpt);
  const topMovies = useSelector((store) => store.movies.topRatedMovies);

  let displayMovies = [];

  if (
    Array.isArray(movieResults) &&
    movieResults.length > 0 &&
    movieResults.some((r) => Array.isArray(r) && r.length > 0)
  ) {
    // Flatten the movieResults array and filter out invalid entries
    const allMovies = movieResults.flat().filter((movie) => movie && movie.poster_path);

    // Take the first 5 valid movies
    displayMovies = allMovies.slice(0, 5);
  }

  // Fallback to topMovies if no valid movies found
  if (displayMovies.length === 0) {
    displayMovies = topMovies?.slice(0, 5) || [];
  }

  const placeholders = Array(5 - displayMovies.length).fill(null);

  return (
    <div className="p-8 md:p-8 space-y-8 flex justify-center">
      <div className="rounded-2xl p-10 pb-18 mt-20 bg-black/40 backdrop-blur-sm shadow-xl border border-white/10">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
      {movieNames?.length
        ? 'GPTflix Presents: Your 5 Must-See Picks'
        : movieResults?.length
        ? 'Search Results'
        : 'Top Movies'}
    </h2>

        <div className="flex space-x-6 justify-center">
          {displayMovies.map((movie, index) => (
            <div key={movie.id || index} className="w-48">
              <MovieCard movie={movie} list_name="gpt" />
              {movie?.title && (
                <p className="text-white mt-2 text-center">{movie.title}</p>
              )}
            </div>
          ))}

          {placeholders.map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="w-48 h-[270px] bg-gray-800 rounded-xl opacity-20 border border-gray-700"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GptMovieSuggestions;
