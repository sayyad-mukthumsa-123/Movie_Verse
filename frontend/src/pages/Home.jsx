import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Cards from '../components/Cards';

function Home() {
  const [showPopular, setShowPopular] = useState(false);
  const [showTrending, setShowTrending] = useState(false);
  const [movies, setMovies] = useState([]);
  const apikey = process.env.REACT_APP_API_KEY;
  const api=process.env.REACT_APP_API_URL;
  console.log(api);
  
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    
    if (!token) {
      navigate("/login");
    }

    const fetchMovies = async () => {
      try {
        const [teluguResponse, hindiResponse, englishResponse] = await Promise.all([
          axios.get(`${api}/discover/movie`, {
            params: {
              api_key: apikey,
              language: 'en-US',
              sort_by: 'vote_high.desc',
              'vote_count.gte': 50,
              with_original_language: 'te',
              page: 1,
            },
          }),
          axios.get(`${api}/discover/movie`, {
            params: {
              api_key: apikey,
              language: 'en-US',
              sort_by: 'vote_high.desc',
              'vote_count.gte': 300,
              with_original_language: 'hi',
              page: 1,
            },
          }),
          axios.get(`${api}/discover/movie`, {
            params: {
              api_key: apikey,
              language: 'en-US',
              sort_by: 'vote_high.desc',
              'vote_count.gte': 150,
              with_original_language: 'en',
              page: 1,
            },
          }),
        ]);
    
        const teluguMovies = teluguResponse.data.results.slice(0, 20);
        const hindiMovies = hindiResponse.data.results.slice(0, 20);
        const englishMovies = englishResponse.data.results.slice(0, 20);
    
        const allMovies = [...teluguMovies, ...hindiMovies, ...englishMovies];
    
        setMovies(allMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
      }
    };

    fetchMovies();
  }, [navigate, apikey]);

  const handlePopularClick = () => {
    setShowPopular(true);
    setShowTrending(false);
  };

  const handleTrendingClick = () => {
    setShowTrending(true);
    setShowPopular(false);
  };

  const handleCardClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <>
      <Navbar onPopularClick={handlePopularClick} onTrendingClick={handleTrendingClick} />
      <div className="bg-slate-900 p-4">
        <div className="movies-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8 ">
          {!showPopular && !showTrending && (
            movies.length > 0 ? (
              movies.map(movie => (
                <Cards key={movie.id} movie={movie} onClick={handleCardClick} />
              ))
            ) : (
              <p className="text-center text-lg text-white">No movies available</p>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default Home;

