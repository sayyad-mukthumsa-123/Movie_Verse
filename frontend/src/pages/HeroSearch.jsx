import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Cards from '../components/Cards';

const API_KEY = process.env.REACT_APP_API_KEY;
const API_URL=process.env.REACT_APP_API_URL;

const HeroSearch = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedQuery = sessionStorage.getItem('searchQuery');
    const storedMovies = sessionStorage.getItem('searchMovies');

    if (storedQuery) {
      setQuery(storedQuery);
    }
    if (storedMovies) {
      setMovies(JSON.parse(storedMovies));
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (query.trim() === '') {
      setError('Please enter a hero name');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/search/person`, {
        params: {
          api_key: API_KEY,
          query: query,
        },
      });

      const personId = response.data.results[0]?.id;

      if (personId) {
        const movieResponse = await axios.get(`${API_URL}/person/${personId}/movie_credits`, {
          params: { api_key: API_KEY },
        });

        const filteredMovies = movieResponse.data.cast.filter((movie) => movie.character && movie.character.length > 0);

        setMovies(filteredMovies);
        sessionStorage.setItem('searchQuery', query);
        sessionStorage.setItem('searchMovies', JSON.stringify(filteredMovies));
      } else {
        setError('Hero not found');
        setMovies([]);
        sessionStorage.removeItem('searchQuery');
        sessionStorage.removeItem('searchMovies');
      }
    } catch (err) {
      setError('An error occurred while searching for movies.');
      setMovies([]);
      sessionStorage.removeItem('searchQuery');
      sessionStorage.removeItem('searchMovies');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 md:px-8 xl:px-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">Search By Hero</h1>
      <SearchBar
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        placeholder={"Enter hero name"}
      />
      {loading && <p className="text-xl text-slate-50 mt-4">Loading...</p>}
      {error && <p className="text-red-500 text-lg mt-4">{error}</p>}
      <div className="w-full p-2 mt-4">
        {movies.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <Cards key={movie.id} movie={movie} onClick={handleCardClick} />
            ))}
          </div>
        ) : (
          !loading && (
            <p className="text-lg text-slate-50 text-center mt-4">
              No movies found. Try searching for another hero!
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default HeroSearch;
