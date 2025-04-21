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
    <div className="w-screen aspect-video pt-[20%] px-6 md:px-24 absolute text-white bg-gradient-to-r from-black/90">
      <h1 className="text-2xl md:text-6xl font-bold">{title}</h1>
      <p className="hidden md:inline-block py-6 text-lg w-1/4">{overview}</p>
      <div className="my-4 md:m-0">
        <button
          className="bg-white text-black hover:bg-white/70 py-1 md:py-4 px-3 md:px-12 text-xl rounded-lg hover:bg-opacity-80 cursor-pointer"
          onClick={handleButtonClick}
        >
          ▶ Play
        </button>
        <button className="hidden md:inline-block mx-2 bg-gray-500 text-white p-4 px-12 text-xl bg-opacity-50 rounded-lg cursor-pointer"
        onClick={handleButtonClick}
        >
          ⓘ More Info
        </button>
      </div>
    </div>
  );
};

export default VideoTitle;
