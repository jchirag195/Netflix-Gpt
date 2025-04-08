import React from 'react';
import GptSearchBar from './GptSearchBar';
import GptMovieSuggestions from './GptMovieSuggestions';
import { BG_URL } from '../utils/constant';

const GptSearch = () => {
  return (
    <>  
      <div className='bg-gradient-to-br from-black via-red-800 to-black bg-opacity-95 min-h-screen'>
        <GptMovieSuggestions />
      </div>
    </>
  );
};

export default GptSearch;
