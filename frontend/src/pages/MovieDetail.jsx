import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import axios from 'axios';
import MovieRecommendations from './MovieRecommendations';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState('');
  const [trailerError, setTrailerError] = useState('');
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState('');

  const tmdbApiKey = process.env.REACT_APP_API_KEY;
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApiKey}&language=en-US`
        );
        setMovie(response.data);

        const creditsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${tmdbApiKey}`
        );
        const directorData = creditsResponse.data.crew.find(
          (person) => person.job === 'Director'
        );
        if (directorData) {
          setDirector(directorData.name);
        }

        fetchTrailer(id, controller);
        fetchCast(id);
      } catch (err) {
        setError('An error occurred while fetching the movie details.');
      } finally {
        setLoading(false);
      }
    };

    const fetchTrailer = async (movieId, controller) => {
      try {
        const videoResponse = await axios.get(
          `${API_URL}/movie/${movieId}/videos?api_key=${tmdbApiKey}&language=en-US`,
          {
            signal: controller.signal, 
          }
        );

        if (videoResponse.data.results.length === 0) {
          setTrailerError('No trailer available.');
          return;
        }

        const trailer =
          videoResponse.data.results.find(
            (video) =>
              video.site === 'YouTube' &&
              video.official &&
              video.type === 'Trailer'
          ) ||
          videoResponse.data.results.find(
            (video) => video.site === 'YouTube' && video.type === 'Trailer'
          );

        if (trailer) {
          setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
        } else {
          setTrailerError('No trailer found.');
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Previous trailer request aborted.');
        } else {
          setTrailerError('An error occurred while fetching the movie trailer.');
        }
      }
    };

    const fetchCast = async (movieId) => {
      try {
        const castResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${tmdbApiKey}`
        );
        setCast(castResponse.data.cast);
      } catch (err) {
        setError(`An error occurred while fetching the cast details: ${err.message}`);
      }
    };

    fetchMovieDetails();

    return () => {
      controller.abort();
    };
  }, [id]);

  if (loading) return <p className="text-center py-4">Loading...</p>;
  if (error) return <p className="text-center py-4">{error}</p>;

  return (
    <div className="container bg-slate-900 text-slate-50 px-4 py-6 relative">
      {/* Home Button */}
      <div className="flex justify-start mb-3">
        <div className="cursor-pointer p-2 outline bg-slate-900 text-slate-50 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-all">
          <FaHome size={32} onClick={() => navigate('/home')} />
        </div>
      </div>

      {movie && (
        <div>
          <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6 mb-8">
            <div className="w-full sm:w-1/2 md:w-1/3">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'https://via.placeholder.com/400'
                }
                alt={movie.title}
                className="w-full h-auto rounded-lg shadow-lg outline"
              />
            </div>
            <div className="w-full sm:w-1/2 md:w-2/3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-6 mb-6">
                {movie.title}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
                Released: {movie.release_date}
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
                Genre: {movie.genres.map((genre) => genre.name).join(', ')}
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold mb-6">
                Director: {director}
              </p>
              <div className="mb-4">
                <p className="text-3xl font-semibold text-slate-50 mb-2">
                  Overview:
                </p>
                <p className="text-2xl font-semibold text-slate-200 text-justify">
                  {movie.overview ? movie.overview : 'No overview available.'}
                </p>
              </div>
              <button
                className="w-full sm:w-auto bg-cyan-700 hover:text-cyan-700 hover:bg-slate-50 text-slate-50 font-bold p-3 rounded-lg text-lg transition-all block mx-auto m-14"
                onClick={() => navigate(`/movie/${id}/review-rating`)}
              >
                Add a Review & Rating
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-center font-bold bg-slate-50 text-cyan-700 p-3 rounded-lg">
              Trailer
            </h2>
            {trailerUrl ? (
              <div className="w-full h-64 sm:h-80 md:h-[550px]">
                <iframe
                  src={trailerUrl}
                  title="YouTube video player"
                  className="w-full h-full rounded-lg shadow-lg outline mt-2"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <p className="text-white text-center mt-4">
                {trailerError || 'Loading trailer...'}
              </p>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl text-center font-bold bg-slate-50 text-cyan-700 p-3 rounded-lg mt-8 mb-2">
            Recommended Movies
          </h2>
          <MovieRecommendations movieId={movie.id} />
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
