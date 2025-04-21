import { useEffect, useState } from "react";
import { API_OPTIONS } from "../utils/constant";

const useGetTrailer = (movieId, type = "movie") => {
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!movieId || !type) return;

    const fetchVideo = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${type}/${movieId}/videos`,
          API_OPTIONS
        );
        const data = await response.json();

        const trailer =
          data.results?.find(
            (vid) =>
              vid.type === "Trailer" &&
              vid.site === "YouTube" &&
              vid.official
          ) ||
          data.results?.find((vid) => vid.site === "YouTube");

        if (isMounted) {
          setVideoUrl(trailer ? `https://www.youtube.com/embed/${trailer.key}` : null);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to fetch trailer:", error);
          setVideoUrl(null);
        }
      }
    };

    fetchVideo();

    return () => {
      isMounted = false; // 🧹 Cleanup on unmount
    };
  }, [movieId, type]);

  return { videoUrl };
};

export default useGetTrailer;
