import { useEffect, useState } from 'react';
import { API_OPTIONS } from '../utils/constant';

const useGetTrailer = (movieId, mediaType) => {
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    if (!movieId) return;

    const getVideo = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${movieId}/videos?language=en-US&modestbranding=1`,
          API_OPTIONS
        );
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
          return;
        }

        // Get first trailer or first available video
        const trailer =
          data.results.find((vid) => vid.type === 'Trailer') || data.results[0];
        const url = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&loop=1&playlist=${trailer.key}`;

        setVideoUrl(url);
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };

    getVideo();
  }, [movieId]);

  return { videoUrl }; // ✅ Always return an object
};

export default useGetTrailer;