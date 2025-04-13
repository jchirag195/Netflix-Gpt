import React from "react";
import GptMovieSuggestions from "./GptMovieSuggestions";
import GptSearchBar from "./GptSearchBar";

const GptSearch = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-red-900">
      <div className="pt-[5%] md:px-32 px-5">
        <GptMovieSuggestions />
      </div>
    </div>
  );
};

export default GptSearch;
