import React, { useEffect } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../utils/Firebase';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, removeUser } from '../utils/userSlice';
import { LOGO, Supported_Languages, USER_AVATAR } from '../utils/constant';
import { toggleGptSearchView } from '../utils/GptSlice';
import { changedLanguage } from '../utils/configSlice';
import { FaSearch, FaHome } from 'react-icons/fa';
import GptSearchBar from './GptSearchBar';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(store => store.user);
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  const location = useLocation();  // Get the current route location

  const handleSignOut = () => {
    signOut(auth).catch(() => {
      navigate("/error");
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(addUser({ uid, email, displayName, photoURL }));

        const currentPath = window.location.pathname;
        if (currentPath === "/" || currentPath === "/login") {
          navigate("/browse");
        }
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGptSearchClick = () => {
    dispatch(toggleGptSearchView());
  };

  const handleLanguageChange = (e) => {
    dispatch(changedLanguage(e.target.value));
  };

  // Check if we're on the MoviePage by comparing the path
  const isMoviePage = location.pathname.includes('/movie/');

  return (
    <div className='fixed top-0 left-0 w-full px-8 py-3 pr-0 bg-gradient-to-b from-black z-50 flex md:justify-center items-center gap-100'>
      <Link to={user ? "/browse" : "/"}>
        <img className='w-44 mx-auto md:mx-0' src={LOGO} alt="Netflix Logo" />
      </Link>

      {/* Only show GPT search bar if not on the movie page */}
      {!isMoviePage && showGptSearch && (
      <div className='flex-grow max-w-3xl mx-4'>
      <GptSearchBar />
      </div>
      )}

      {user && !isMoviePage && (
        <div className='flex items-center gap-6 px-10 md:ml-auto'>
          {showGptSearch && !isMoviePage && (
            <select 
            className='px-3 py-1 bg-transparent text-white border border-gray-500 rounded-sm text-sm hover:border-white transition-colors duration-300'
            onChange={handleLanguageChange}
          >
            {Supported_Languages.map((lang) => (
              <option 
                key={lang.identifier} 
                value={lang.identifier}
                className="bg-gray-900"
              >
                {lang.name}
              </option>
            ))}
          </select>
          )}

          <button 
            className='p-3 text-white rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:scale-125 hover:shadow-lg hover:shadow-red-500/50'
            onClick={handleGptSearchClick}
          >
            {showGptSearch ? <FaHome className="text-3xl" /> : <FaSearch className="text-3xl" />}
          </button>

          {!showGptSearch && !isMoviePage && (
            <>
              <div className="relative group h-12 w-12 overflow-hidden hover:border-red-500 transition-colors duration-300 border-2 border-transparent">
                {USER_AVATAR}
                <div className="hidden group-hover:flex absolute top-full mt-2 right-0 bg-[#141414] p-2 shadow-lg flex-col items-end z-10">
                  <span className="text-sm text-gray-300">Hello,</span>
                  <span className="text-white font-medium truncate max-w-[120px]">
                    {user?.displayName}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleSignOut} 
                className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300 font-medium text-sm cursor-pointer'
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      )}

      {/* Only show Home button on the MoviePage */}
      {isMoviePage && (
        <div className='flex items-center mr-10 gap-6 md:ml-auto'>
          <Link to="/browse">
            <button 
              className='p-3 text-white rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:scale-125 hover:shadow-lg hover:shadow-red-500/50'
            >
              <FaHome className="text-3xl" />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;