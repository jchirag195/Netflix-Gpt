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
    <div className="relative w-full lg:min-h-screen">
  <VideoBackground movieId={id} />

  {/* Overlay title ONLY for small/medium */}
  <div className="absolute inset-0 block lg:hidden">
    <VideoTitle title={original_title} overview={overview} movie={mainMovie} />
  </div>

  {/* Original title layout ONLY for large screens */}
  <div className="hidden lg:flex absolute top-0 left-0 w-full h-full flex-col justify-center items-center px-4 md:px-16">
    <VideoTitle title={original_title} overview={overview} movie={mainMovie} />
  </div>
</div>
  );
};

export default MainContainer;