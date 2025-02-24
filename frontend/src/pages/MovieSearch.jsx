import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Cards from '../components/Cards';

const Movie = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tmdbApiKey = process.env.REACT_APP_API_KEY;
  const API_URL=process.env.REACT_APP_API_URL;
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

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_URL}/search/movie?api_key=${tmdbApiKey}&query=${query}&language=en-US`
      );
      if (response.data.results.length > 0) {
        const filteredMovies = response.data.results.filter(
          (movie) => movie.poster_path && movie.title.toLowerCase().includes(query.toLowerCase())
        );
        if (filteredMovies.length > 0) {
          setMovies(filteredMovies);
          sessionStorage.setItem('searchQuery', query);
          sessionStorage.setItem('searchMovies', JSON.stringify(filteredMovies));
        } else {
          setError('No movies found with matching criteria.');
          setMovies([]);
          sessionStorage.removeItem('searchQuery');
          sessionStorage.removeItem('searchMovies');
        }
      } else {
        setError('No movies found.');
        setMovies([]);
        sessionStorage.removeItem('searchQuery');
        sessionStorage.removeItem('searchMovies');
      }
    } catch (err) {
      setError('An error occurred while fetching data.');
      setMovies([]);
      sessionStorage.removeItem('searchQuery');
      sessionStorage.removeItem('searchMovies');
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-50 text-center mb-8">Search Movies</h1>
      <SearchBar
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        placeholder={"Enter a movie"}
      />

      {loading && <p className="text-xl text-slate-50 mt-4">Loading...</p>}
      {error && <p className="text-red-500 text-lg mt-4">Error: {error}</p>}

      <div className="w-full p-2 mt-4">
        {movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <Cards key={movie.id} movie={movie} onClick={handleMovieClick} />
            ))}
          </div>
        ) : (
          !loading && (
            <p className="text-lg text-slate-50 text-center mt-4">No movies found. Try searching for another movie!</p>
          )
        )}
      </div>
    </div>
  );
};

export default Movie;