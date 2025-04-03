import { useDispatch, useSelector } from "react-redux";
import { addNowPlayingMovies } from "../utils/moviesSlice";
import { useEffect } from "react";
import { API_OPTIONS } from "../utils/constant";

const useNowPlayingMovies = () => {
  const dispatch = useDispatch();

  const nowPlayingMovies = useSelector(store => store.movies.nowPlayingMovies);

  useEffect(() => {
    
    const getNowPlayingMovies = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/movie/now_playing?page=1",
          API_OPTIONS
        );
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        const json = await response.json();

        if (json.results) {
          dispatch(addNowPlayingMovies(json.results));
        } else {
          console.error("Error: No results found in API response.");
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };
    !nowPlayingMovies && 
    getNowPlayingMovies();
  }, []);

  return null; // Ensure it's a valid hook
};

export default useNowPlayingMovies;
