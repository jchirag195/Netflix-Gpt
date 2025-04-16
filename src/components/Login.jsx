import React, { useRef, useState } from 'react';
import Header from './Header';
import { checkValidData } from "../utils/Validate.jsx";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../utils/Firebase.jsx';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice.jsx';
import { BG_URL } from '../utils/constant.jsx';

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  const handleButtonClick = () => {
    const message = isSignInForm
      ? checkValidData(email.current.value, password.current.value)
      : checkValidData(email.current.value, password.current.value, name.current.value);

    setErrorMessage(message);
    if (message) return;

    if (!isSignInForm) {
      // SIGN UP
      createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
        .then((userCredential) => {
          const user = userCredential.user;

          updateProfile(user, {
            displayName: name.current.value,
          }).then(() => {
            const currentUser = auth.currentUser;
            const { uid, email, displayName } = currentUser;
            dispatch(addUser({ uid, email, displayName }));
          }).catch((error) => {
            setErrorMessage("Profile update failed: " + error.message);
          });
        })
        .catch((error) => {
          setErrorMessage("Signup failed: " + error.message);
        });

    } else {
      // SIGN IN
      signInWithEmailAndPassword(auth, email.current.value, password.current.value)
        .then((userCredential) => {
          const user = userCredential.user;
          const { uid, email, displayName } = user;
          dispatch(addUser({ uid, email, displayName }));
        })
        .catch((error) => {
          setErrorMessage("Sign-in failed: " + error.message);
        });
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
    setErrorMessage(null); // clear errors when switching
  };

  return (
    <div>
      <Header />
      <div className='absolute'>
        <img src={BG_URL} alt="Background" />
      </div>
      <form onSubmit={(e) => e.preventDefault()} className='w-3/12 absolute p-12 bg-black/80 my-36 mx-auto right-0 left-0 text-white rounded-lg'>
        <h1 className='font-bold text-3xl py-4'>
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>

        {!isSignInForm && (
          <input ref={name} type='text' placeholder='Full Name' className='p-4 my-4 w-full rounded-lg' />
        )}

        <input ref={email} type='text' placeholder='Email Address' className='p-4 my-4 w-full rounded-lg' />
        <input ref={password} type='password' placeholder='Password' className='p-4 my-4 w-full rounded-lg' />

        <p className='text-red-500 font-bold text-lg py-2'>{errorMessage}</p>

        <button
          className='w-full rounded-lg p-4 my-6 bg-red-700 hover:bg-red-900 cursor-pointer'
          onClick={handleButtonClick}
        >
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>

        <p className='py-4 cursor-pointer' onClick={toggleSignInForm}>
          {isSignInForm ? "New to Netflix? Sign Up Now" : "Already a User? Sign In Now"}
        </p>
      </form>
    </div>
  );
};

export default Login;
