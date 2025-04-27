import React from "react";
import GptMovieSuggestions from "./GptMovieSuggestions";
import GptSearchBar from "./GptSearchBar";

const GptSearch = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black bg-gradient-to-b from-black to-red-900 overflow-y-auto">
      <div className="flex-1 h-full pt-8 px-4 sm:px-6 md:px-12 lg:px-32">
        <GptMovieSuggestions />
      </div>
    </div>
  );
};

export default GptSearch;