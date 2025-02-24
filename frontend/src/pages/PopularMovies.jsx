import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import Cards from '../components/Cards';

const PopularMovies = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const apiKey = process.env.REACT_APP_API_KEY;
  const API_URL=process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [teluguResponse, hindiResponse, englishResponse] = await Promise.all([
          axios.get(`${API_URL}/discover/movie`, {
            params: {
              api_key: apiKey,
              language: 'en-US',
              sort_by: 'vote_average.asc',
              'vote_count.gte': 70,
              with_original_language: 'te',
              page: 1,
            },
          }),
          axios.get(`${API_URL}/discover/movie`, {
            params: {
              api_key: apiKey,
              language: 'en-US',
              sort_by: 'vote_average.asc',
              'vote_count.gte': 300,
              with_original_language: 'hi',
              page: 1,
            },
          }),
          axios.get(`${API_URL}/discover/movie`, {
            params: {
              api_key: apiKey,
              language: 'en-US',
              sort_by: 'vote_average.asc',
              'vote_count.gte': 150,
              with_original_language: 'en',
              page: 1,
            },
          }),
        ]);
    
        const teluguMovies = teluguResponse.data.results.slice(0, 20);
        const hindiMovies = hindiResponse.data.results.slice(0, 20);
        const englishMovies = englishResponse.data.results.slice(0, 18);
    
        const allMovies = [...hindiMovies, ...teluguMovies, ...englishMovies];
    
        setMovies(allMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
      }
    };
    

    fetchMovies();
  }, [apiKey]);

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
      <h1 className="text-3xl font-bold text-center text-white mb-6">Popular Movies</h1>
      <div className="movies-container grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 px-2 sm:px-4">
        {movies.length === 0 ? (
          <p className="text-xl text-gray-400 text-center col-span-full">Loading movies...</p>
        ) : (
          movies.map((movie) => (
            <Cards key={movie.id} movie={movie} onClick={handleMovieClick} />
          ))
        )}
      </div>
    </div>
  );
};

export default PopularMovies;
