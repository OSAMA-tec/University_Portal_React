import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Helmet } from "react-helmet";

export default function Users() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('https://universityportal-9c90610042e0.herokuapp.com/admin/getUsers', {
      headers: {
        'x-auth-token': token
      }
    }).then(response => {
      setUsers(response.data.users);
    }).catch(error => {
      console.error(error);
    });
  }, [token]);

  return (
    <div className="p-4 font-sans bg-gray-100 min-h-screen">
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
      </Helmet>
      <h2 className="text-3xl font-bold text-blue-800 mb-6">User Details</h2>
      <motion.div className="grid md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {users.map((user) => (
          <motion.div key={user._id} className="border rounded-lg p-6 shadow-lg bg-white transition-transform duration-500 ease-in-out transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center">
              <img src={user.profilePicture} alt="Profile" className="w-16 h-16 rounded-full mr-4"/>
              <div>
                <h3 className="font-bold text-lg text-blue-700">{user.name}</h3>
                <p className="text-gray-600">Reg No: {user.regNo}</p>
              </div>
            </div>
            <p className="text-gray-600 mt-2">Email: {user.email}</p>
            <p className="text-gray-600">Grade: {user.grade}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}