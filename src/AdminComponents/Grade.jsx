import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Helmet } from "react-helmet";

export default function Grade() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [grade, setGrade] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleGradeUpdate = (userId) => {
    axios.put(`https://universityportal-9c90610042e0.herokuapp.com/admin/grade/users/${userId}`, {
      marks: grade
    }, {
      headers: {
        'x-auth-token': token
      }
    }).then(response => {
      const updatedUsers = users.map(user => 
        user._id === userId ? {...user, grade: grade} : user
      );
      setUsers(updatedUsers);
      setSelectedUser(null);
      setGrade('');
      setSuccessMessage(response.data.msg);
      setErrorMessage('');
    }).catch(error => {
      console.error(error);
      setErrorMessage(error.response.data.msg);
      setSuccessMessage('');
    });
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'text-green-500';
      case 'B': return 'text-blue-500';
      case 'C': return 'text-brown-500';
      case 'D': return 'text-yellow-500';
      case 'F': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="p-4 font-sans bg-gray-100 min-h-screen">
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
      </Helmet>
      <h2 className="text-3xl font-bold text-blue-800 mb-6">User Grades</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <motion.div className="grid md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {users.map((user) => (
          <motion.div key={user._id} className="border rounded-lg p-6 shadow-lg bg-white cursor-pointer transition-transform duration-500 ease-in-out transform hover:scale-105" onClick={() => setSelectedUser(user._id)}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center">
              <img src={user.profilePicture} alt="Profile" className="w-16 h-16 rounded-full mr-4"/>
              <div>
                <p className="text-gray-600">Registration No: {user.regNo}</p>
                <p className="text-gray-600">Email: {user.email}</p>
                <p className="text-gray-600">Grade: <span className={`font-bold ${getGradeColor(user.grade)}`}>{user.grade}</span></p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      {selectedUser && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50">
          <motion.div className="bg-white p-6 rounded-lg shadow max-w-sm w-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <button onClick={() => setSelectedUser(null)} className="float-right">X</button>
            <h2 className="text-2xl font-bold mb-4">Update Grade</h2>
            <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} className="border rounded-lg p-2 w-full mb-4" placeholder="Enter marks"/>
            <button onClick={() => handleGradeUpdate(selectedUser)} className="bg-blue-500 text-white rounded-lg px-4 py-2">Update</button>
          </motion.div>
          </div>
      )}
    </div>
  );
}
