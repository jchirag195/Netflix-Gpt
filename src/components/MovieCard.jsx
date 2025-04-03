import React from 'react'
import { IMG_CDN_URL } from '../utils/constant'

const MovieCard = ({posterPath}) => {
  if(!posterPath) return null;
  return (
    <div className='w-full h-full rounded-lg overflow-x-hidden hover:scale-105 transition-transform duration-300 cursor-pointer'>
      <img className="w-full h-full object-cover" src={IMG_CDN_URL + posterPath} alt="Movie Card" />
    </div>
  )
}

export default MovieCard
