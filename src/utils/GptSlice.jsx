import { createSlice } from "@reduxjs/toolkit";

const GptSlice = createSlice({
  name: "Gpt",
  initialState: {
    showGptSearch: false,
    movieResults: null,
    movieNames: null,
    liveSearchResults: [],
  },
  reducers: {
    toggleGptSearchView: (state) => {
      state.showGptSearch = !state.showGptSearch;
    },
    addGptMovieResult: (state, action) => {
      const { movieNames, movieResults } = action.payload;

      // Flatten and deduplicate movies by title
      const flatResults = movieResults.flat();
      const uniqueMoviesMap = new Map();
      for (const movie of flatResults) {
        if (!uniqueMoviesMap.has(movie.title)) {
          uniqueMoviesMap.set(movie.title, movie);
        }
      }

      // Get the unique movies and pad array to 5 if needed
      const uniqueMovies = Array.from(uniqueMoviesMap.values());
      while (uniqueMovies.length < 5) {
        uniqueMovies.push(null); // to maintain spacing in UI
      }

      state.movieNames = movieNames;
      state.movieResults = [uniqueMovies];
    },
    setLiveSearchResults: (state, action) => {
      state.liveSearchResults = action.payload;
    },
    clearGptResults: (state) => {
      state.movieResults = null;
      state.movieNames = null;
      state.liveSearchResults = [];
    },
  },
});

export const {
  toggleGptSearchView,
  addGptMovieResult,
  setLiveSearchResults,
  clearGptResults,
} = GptSlice.actions;

export default GptSlice.reducer;
