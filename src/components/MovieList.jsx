import React, { useRef } from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ title, movies }) => {
  const scrollContainer = useRef(null);

  const scroll = (scrollOffset) => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollTo({
        left: scrollContainer.current.scrollLeft + scrollOffset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="px-6 py-4 relative group">
      {/* Title + Buttons Container */}
      <div className="flex justify-between items-center">
        <h1 className="text-white text-xl md:text-3xl py-4 font-bold">{title}</h1>
        <div className="flex space-x-3">
        <button 
          onClick={() => scroll(-500)}
          className="text-white/70 bg-black/10 backdrop-blur-sm p-2 rounded-full transition-all duration-200 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6.5 w-6.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={() => scroll(500)}
          className="text-white/70 bg-black/10 backdrop-blur-sm p-2 rounded-full transition-all duration-200 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6.5 w-6.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      </div>

      {/* Movie Cards Container */}
      <div 
        ref={scrollContainer}
        className="flex overflow-x-auto pb-4 hide-scrollbar"
      >
        <div className="flex space-x-4">
          {movies?.map((movie) => (
            <div className="w-48 flex-shrink-0" key={movie.id}>
              <MovieCard posterPath={movie.poster_path} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;