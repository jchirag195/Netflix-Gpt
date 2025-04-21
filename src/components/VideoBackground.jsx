import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";

const VideoBackground = ({movieId}) => {
  const trailerVideo = useSelector(store => store.movies?.trailerVideo);

  useMovieTrailer(movieId);

  return (
    <div className="absolute inset-0 ">
    <iframe 
      className="absolute top-1/2 left-1/2 w-screen h-[56.25vw] min-h-full min-w-full -translate-x-1/2 -translate-y-1/2" 
      src={`https://www.youtube.com/embed/${trailerVideo?.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerVideo?.key}&playsinline=1`} 
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    ></iframe>
    </div>
  )
}

export default VideoBackground;