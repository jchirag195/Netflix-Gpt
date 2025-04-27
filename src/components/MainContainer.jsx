import React from "react";
import { useSelector } from "react-redux";
import VideoBackground from "./VideoBackground";
import VideoTitle from "./VideoTitle";

const MainContainer = () => {
  const movies = useSelector((store) => store.movies?.nowPlayingMovies);
  if (!movies) return null; 
  const randomIndex = Math.floor(Math.random() * movies.length);
  const mainMovie = movies[randomIndex];
  const { id, original_title, overview } = mainMovie;

  return (
    <div className="min-h-screen relative w-full">
      <VideoBackground movieId={id} />
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center px-4 md:px-16">
      <VideoTitle title={original_title} overview={overview} movie={mainMovie} />
      </div>
    </div>
  );
};

export default MainContainer;