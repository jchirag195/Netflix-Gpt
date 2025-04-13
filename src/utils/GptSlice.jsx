import { createSlice } from "@reduxjs/toolkit";

const GptSlice = createSlice({
  name: "Gpt",
  initialState: {
    showGptSearch: false,
    movieResults: null,
    movieNames: null,
    liveSearchResults: [], // ✅ Added for live search functionality
  },
  reducers: {
    toggleGptSearchView: (state) => {
      state.showGptSearch = !state.showGptSearch;
    },
    addGptMovieResult: (state, action) => {
      const { movieNames, movieResults } = action.payload;
      state.movieNames = movieNames;
      state.movieResults = movieResults;
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
