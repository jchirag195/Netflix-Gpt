import { useDispatch } from "react-redux";
import { addUpcomingMovies } from "../utils/moviesSlice";
import { useEffect } from "react";
import { API_OPTIONS } from "../utils/constant";

const useUpcomingMovies = () => {
  const dispatch = useDispatch();

  const getUpcomingMovies = async () => {
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/movie/upcoming?page=1",
        API_OPTIONS
      );
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      const json = await response.json();

      if (json.results) {
        dispatch(addUpcomingMovies(json.results));
      } else {
        console.error("Error: No results found in API response.");
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    }
  };

  useEffect(() => {
    getUpcomingMovies();
  }, []);

  return null; // Ensure it's a valid hook
};

export default useUpcomingMovies;