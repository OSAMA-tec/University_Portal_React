import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { AnimatedBackground } from '../UserComponents/AnimatedBackground';

const buttonVariants = {
    hover: {
        scale: 1.1,
        transition: {
            yoyo: Infinity
        }
    }
}

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen relative overflow-hidden">
            <AnimatedBackground />
           
            <div className="flex-grow flex items-center justify-center text-center p-4">
                <div>
                    <h1 className="text-4xl mb-4" style={{
                        fontFamily: "'Montserrat', sans-serif",
                        textShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)',
                    }}>
                        Welcome to Our University
                    </h1>
                    <motion.div variants={buttonVariants} whileHover="hover">
                        <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
                            Get Started
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}