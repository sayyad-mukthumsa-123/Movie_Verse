import React from 'react';

const SearchBar = ({ query, setQuery, handleSearch, placeholder }) => {
  return (
    <form 
      onSubmit={handleSearch} 
      className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full px-4"
    >
      <input
        type="text"
        className="form-control w-full sm:w-[400px] md:w-[500px] lg:w-[600px] px-4 py-2 text-lg rounded-md"
        id="search-box"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        required
      />
      <div className="w-full sm:w-auto">
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 text-lg font-medium bg-slate-50 text-cyan-700 rounded-md  hover:text-white hover:bg-cyan-700 transition-all"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
