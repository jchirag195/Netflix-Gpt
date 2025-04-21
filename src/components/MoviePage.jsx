import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_OPTIONS } from '../utils/constant';
import useGetTrailer from '../hooks/useGetTrailer';
import ShimmerUI from './ShimmerUI';
import { useSelector } from 'react-redux';
import Footer from './Footer';
import Header from './Header';

const MoviePage = () => {
  const { id, type, listName } = useParams();
  const navigate = useNavigate();

  const cachedMovie = useSelector((state) =>
    state.movies[listName]?.find((m) => String(m.id) === id)
  );

  const [movie, setMovie] = useState(cachedMovie);
  const [error, setError] = useState(null);
  const { videoUrl } = useGetTrailer(id, type);

  useEffect(() => {
    if (cachedMovie) {
      setMovie(cachedMovie);
      return;
    }

    if (!id || !type) return;

    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}`,
          API_OPTIONS
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMovieDetails();
  }, [id, type, cachedMovie]);

  if (error)
    return (
      <div className="min-h-screen bg-[#1f1f1f] flex items-center justify-center">
        <p className="text-red-400 text-center text-lg font-semibold animate-pulse">
          Error: {error}
        </p>
      </div>
    );

  if (!movie) return <ShimmerUI />;

  return (
    <div className="relative text-white bg-[#1f1f1f] min-h-screen flex flex-col">
      <main className="flex-grow">
        <Header isMoviePage={true} /> {/* Pass isMoviePage as true */}
        {/* 🎬 Video or Backdrop Banner */}
        <div className="relative w-full bg-[#1f1f1f] py-8 px-4 sm:px-8 md:px-16">
          <div className="max-w-7xl mt-20 mx-auto rounded-xl overflow-hidden shadow-2xl border-2 border-gray-800 bg-black aspect-video">
            {videoUrl ? (
              <iframe
                className="w-full h-full"
                src={`${videoUrl}?autoplay=1&mute=1&loop=1&controls=1`}
                title="Movie Trailer"
                frameBorder="0"
                allow="autoplay; fullscreen; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                }}
              >
                <div className="w-full h-full bg-gradient-to-t from-[#1f1f1f] via-[#1f1f1f]/50 to-transparent" />
              </div>
            )}
          </div>
        </div>

        {/* 🎥 Movie Details */}
        <div className="relative z-10 px-4 sm:px-6 md:px-10 lg:px-16 pt-4 pb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 max-w-7xl mx-auto">
            {/* 📌 Poster */}
            <div className="flex-shrink-0 animate-fade-in-up">
              <img
                className="w-48 sm:w-64 md:w-80 h-auto rounded-xl shadow-2xl border-2 border-gray-800 transform hover:scale-105 transition-transform duration-300"
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path || movie.backdrop_path}`
                    : 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png'
                }
                alt={movie.title || movie.name}
                loading="lazy"
              />
            </div>

            {/* 📖 Movie Details */}
            <div className="flex flex-col gap-4 sm:gap-6 w-full animate-fade-in-up animation-delay-200">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                {movie.title || movie.name}
              </h1>

              <p className="text-gray-200 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl">
                {movie.overview}
              </p>

              {/* 🔹 Additional Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-gray-300">
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-red-400 uppercase tracking-wider">
                    Release:
                  </span>
                  <p className="text-sm sm:text-base">
                    {movie.release_date || movie.first_air_date || 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-red-400 uppercase tracking-wider">
                    Runtime:
                  </span>
                  <p className="text-sm sm:text-base">
                    {movie.runtime
                      ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
                      : movie.episode_run_time?.[0]
                      ? `${movie.episode_run_time[0]}m`
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-red-400 uppercase tracking-wider">
                    Rating:
                  </span>
                  <p className="text-sm sm:text-base">
                    {movie.vote_average
                      ? `${movie.vote_average.toFixed(1)}/10`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🎭 Bottom Fade Effect */}
        <div className="w-full h-24 bg-gradient-to-t from-[#1f1f1f] to-transparent pointer-events-none" />
      </main>

      <Footer />
    </div>
  );
};

export default MoviePage;