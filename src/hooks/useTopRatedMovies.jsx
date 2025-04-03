import { useDispatch } from "react-redux";
import { addTopRatedMovies } from "../utils/moviesSlice";
import { useEffect } from "react";
import { API_OPTIONS } from "../utils/constant";

const useTopRatedMovies = () => {
  const dispatch = useDispatch();

  const getTopRatedMovies = async () => {
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/movie/top_rated?page=2",
        API_OPTIONS
      );
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      const json = await response.json();

      if (json.results) {
        dispatch(addTopRatedMovies(json.results));
      } else {
        console.error("Error: No results found in API response.");
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    }
  };

  useEffect(() => {
    getTopRatedMovies();
  }, []);

  return null; // Ensure it's a valid hook
};

export default useTopRatedMovies;