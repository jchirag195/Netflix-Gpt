import { useDispatch, useSelector } from "react-redux";
import { addPopularMovies } from "../utils/moviesSlice";
import { useEffect } from "react";
import { API_OPTIONS } from "../utils/constant";

const usePopularMovies = () => {
  const dispatch = useDispatch();

  const popularMovies = useSelector(store => store.movies.popularMovies);

  const getPopularMovies = async () => {
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/movie/popular?page=3",
        API_OPTIONS
      );
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      const json = await response.json();

      if (json.results) {
        dispatch(addPopularMovies(json.results));
      } else {
        console.error("Error: No results found in API response.");
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    }
  };
  
  useEffect(() => {
    !popularMovies &&
    getPopularMovies();
  }, []);

  return null; // Ensure it's a valid hook
};

export default usePopularMovies;