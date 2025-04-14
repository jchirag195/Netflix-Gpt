import React from 'react';
import { useSelector } from 'react-redux';
import MovieCard from './MovieCard';

const GptMovieSuggestions = () => {
  const { movieResults, movieNames } = useSelector((store) => store.gpt);
  const topMovies = useSelector((store) => store.movies.topRatedMovies);

  let displayMovies;

  if (!movieNames || !movieResults || movieResults.every(m => !m?.length)) {
    displayMovies = topMovies?.slice(0, 5) || [];
  } else {
    const combinedResults = movieResults.flatMap((movies, index) =>
      movies.map((movie) => ({ ...movie, name: movieNames[index] })))
    
    const filteredWithPosters = combinedResults.filter((movie) => movie.poster_path);

    const uniqueTitleMap = new Map();
    filteredWithPosters.forEach((movie) => {
      if (!uniqueTitleMap.has(movie.name)) {
        uniqueTitleMap.set(movie.name, movie);
      }
    });

    displayMovies = Array.from(uniqueTitleMap.values()).slice(0, 5);
  }

  const placeholders = Array(5 - displayMovies.length).fill(null);

  return (
    <div className="p-4 md:p-8 space-y-8 flex justify-center">
      <div className="rounded-2xl p-10 mt-20 bg-black/40 backdrop-blur-sm shadow-xl border border-white/10">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          GPTflix Presents: {movieNames?.length ? 'Your 5 Must-See Picks' : 'Top Movies'}
        </h2>

        <div className="flex space-x-6 justify-center">
          {displayMovies.map((movie, index) => (
            <div key={index} className="w-48">
              <MovieCard movie={movie} list_name="gpt" />
              {movie.name && (
                <p className="text-white mt-2 text-center">{movie.name}</p>
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
