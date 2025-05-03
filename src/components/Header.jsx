import React, { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../utils/Firebase';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, removeUser } from '../utils/userSlice';
import { LOGO, Supported_Languages, USER_AVATAR, LOGO_SMALL } from '../utils/constant';
import { toggleGptSearchView } from '../utils/GptSlice';
import { changedLanguage } from '../utils/configSlice';
import { FaSearch, FaCaretDown } from 'react-icons/fa';
import GptSearchBar from './GptSearchBar';
import { IoIosCloseCircleOutline } from 'react-icons/io';

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
    <div className='fixed top-0 left-0 w-full h-[80px] bg-gradient-to-b from-black z-50 px-4 flex items-center justify-between'>
      <div className='flex items-center gap-2 sm:gap-3'>
        <Link to={user ? "/browse" : "/"}>
        <>
  {/* Small & Medium screens */}
  <img
    src={LOGO_SMALL}
    alt="Netflix Logo Small"
    className='w-4 sm:w-6 md:w-6 lg:hidden object-contain'
  />
  
  {/* Large and above */}
  <img
    src={LOGO}
    alt="Netflix Logo Large"
    className='hidden lg:block w-36 xl:w-40'
  />
</>
        </Link>
      </div>

      {/* Gpt Search Bar */}
      {!isMoviePage && showGptSearch && (
        <div className='flex-1 flex justify-center px-2 sm:px-4'>
          <div className="w-full max-w-[300px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px]">
            <GptSearchBar />
          </div>
        </div>
      )}

      {/* User Avatar + Dropdown */}
      <div className='flex items-center gap-3 sm:gap-3 text-sm sm:text-base'>
        {user && !isMoviePage && (
          <div className='flex items-center gap-1 px-2 sm:px-4 md:px-6 ml-auto relative' ref={dropdownRef}>
            {showGptSearch && (
              <select
                className='hidden md:block px-3 py-1 bg-transparent text-white border border-gray-500 rounded-sm text-sm hover:border-white transition-colors duration-300'
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
              className='p-2 sm:p-3 md:p-4 text-white rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:scale-125 hover:shadow-lg'
              onClick={handleGptSearchClick}
            >
              {showGptSearch ? <IoIosCloseCircleOutline className="text-xl sm:text-2xl md:text-3xl" /> : <FaSearch className="text-xl sm:text-2xl md:text-3xl" />}
            </button>

            {/* Avatar + Greeting */}
            {!showGptSearch && (
              <>
                <div className="relative flex items-center gap-2 text-white">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 overflow-hidden">
                    <img src={USER_AVATAR} alt="User Avatar" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex items-center gap-2 max-w-[100px]">
                    <div className='flex flex-col text-white leading-tight text-sm text-right'>
                      <span className="text-white text-xs font-light">Hello,</span>
                      <span className="text-white text-sm md:text-lg font-semibold">
                        {user?.displayName ? user.displayName.split(' ')[0] : 'User'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dropdown Icon */}
                <FaCaretDown
                  className={`text-base sm:text-lg md:text-xl text-white transition-transform cursor-pointer ${isDropdownOpen ? 'rotate-180' : ''}`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />

                {isDropdownOpen && (
                  <div className="absolute top-12 right-0 bg-black/90 border border-gray-700 rounded-md py-2 min-w-[180px] sm:min-w-[200px] md:min-w-[200px] max-w-[80vw] z-50">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-white text-sm font-medium truncate">{user?.displayName}</p>
                      <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-3 py-2 sm:px-3 sm:py-2 text-white text-center text-sm bg-red-800 hover:bg-red-500 rounded transition-all"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Close button for Movie Page */}
        {isMoviePage && (
          <div className='flex items-center mr-10 gap-6 md:ml-auto'>
            <Link to="/browse">
              <button
                className='p-3 text-white rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:scale-125 hover:shadow-lg'
              >
                <IoIosCloseCircleOutline className="text-3xl" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;