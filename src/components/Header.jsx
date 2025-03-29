import React, { useEffect } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../utils/Firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, removeUser } from '../utils/userSlice';
import { LOGO } from '../utils/constant';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(store => store.user);

  const handleSignOut = () => {
      signOut(auth).then(() => {
      }).catch((error) => {
        navigate("/error");
      });

  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const {uid, email, displayName, photoURL} = user;

        dispatch(addUser({uid: uid, email: email,displayName: displayName, photoURL: photoURL}));
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });
    //unsubscribe when component Unmounts
    return () => unsubscribe();

  },[])

  return (
    <div className='absolute w-screen px-8 py-2 bg-gradient-to-b from-black z-10 flex flex-col md:flex-row justify-between'>
      <img className='w-44' src={LOGO} alt="logo" />
      {user && <div className='flex p-2'>
        <img className='h-10 w-10 m-2 rounded-lg' src={user?.photoURL} alt="user-icon" />
        <button onClick={handleSignOut} className='font-bold text-white p-2 m-2 bg-red-500 rounded-lg cursor-pointer hover:bg-red-900'>Sign Out</button>
      </div>}
    </div>
  )
}

export default Header
