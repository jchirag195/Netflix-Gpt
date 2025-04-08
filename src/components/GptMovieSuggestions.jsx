import React from 'react';
import { useSelector } from 'react-redux';
import MovieCard from './MovieCard';

const GptMovieSuggestions = () => {
  const { movieResults, movieNames } = useSelector((store) => store.gpt);

  if (!movieNames) return null;

  // Flatten movieResults and attach movie title to each result
  const combinedResults = movieResults.flatMap((movies, index) =>
    movies.map((movie) => ({
      ...movie,
      name: movieNames[index],
    }))
  );

  // Filter out movies without posters
  const filteredWithPosters = combinedResults.filter((movie) => movie.poster_path);

  // Keep only one movie per title
  const uniqueTitleMap = new Map();
  filteredWithPosters.forEach((movie) => {
    if (!uniqueTitleMap.has(movie.name)) {
      uniqueTitleMap.set(movie.name, movie);
    }
  });

  const finalMovies = Array.from(uniqueTitleMap.values()).slice(0, 5);

  return (
    <div className="p-4 md:p-8 space-y-8 flex justify-center align-middle">
      <div className="rounded-2xl p-6 mt-20 bg-black/40 backdrop-blur-sm shadow-xl border border-white/10">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          GPTflix Presents: Your 5 Must-See Picks
        </h2>

        <div className="flex overflow-x-auto space-x-6 hide-scrollbar">
          {finalMovies.map((movie, index) => (
            <div key={index} className="w-48 flex-shrink-0">
               <MovieCard movie={movie} listName="gpt" />
              <p className="text-white mt-2 text-center">{movie.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GptMovieSuggestions;
