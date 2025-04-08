import React from 'react'
import Header from './Header'
import useNowPlayingMovies from "../hooks/useNowPlayingMovies"
import MainContainer from "./MainContainer";
import SecondaryContainer from "./SecondaryContainer";
import usePopularMovies from "../hooks/usePopularMovies"
import GptSearch from './GptSearch';
import { useSelector } from 'react-redux';
import Footer from './Footer';

const Browse = () => {

  const showGptSearch = useSelector(store => store.gpt.showGptSearch);
  useNowPlayingMovies();
  usePopularMovies();
  
 return (
    <div className='relative  bg-black/90'>
      <Header />
      {
        showGptSearch ? 
        <GptSearch /> : 
        <>
        <MainContainer />
        <SecondaryContainer />
        </>
      }
      <Footer />
    </div>
  )
}

export default Browse;
