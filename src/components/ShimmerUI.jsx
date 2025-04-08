import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Netflix-style circular loader
const ShimmerUI = () => {
  const loaderRef = useRef(null);

  useEffect(() => {
    gsap.to(loaderRef.current, {
      rotation: 360,
      repeat: -1,
      duration: 1.2,
      ease: 'linear',
    });
  }, []);

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center">
      <div className="relative w-16 h-16">
        <div
          ref={loaderRef}
          className="w-full h-full border-4 border-red-600 border-t-transparent rounded-full"
        />
      </div>
      <h1 className="text-white text-lg font-semibold mt-4">Loading...</h1>
    </div>
  );
};

export default ShimmerUI;