import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Cards from '../components/Cards';

const API_KEY = process.env.REACT_APP_API_KEY;
const API_URL=process.env.REACT_APP_API_URL;

const languageMapping = {
    english: "en",
    hindi: "hi",
    telugu: "te",
    tamil: "ta",
    kannada: "kn", 
    malayalam: "ml", 
    spanish: "es",
    french: "fr",
    german: "de",
    portuguese: "pt",
    italian: "it",
};

const LanguageSearch = () => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.removeItem('languageSearchData');
        setQuery('');
        setMovies([]);
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (query.trim() === '') {
            setError('Please enter a language');
            setLoading(false);
            return;
        }

        const languageCode = languageMapping[query.trim().toLowerCase()];
        if (!languageCode) {
            setError('Invalid language. Try Telugu, Hindi, English, etc.');
            setMovies([]);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/discover/movie`, {
                params: {
                    api_key: API_KEY,
                    with_original_language: languageCode,
                },
            });

            const moviesData = response.data.results;

            if (moviesData.length > 0) {
                setMovies(moviesData);
                setError('');
                sessionStorage.setItem('languageSearchData', JSON.stringify({ query, movies: moviesData }));
            } else {
                setError('No movies found for this language');
                setMovies([]);
                sessionStorage.removeItem('languageSearchData');
            }
        } catch (err) {
            setError('An error occurred while fetching data');
            setMovies([]);
            sessionStorage.removeItem('languageSearchData');
        } finally {
            setLoading(false);
        }
    };

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">Search By Language</h1>
            <SearchBar
                query={query}
                setQuery={setQuery}
                handleSearch={handleSearch}
                placeholder={"Enter language name (e.g., Telugu, Hindi, English)"}
            />
            {loading && <p className="text-xl mt-4">Loading...</p>}
            {error && <p className="text-red-500 text-lg mt-4">{error}</p>}
            <div className="w-full p-2 mt-4">
                {movies.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {movies.map((movie) => (
                            <Cards key={movie.id} movie={movie} onClick={handleMovieClick} />
                        ))}
                    </div>
                ) : (
                    !loading && (
                        <p className="text-lg text-center mt-4">
                            No movies found. Try searching for another language!
                        </p>
                    )
                )}
            </div>
        </div>
    );
};

export default LanguageSearch;
