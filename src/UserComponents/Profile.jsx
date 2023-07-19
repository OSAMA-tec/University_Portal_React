import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function UserProfile() {
  const token = localStorage.getItem('token');
  const [profile, setProfile] = useState({
    regNo: '',
    name: '',
    email: '',
    profilePicture: '',
    grade: ''
  });

  useEffect(() => {
    axios.get('https://universityportal-9c90610042e0.herokuapp.com/user/profile', {
      headers: {
        'x-auth-token': token
      }
    }).then(response => {
      response.data.profilePicture = `https://universityportal-9c90610042e0.herokuapp.com/image/${response.data.profilePicture}`;
      setProfile(response.data);
    }).catch(error => {
      console.error(error);
    });
  }, [token]);

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('profilePicture', file);

    axios.put('https://universityportal-9c90610042e0.herokuapp.com/user/profile-picture', formData, {
      headers: {
        'x-auth-token': token,
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      setProfile(prevProfile => ({ ...prevProfile, profilePicture: `https://universityportal-9c90610042e0.herokuapp.com/image/${response.data.profilePicture}` }));
    }).catch(error => {
      console.error(error);
    });
  };

  return (
    <motion.div 
      className="grid md:grid-cols-2 gap-4 p-8 bg-white shadow-lg rounded-lg"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 1 }}>
      <div className="flex items-center justify-center space-x-4">
        <motion.img 
          src={profile.profilePicture} 
          alt="Profile" 
          className="rounded-full h-48 w-48 object-cover shadow-lg border-4 border-blue-500"
          initial={{ x: '-100vw' }} 
          animate={{ x: 0 }} 
          transition={{ type: 'spring', stiffness: 120 }}/>
        <input type="file" onChange={handleProfilePictureChange} className="hidden" id="fileUpload"/>
        <label htmlFor="fileUpload" className="mt-2 cursor-pointer py-2 px-4 bg-blue-500 rounded text-white text-sm hover:bg-blue-600 transition duration-200 ease-in-out">Upload</label>
      </div>
      <div className="space-y-4">
        <motion.h2 
          className="text-2xl font-semibold text-blue-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}>{profile.name}</motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}><span className="font-semibold text-gray-600">Registration Number:</span> {profile.regNo}</motion.p>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}><span className="font-semibold text-gray-600">Email:</span> {profile.email}</motion.p>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}><span className="font-semibold text-gray-600">Grade:</span> {profile.grade}</motion.p>
      </div>
    </motion.div>
  );
}