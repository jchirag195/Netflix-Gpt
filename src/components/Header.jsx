import React, { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../utils/Firebase';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, removeUser } from '../utils/userSlice';
import { LOGO, Supported_Languages, USER_AVATAR } from '../utils/constant';
import { toggleGptSearchView } from '../utils/GptSlice';
import { changedLanguage } from '../utils/configSlice';
import { FaSearch, FaHome, FaCaretDown } from 'react-icons/fa';
import GptSearchBar from './GptSearchBar';
import { IoSearch } from 'react-icons/io5';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(store => store.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  const location = useLocation();

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGptSearchClick = () => {
    dispatch(toggleGptSearchView());
  };

  const handleLanguageChange = (e) => {
    dispatch(changedLanguage(e.target.value));
  };

  const isMoviePage = location.pathname.includes('/movie/');

  return (
    <div className='fixed top-0 left-0 w-full h-[100px] px-8 py-3 pr-0 bg-gradient-to-b from-black z-20 flex md:justify-center items-center gap-100'>
      <Link to={user ? "/browse" : "/"}>
        <img className='w-44 mx-auto md:mx-0' src={LOGO} alt="Netflix Logo" />
      </Link>

      {!isMoviePage && showGptSearch && (
        <div className='flex-grow max-w-3xl mx-4'>
          <GptSearchBar />
        </div>
      )}

      {user && !isMoviePage && (
        <div className='flex items-center gap-1 px-10 mr-0 md:ml-auto relative' ref={dropdownRef}>
          {showGptSearch && (
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

          {!showGptSearch && (
            <>
              {/* Avatar + Greeting */}
              <div className="flex items-center gap-2 text-white">
              <div className="w-10 h-10 overflow-hidden">
                  <img src= {USER_AVATAR} alt="User Avatar" className="w-full h-full object-cover" />
              </div>

                <div className="hidden md:flex flex-col ml-2">
                  <span className="text-white text-xs font-light">Hello,</span>
                  <span className="text-white text-sm md:text-lg font-semibold">
                    {user?.displayName ? user.displayName.split(' ')[0] : 'User'}
                  </span>
                </div>
              </div>

              <FaCaretDown
                className={`text-white transition-transform cursor-pointer ${isDropdownOpen ? 'rotate-180' : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />

              {isDropdownOpen && (
                <div className="absolute top-12 right-0 bg-black/90 border border-gray-700 rounded-md py-2 min-w-[180px]">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-white text-sm font-medium truncate">{user?.displayName}</p>
                    <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-3 cursor-pointer text-left text-white hover:bg-gray-800/90 text-sm"
                  >
                    Sign out of Netflix
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

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
