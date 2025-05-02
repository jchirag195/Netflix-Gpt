import { useNavigate } from "react-router-dom";

const VideoTitle = ({ title, overview, movie, listName }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (movie?.id) {
      const mediaType = movie?.media_type || 'movie'; // Default to 'movie' if undefined
      navigate(`/browse/${mediaType}/${movie.id}/${listName}`);
    }
  };

  return (
    <div className="w-screen aspect-video pt-[20%] sm:pt-[15%] md:pt-[25%] px-4 md:px-24 absolute text-white bg-gradient-to-r from-black/90">
      <h1 className="text-gray-200 text-base sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-2 text-left">
        {title}
      </h1>

      {/* Hide overview on md, show only on lg and up */}
      <p className="hidden lg:inline-block py-6 text-md w-2/4">{overview}</p>

      <div className="my-4 md:m-0 flex flex-col sm:flex-row sm:justify-start sm:items-center sm:space-x-4">
        <button
          className="bg-white text-black hover:bg-white/70 py-1.5 px-4 text-sm sm:py-1 sm:px-3 sm:text-base md:py-3 md:px-8 md:text-lg w-fit rounded-md hover:bg-opacity-80 cursor-pointer mb-4 sm:mb-0"
          onClick={handleButtonClick}
        >
          ▶ Play
        </button>

        {/* Hide More Info button on md and below */}
        <button
          className="hidden lg:inline-block bg-white text-black hover:bg-white/70 py-3 px-8 text-lg w-fit rounded-md hover:bg-opacity-80 cursor-pointer"
          onClick={handleButtonClick}
        >
          ⓘ More Info
        </button>
      </div>
    </div>
  );
};

export default VideoTitle;
