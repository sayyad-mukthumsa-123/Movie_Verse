const axios = require("axios");
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const API_URL=process.env.API_URL

const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${API_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits`);
    return response.data;
  } catch (error) {
    return null;
  }
};

const fetchMoviesByCriteria = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/discover/movie?api_key=${TMDB_API_KEY}&${query}`);
    return response.data.results;
  } catch (error) {
    return [];
  }
};

const getRecommendations = async (req, res) => {
  const { movieId } = req.params;

  try {
    const targetMovie = await fetchMovieDetails(movieId);
    if (!targetMovie) {
      return res.status(500).json({ error: "Failed to fetch movie data." });
    }

    const genreIds = targetMovie.genres.map(genre => genre.id);
    const language = targetMovie.original_language;
    const director = targetMovie.credits.crew.find(person => person.job === 'Director')?.id;
    const hero = targetMovie.credits.cast.find(actor => actor.order === 0)?.id;
    const heroine = targetMovie.credits.cast.find(actor => actor.order === 1)?.id;

    const criteria = [];
    if (director) criteria.push(`with_crew=${director}`);
    if (hero) criteria.push(`with_cast=${hero}`);
    if (heroine) criteria.push(`with_cast=${heroine}`);
    const recommendedMovies = await fetchMoviesByCriteria(criteria.join('|'));
    const filteredRecommendations = recommendedMovies.filter(movie => movie.id.toString() !== movieId.toString());
    const topRecommendations = filteredRecommendations.slice(0, 16);

    res.json(topRecommendations);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getRecommendations };
