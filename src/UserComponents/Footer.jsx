import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

export default function Footer() {
    return (
        <motion.footer
            className="bg-blue-400 text-white p-6 w-full flex flex-col md:flex-row justify-between items-center"
            style={{ marginTop: 'auto' }} // This line is added to push the footer to the bottom
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div>
                <motion.p
                    whileHover={{ scale: 1.1 }}
                    className="font-semibold text-center md:text-left mb-3 md:mb-0"
                >
                    © 2023 University App. All rights reserved.
                </motion.p>
            </div>

            <nav className="space-x-4 mb-3 md:mb-0">
                <Link >
                    <motion.span
                        className="hover:text-white cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                    >
                        Terms
                    </motion.span>
                </Link>
                <Link >
                    <motion.span
                        className="hover:text-white cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                    >
                        Privacy
                    </motion.span>
                </Link>
            </nav>

            <div className="flex space-x-3">
                <motion.a 
                    href="https://www.twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}>
                    <FaTwitter className="w-6 h-6" />
                </motion.a>
                <motion.a 
                    href="https://www.instagram.com/osama" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}>
                    <FaInstagram className="w-6 h-6" />
                </motion.a>
                <motion.a 
                    href="https://www.linkedin.com/in/osamahash" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}>
                    <FaLinkedin className="w-6 h-6" />
                </motion.a>
                <motion.a 
                    href="https://www.github.com/OSAMA-tec" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}>
                    <FaGithub className="w-6 h-6" />
                </motion.a>
            </div>
        </motion.footer>
    );
}