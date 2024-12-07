import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-500 to-blue-700">
            <div className="flex-grow flex items-center justify-center text-center p-4">
                <div>
                    <h1 
                        className="text-5xl md:text-6xl mb-8 text-white font-serif"
                        style={{
                            fontFamily: "'Lora', serif",
                            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        Welcome to Our University
                    </h1>
                    <Link 
                        to="/signup" 
                        className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 font-sans text-lg"
                        style={{fontFamily: "'Open Sans', sans-serif"}}
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </div>
    );
};
