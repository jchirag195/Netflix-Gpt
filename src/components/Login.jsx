import React, { useRef, useState } from 'react'
import Header from './Header'
import {checkValidData} from "../utils/Validate.jsx";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../utils/Firebase.jsx';
import {updateProfile } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice.jsx';
import { BG_URL, USER_AVATAR } from '../utils/constant.jsx';

const Login = () => {
  const[isSignInForm, setIsSignInForm] = useState(true);
  const[errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  const handleButtonClick = () => {
    //Validate the form data
    const message = isSignInForm 
  ? checkValidData(email.current.value, password.current.value) 
  : checkValidData(email.current.value, password.current.value, name.current.value);


    //SignIn||SignUp Logic
    if(!isSignInForm) {
      //Sign Up Logic
      createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    updateProfile(user, {
      displayName: name.current.value, photoURL: USER_AVATAR
    }).then(() => {
      const {uid, email, displayName, photoURL} = auth.currentUser;
      
              dispatch(addUser({uid: uid, email: email,displayName: displayName, photoURL: photoURL}));
    }).catch((error) => {
      setErrorMessage(error.message);
    });
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    setErrorMessage(errorCode +"-" + errorMessage);
  });
    }
    else {
      //Sign In Logic
      signInWithEmailAndPassword(auth, email.current.value, password.current.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    setErrorMessage(errorCode + "-" + errorMessage)
  });
    }

  }

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
  };

  return (
    <div>
        <Header />
        <div className='absolute'>
            <img src={BG_URL} alt="" />
        </div>
        <form onSubmit={(e) => e.preventDefault()} className='w-3/12 absolute p-12 bg-black/80 my-36 mx-auto right-8 left-0 text-white bg-opacity-5' >
        <h1 className='font-bold text-3xl py-4'>
          {isSignInForm? "Sign In" : "Sign Up"}
          </h1>
            {!isSignInForm && (
            <input ref={name} type='text' placeholder='Full Name' className='p-4 my-4 w-full rounded-lg'/>)}
            <input ref={email} type='text' placeholder='Email Address' className='p-4 my-4 w-full rounded-lg'/>
            <input ref={password} type='password' placeholder='Password' className='p-4 my-4 w-full rounded-lg'/>
            <p className='text-red-500 font-bold text-lg py-2'>{errorMessage}</p>
            <button className='w-full rounded-lg p-4 my-6 bg-red-700 hover:bg-red-900  cursor-pointer' onClick={handleButtonClick}>
              {isSignInForm? "Sign In" : "Sign Up"}
              </button>
            <p className='py-4 cursor-pointer' onClick={toggleSignInForm}>
            {isSignInForm? "New to Netflix? Sign Up Now" : "Already a User? Sign In Now"}
              </p>
        </form>
    </div>
  )
}

export default Login;
