import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Cards from '../components/Cards';

const API_KEY = process.env.REACT_APP_API_KEY;
const API_URL=process.env.REACT_APP_API_URL;

const GenreSearch = () => {
    const [genre, setGenre] = useState('');
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const genresList = {
        action: 28,
        comedy: 35,
        drama: 18,
        thriller: 53,
        romance: 10749,
        sciFi: 878,
        horror: 27,
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (genre.trim() === '' || !genresList[genre.toLowerCase()]) {
            setError('Please enter a valid genre (e.g., Action, Comedy, Drama, etc.)');
            setLoading(false);
            return;
        }

        const genreId = genresList[genre.toLowerCase()];

        try {
            const responses = await Promise.all([
                axios.get(`${API_URL}/discover/movie`, {
                    params: {
                        api_key: API_KEY,
                        with_genres: genreId,
                        with_original_language: 'te', 
                    },
                }),
                axios.get(`${API_URL}/discover/movie`, {
                    params: {
                        api_key: API_KEY,
                        with_genres: genreId,
                        with_original_language: 'hi', 
                    },
                }),
                axios.get(`${API_URL}/discover/movie`, {
                    params: {
                        api_key: API_KEY,
                        with_genres: genreId,
                        with_original_language: 'en', 
                    },
                }),
            ]);

            const moviesTelugu = responses[0].data.results;
            const moviesHindi = responses[1].data.results;
            const moviesEnglish = responses[2].data.results;

            const mixedMovies = [...moviesTelugu, ...moviesHindi, ...moviesEnglish].slice(0, 20); // Mix and limit to 20 results

            setMovies(mixedMovies);
            setError('');
        } catch (err) {
            setError('An error occurred while fetching movies');
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 md:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">Search By Genre</h1>
            <SearchBar
                query={genre}
                setQuery={setGenre}
                handleSearch={handleSearch}
                placeholder="Enter genre (e.g., Action, Comedy, Drama)"
            />
            {loading && <p className="text-xl text-center mt-4">Loading...</p>}
            {error && <p className="text-red-500 text-lg mt-4">{error}</p>}
            <div className="w-full p-2 mt-4">
                {movies.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {movies.map((movie) => (
                            <Cards key={movie.id} movie={movie} onClick={handleMovieClick} />
                        ))}
                    </div>
                ) : (
                    !loading && (
                        <p className="text-lg text-center mt-4">No movies found. Try searching for another genre!</p>
                    )
                )}
            </div>
        </div>
    );
};

export default GenreSearch;
