import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { AiFillHome } from 'react-icons/ai'; // for logo icon
import axios from 'axios'; // npm install axios
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const history = useNavigate();
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
        history("/")
    };
    return (
        <nav className="bg-blue-400 p-6">
            <div className="flex items-center justify-between">
                <div className="text-white font-bold text-3xl">
                    <Link to="/">
                        <AiFillHome className="navbar-icon"/>
                    </Link>
                </div>
                
                <div className="md:hidden">
                    <button type="button" className="text-white" onClick={toggle}>
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                <div className={`${isOpen ? 'translate-y-0' : '-translate-y-full'} md:translate-y-0 transition-all duration-500 ease-in-out transform absolute w-full mt-16 md:mt-0 md:w-auto md:static bg-blue-400 md:flex`}>
                    <Link className="text-white mx-2 hover:underline" to="/" onClick={toggle}>Home</Link>
                    {isLoggedIn ? (
                        isAdmin ? (
                            // Admin Navbar
                            <>
                                <Link className="text-white mx-2 hover:underline" to="/admin/users" onClick={toggle}>Users</Link>
                                <Link className="text-white mx-2 hover:underline" to="/admin/grade" onClick={toggle}>Grade</Link>
                                <Link className="text-white mx-2 hover:underline" to="/admin/attendance" onClick={toggle}>Attendance</Link>
                                <Link className="text-white mx-2 hover:underline" to="/admin/leaves" onClick={toggle}>Leaves</Link>
                                <button className="mx-2 bg-red-500 px-3 py-1 rounded hover:bg-red-600" onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            // User Navbar
                            <>
                                <Link className="text-white mx-2 hover:underline" to="/user/leave" onClick={toggle}>Leave</Link>
                                <Link className="text-white mx-2 hover:underline" to="/user/attendance" onClick={toggle}>Attendance</Link>
                                <Link className="text-white mx-2 hover:underline" to="/user/profile" onClick={toggle}>Profile</Link>
                                <button className="mx-2 bg-red-500 px-3 py-1 rounded hover:bg-red-600" onClick={handleLogout}>Logout</button>
                            </>
                        )
                    ) : (
                        <>
                            <Link className="text-white mx-2 hover:underline" to="/login" onClick={toggle}>Login</Link>
                            <Link className="text-white mx-2 hover:underline" to="/signup" onClick={toggle}>Signup</Link>
                            <Link className="text-white mx-2 hover:underline" to="/admin/login" onClick={toggle}>Admin Login</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}