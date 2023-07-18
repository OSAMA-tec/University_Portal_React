import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Details</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {users.map((user) => (
          <div key={user._id} className="border rounded p-4 shadow bg-white">
            <div className="flex items-center">
              <img src={user.profilePicture} alt="Profile" className="w-16 h-16 rounded-full mr-4"/>
              <div>
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p>Reg No: {user.regNo}</p>
              </div>
            </div>
            <p>Email: {user.email}</p>
            <p>Grade: {user.Grade}</p>
          </div>
        ))}
      </div>
    </div>
  );
}