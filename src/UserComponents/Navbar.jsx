import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { AiFillHome } from 'react-icons/ai';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            axios.get('https://universityportal-9c90610042e0.herokuapp.com/admin/whoami', {
                headers: {
                    'x-auth-token': token
                }
            }).then(response => {
                setIsAdmin(response.data.role === 'admin');
            }).catch(error => {
                console.error(error);
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate("/");
    };

    const variants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: "-100%" },
    };

    const homeIconVariants = {
        hover: { rotate: 90 },
        tap: { scale: 0.95 },
    };

    return (
        <nav className="bg-blue-400 p-6 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                <motion.div className="text-white font-bold text-3xl cursor-pointer" whileHover="hover" whileTap="tap" variants={homeIconVariants}>
                    <Link to="/">
                        <AiFillHome className="navbar-icon"/>
                    </Link>
                </motion.div>
                
                <button type="button" className={`md:hidden text-white ${isOpen ? 'text-3xl' : 'text-2xl'}`} onClick={toggle}>
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
    
                <AnimatePresence>
                    {(isOpen || window.innerWidth > 768) && (
                        <motion.div
                            className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-20 md:static md:flex md:w-auto md:bg-transparent md:shadow-none"
                            key="sidebar"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={variants}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="md:flex-grow">
                                <Link className="block md:inline-block text-gray-600 px-4 py-2 md:mx-2 hover:text-gray-800 hover:bg-gray-300 rounded" to="/" onClick={toggle}>Home</Link>
                                {isLoggedIn ? (
                                    isAdmin ? (
                                        // Admin Navbar
                                        <>
                                            <Link className="block md:inline-block text-gray-600 px-4 py-2 md:mx-2 hover:text-gray-800 hover:bg-gray-300 rounded" to="/admin/users" onClick={toggle}>Users</Link>
                                            <Link className="block md:inline-block text-gray-600 px-4 py-2 md:mx-2 hover:text-gray-800 hover:bg-gray-300 rounded" to="/admin/grade" onClick={toggle}>Grade</Link>
                                            <Link className="block md:inline-block text-gray-600 px-4 py-2 md:mx-2 hover:text-gray-800 hover:bg-gray-300 rounded" to="/admin/attendance" onClick={toggle}>Attendance</Link>
                                            <Link className="block md:inline-block text-gray-600 px-4 py-2 md:mx-2 hover:text-gray-800 hover:bg-gray-300 rounded" to="/admin/leaves" onClick={toggle}>Leaves</Link>
                                            <button className="block md:inline-block w-full md:w-auto text-center bg-red-500 px-4 py-2 md:mx-2 rounded hover:bg-red-600" onClick={handleLogout}>Logout</button>
                                        </>
                                    ) : (
                                        // User Navbar
                                        <>
                                            <Link className="block md:inline-block text-gray-600 px-4 py-2 md:mx-2 hover:text-gray-800 hover:bg-gray-300 rounded" to="/user/leave" onClick={toggle}>Leave</Link>
                                            <Link className="block md:inline-block text-gray-600 px-4 py-2 md:mx-2 hover:text-gray-800 hover:bg-gray-300 rounded" to="/user/attendance" onClick={toggle}>Attendance</Link>
                                            <Link className="block md:inline-block text-gray-600 px-4 py-2 md:mx-2 hover:text-gray-800 hover:bg-gray-300 rounded" to="/user/profile" onClick={toggle}>Profile</Link>
                                            <button className="block md:inline-block w-full md:w-auto text-center bg-red-500 px-4 py-2 md:mx-2 rounded hover:bg-red-600" onClick={handleLogout}>Logout</button>
                                        </>
                                    )
                                ) : (
                                    <>
                                        <Link className="block md:inline-block text-gray-600 px-4 py-2 md:mx-2 hover:text-gray-800 hover:bg-gray-300 rounded" to="/login" onClick={toggle}>Login</Link>
                                        <Link className="block md:inline-block text-gray-600 px-4 py-2 md:mx-2 hover:text-gray-800 hover:bg-gray-300 rounded" to="/signup" onClick={toggle}>Signup</Link>
                                        <Link className="block md:inline-block text-gray-600 px-4 py-2 md:mx-2 hover:text-gray-800 hover:bg-gray-300 rounded" to="/admin/login" onClick={toggle}>Admin Login</Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}