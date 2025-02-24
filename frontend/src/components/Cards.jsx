import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cards = ({ movie }) => {
  const navigate = useNavigate();

  const handleReviewClick = (e) => {
    e.stopPropagation();
    navigate(`/movie/${movie.id}/review-rating`);
  };

  return (
    <div
      className="bg-slate-50 p-4 rounded-lg outline-none cursor-pointer hover:shadow-lg hover:shadow-slate-300 hover:bg-gray-300 transition-all h-full flex flex-col"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <img
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://via.placeholder.com/200'}
        alt={movie.title}
        className="w-full h-60 object-cover rounded-lg md:h-72 lg:h-60 xl:h-80"
      />
      <div className="flex flex-col flex-grow justify-between mt-3">
        <div>
          <h3 className="text-lg sm:text-xl md:text-2xl text-cyan-800 font-bold break-words">
            {movie.title}
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-cyan-800">
            {movie.release_date ? movie.release_date.split('-')[0] : 'Unknown Year'}
          </p>
        </div>
        <button
          onClick={handleReviewClick}
          className="mt-2 text-cyan-700 outline p-2 rounded-lg hover:bg-cyan-700 hover:text-white hover:outline-none transition-all text-sm sm:text-base md:text-lg"
        >
          Review & Rating
        </button>
      </div>
    </div>
  );
};

export default Cards;
