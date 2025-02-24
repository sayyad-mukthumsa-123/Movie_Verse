import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';

const Navbar = ({ onPopularClick, onTrendingClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userId = localStorage.getItem('userId'); 

  return (
    <nav className="bg-cyan-950 text-slate-50 p-3 shadow-md w-full">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center justify-between w-full lg:w-auto">
          {/* Hamburger Icon for mobile and tablet */}
          <button 
            className="text-white lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        <div 
          className={`lg:flex ${isMenuOpen ? 'flex flex-col space-y-4 absolute top-16 left-0 w-full bg-cyan-950 p-4 shadow-md z-50' : 'hidden'} lg:block lg:static lg:bg-transparent lg:p-0 lg:space-y-0 lg:flex-row lg:space-x-10`}
        >
          <Link 
            to="/popular" 
            onClick={onPopularClick} 
            className="text-2xl lg:text-3xl font-semibold hover:text-cyan-400 hover:scale-110 transition-transform duration-300"
          >
            Popular
          </Link>
          <Link 
            to="/trending" 
            onClick={onTrendingClick} 
            className="text-2xl lg:text-3xl font-semibold hover:text-cyan-400 hover:scale-110 transition-transform duration-300"
          >
            Trending
          </Link>
          <Link 
            to="/search" 
            className="text-2xl lg:text-3xl font-semibold hover:text-cyan-400 hover:scale-110 transition-transform duration-300"
          >
            Search
          </Link>
          {/* Profile Link */}
          {userId && (
            <Link 
              to={`/profile/${userId}`} 
              className="text-2xl lg:text-3xl font-semibold hover:text-cyan-400 hover:scale-110 transition-transform duration-300"
            >
              Profile
            </Link>
          )}
          <Link 
            to={`/contact/${userId}`} 
            className="text-2xl lg:text-3xl font-semibold hover:text-cyan-400 hover:scale-110 transition-transform duration-300"
          >
            Contact
          </Link>
          {/* Logout Button - Appears at rightmost side for all screens except laptop */}
          <div className="block lg:hidden mt-4 border-t border-slate-400 pt-4">
            <Logout />
          </div>
        </div>

        {/* Logout Button - Visible only on laptop screens */}
        <div className="hidden lg:block">
          <Logout />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;