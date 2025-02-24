import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Cards from '../components/Cards';

const API_KEY = process.env.REACT_APP_API_KEY;
const API_URL=process.env.REACT_APP_API_URL;

const DirectorSearch = () => {
    const [director, setDirector] = useState('');
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedSearchData = sessionStorage.getItem('directorSearchData');
        if (savedSearchData) {
            const { director, movies } = JSON.parse(savedSearchData);
            setDirector(director);
            setMovies(movies);
        }
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (director.trim() === '') {
            setError('Please enter a director name');
            return;
        }

        try {
            const personResponse = await axios.get(`${API_URL}/search/person`, {
                params: {
                    api_key: API_KEY,
                    query: director,
                },
            });

            const personId = personResponse.data.results[0]?.id;

            if (personId) {
                const creditsResponse = await axios.get(`${API_URL}/person/${personId}/movie_credits`, {
                    params: {
                        api_key: API_KEY,
                    },
                });

                const directedMovies = creditsResponse.data.crew.filter((movie) => movie.job === 'Director');

                setMovies(directedMovies);
                setError('');
                sessionStorage.setItem('directorSearchData', JSON.stringify({ director, movies: directedMovies }));
            } else {
                setError('Director not found');
                setMovies([]);
                sessionStorage.removeItem('directorSearchData');
            }
        } catch (err) {
            setError('An error occurred while fetching data');
            setMovies([]);
            sessionStorage.removeItem('directorSearchData');
        } finally {
            setLoading(false);
        }
    };

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    return (
        <div className="min-h-screen w-full bg-slate-900 text-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-slate-50 text-center mb-8">Search By Director</h1>
            <SearchBar
                query={director}
                setQuery={setDirector}
                handleSearch={handleSearch}
                placeholder={"Enter director name"}
            />
            {loading && <p className="text-xl text-slate-50 mt-4">Loading...</p>}
            {error && <p className="text-red-500 text-lg mt-4">{error}</p>}
            <div className="w-full mt-4 p-2">
                {movies.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                        {movies.map((movie) => (
                            <Cards key={movie.id} movie={movie} onClick={handleMovieClick} />
                        ))}
                    </div>
                ) : (!loading && (
                    <p className="text-lg text-slate-50 text-center mt-4">No movies found. Try searching for another director!</p>
                ))}
            </div>
        </div>
    );
};

export default DirectorSearch;
