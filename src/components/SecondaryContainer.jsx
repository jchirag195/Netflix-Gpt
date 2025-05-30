import React from 'react';
import MovieList from './MovieList';
import { useSelector } from 'react-redux';
import useTopRatedMovies from "../hooks/useTopRatedMovies";
import useUpcomingMovies from '../hooks/useUpcomingMovies';


const SecondaryContainer = () => {

  useTopRatedMovies();
  useUpcomingMovies();
  const movies = useSelector((store) => store.movies)

  return (
    movies.nowPlayingMovies && (
    <div className=" bg-black/90 ">
      <div className='relative z-20 sm:-mt-12 sm:pl-6 md:-mt-16 md:pl-8 lg:-mt-28 lg:pl-12'>
      <MovieList title={"Now Playing"} movies={movies?.nowPlayingMovies || []} />
      <MovieList title={"Popular"} movies={movies?.popularMovies || []} />
      <MovieList title={"Top Rated"} movies={movies?.topRatedMovies || []} />
      <MovieList title={"Upcoming"} movies={movies?.UpcomingMovies || []} />
      </div>
    </div>
  )
  )
}


export default SecondaryContainer;