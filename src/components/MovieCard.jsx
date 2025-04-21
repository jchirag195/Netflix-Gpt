import React from 'react';
import { IMG_CDN_URL } from '../utils/constant';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie, listName = 'default' }) => {
  const navigate = useNavigate();
  const posterPath = movie?.poster_path;

  if (!posterPath) return null;

  const handleClick = () => {
    const mediaType = movie.media_type || 'movie';
    navigate(`/browse/${mediaType}/${movie.id}/${listName}`);
  };

  return (
    <div
      className="w-36 md:w-full md:h-full rounded-lg overflow-x-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <img
        className="w-full h-full object-cover"
        src={IMG_CDN_URL + posterPath}
        alt="Movie Card"
      />
      
    </div>
  );
};

export default MovieCard;