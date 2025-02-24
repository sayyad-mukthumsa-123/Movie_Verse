import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import Cards from '../components/Cards';

const TrendingMovies = () => {
  const [movies, setMovies] = useState([]);
  const tmdbApiKey = process.env.REACT_APP_API_KEY;
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let allMovies = [];
        const languages = ['en', 'hi', 'ten'];

        for (const lang of languages) {
          const response = await axios.get(`${API_URL}/discover/movie?api_key=${tmdbApiKey}&language=en-US&with_original_language=${lang}&sort_by=popularity.desc&page=1`);
          if (response.data.results) {
            allMovies = [...allMovies, ...response.data.results];
          } else {
            console.error(`Error fetching ${lang} movies: `, response.data.status_message);
          }
        }

        const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.id, movie])).values());

        setMovies(uniqueMovies);
      } catch (error) {
        console.error("There was an error fetching the movies!", error);
      }
    };

    fetchMovies();
  }, [tmdbApiKey]);

  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };

  return (
    <div className="bg-slate-900 min-h-screen p-4">
      <div className="flex justify-start mb-2">
        <div className="cursor-pointer p-2 outline bg-slate-900 text-slate-50 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-all">
          <FaHome size={32} onClick={() => navigate('/home')} />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-center text-white mb-6">Trending Movies</h1>
      <div className="movies-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 px-2 sm:px-4">
        {movies.length === 0 ? (
          <p className="text-xl text-gray-400 text-center col-span-full">Loading movies...</p>
        ) :
          (movies.map(movie => (
            <Cards
              key={movie.id}
              movie={movie}
              onClick={handleMovieClick}
            />
          )))
        }
      </div>
    </div>
  );
};

export default TrendingMovies;