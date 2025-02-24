import React from "react";
import { Link } from "react-router-dom";
import BackgroundImage from "../assets/home.jpg";

const Search = () => {
  const clearSearchData = () => {
    sessionStorage.clear();
    localStorage.removeItem("searchQuery");
    localStorage.removeItem("searchMovies");
  };

  const searchOptions = [
    { path: "/search/movie", label: "Search by Movie", color: "bg-blue-500" },
    { path: "/search/director", label: "Search by Director", color: "bg-green-500" },
    { path: "/search/hero", label: "Search by Hero", color: "bg-red-500" },
    { path: "/search/heroine", label: "Search by Heroine", color: "bg-purple-500" },
    { path: "/search/genre", label: "Search by Genre", color: "bg-yellow-500" },
    { path: "/search/lang", label: "Search by Language", color: "bg-indigo-500" },
  ];

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="absolute inset-0 bg-slate-900 bg-opacity-70"></div>
      <h1 className="relative z-10 text-3xl md:text-4xl font-bold text-white mb-6 text-center">Search Options</h1>
      <div className="relative z-10 flex flex-wrap justify-center gap-4 md:gap-6 w-full max-w-4xl px-4">
        {searchOptions.map((option, index) => (
          <Link
            key={index}
            to={option.path}
            className={`relative flex items-center justify-between w-full sm:w-80 h-16 md:h-20 px-6 text-white text-lg font-semibold shadow-xl rounded-lg transform transition-all ${option.color} hover:outline hover:shadow-[0px_0px_15px_5px_white]`}
            onClick={clearSearchData}
          >
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 bg-white rounded-full"></div>
            <span className="mx-auto text-lg md:text-2xl">{option.label}</span>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 bg-white rounded-full"></div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Search;
