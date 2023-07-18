import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { AnimatedBackground } from '../UserComponents/AnimatedBackground';

const buttonVariants = {
    hover: {
        scale: [1, 1.1],
        backgroundColor: ["#2563EB", "#3B82F6"],
        boxShadow: ["0 0 0px #2563EB", "0 0 10px #3B82F6", "0 0 0px #2563EB"],
        transition: {
            duration: 0.5,
            yoyo: Infinity,
        }
    },
}

const textVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { 
            delay: 0.5, 
            duration: 1,
        },
    },
    exit: {
        opacity: 0,
        transition: { ease: 'easeInOut' }
    }
}

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen relative overflow-hidden">
            <AnimatedBackground />
           
            <div className="flex-grow flex items-center justify-center text-center p-4">
                <div>
                    <motion.h1 
                        className="text-4xl mb-4 text-white" 
                        style={{
                            fontFamily: "'Lora', serif",
                            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)',
                        }}
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        Welcome to Our University
                    </motion.h1>
                    <motion.div variants={buttonVariants} whileHover="hover">
                        <Link to="/signup" 
                            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                            style={{fontFamily: "'Open Sans', sans-serif"}}
                        >
                            Get Started
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};