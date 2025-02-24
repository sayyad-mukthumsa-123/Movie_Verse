import React from 'react';
import { Link } from 'react-router-dom';
import bgImage from "../assets/home.jpg";

const Welcome = () => {
    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center bg-cover bg-center px-4 sm:px-6 md:px-8"
            style={{ backgroundImage: `url(${bgImage})` }}>

            <div className="absolute inset-0 bg-slate-900 bg-opacity-80"></div>
            <div className="relative z-10 text-center px-4 sm:px-6 md:px-8">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 text-white">MovieVerse</h1>
                <p className="text-lg sm:text-xl md:text-2xl max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto font-medium leading-relaxed text-white text-justify">
                    Explore a vast universe of movies, from the latest blockbusters to timeless classics. Join MovieVerse to discover and enjoy cinematic brilliance like never before.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/login">
                        <button className="px-4 py-3 sm:px-6 sm:py-3 md:px-8 md:py-3 text-lg sm:text-xl md:text-2xl font-medium text-slate-50 bg-cyan-600 rounded-md hover:bg-cyan-700 transition-all">
                            Sign In
                        </button>
                    </Link>
                    <Link to="/register">
                        <button className="px-4 py-3 sm:px-6 sm:py-3 md:px-8 md:py-3 text-lg sm:text-xl md:text-2xl font-medium text-slate-50 bg-cyan-600 rounded-md hover:bg-cyan-700 transition-all">
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Welcome;