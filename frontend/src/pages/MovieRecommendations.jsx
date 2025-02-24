import axios from '../axios/axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MovieRecommendations = ({ movieId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!movieId) {
      setError('Invalid movie ID');
      setLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/recommendations/${movieId}`);
        if (response.data && response.data.length) {
          setRecommendations(response.data);
        } else {
          setError('No recommendations found.');
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setError('Failed to fetch recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [movieId]);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="p-4 outline rounded-lg">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {recommendations.map((movie) => (
          <li
            key={movie.id}
            className="bg-gray-800 p-4 rounded-lg shadow-md outline hover:shadow-lg hover:shadow-white hover:bg-gray-700 transition cursor-pointer"
            onClick={() => handleMovieClick(movie.id)}
          >
            <p className="text-white text-lg md:text-xl font-semibold truncate">{movie.title}</p>
            <p className="text-gray-400 text-sm md:text-base">
              {movie.overview ? movie.overview.slice(0, 100) + "..." : "No description available."}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieRecommendations;
