import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";

const VideoBackground = ({movieId}) => {
  const trailerVideo = useSelector(store => store.movies?.trailerVideo);
  useMovieTrailer(movieId);

  return (
    <div className=" w-full
    relative
    lg:absolute lg:top-1/2 lg:left-1/2 lg:w-screen lg:h-[56.25vw] lg:min-w-full lg:min-h-full lg:-translate-x-1/2 lg:-translate-y-1/2 ">
    <iframe 
      className="w-full h-[56.25vw] lg:w-full lg:h-full" 
      src={`https://www.youtube.com/embed/${trailerVideo?.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerVideo?.key}&playsinline=1`} 
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    ></iframe>
    </div>
  )
};

export default VideoBackground;