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
      className="w-[100px] h-[160px] 
        sm:w-[100px] sm:h-[160px]
        md:w-[160px] md:h-[220px]
        lg:w-[160px] lg:h-[240px]
        xl:w-[170px] xl:h-[250px]
        2xl:w-[180px] 2xl:h-[260px]
        rounded-lg overflow-hidden 
        hover:scale-105 transition-transform duration-300 
        cursor-pointer"
      onClick={handleClick}
    >
      <img
        className="w-full h-full object-cover rounded-lg"
        src={IMG_CDN_URL + posterPath}
        alt="Movie Card"
      />
    </div>
  );
};

export default MovieCard;
