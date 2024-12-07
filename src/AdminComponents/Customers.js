import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Customers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchUsers();
  }, [currentPage, navigate]);

  const fetchUsers = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('No admin token found');
      }

      const response = await axios.get(
        `http://localhost:3000/api/admin/users?active=true&page=${currentPage}&limit=10&sort=-createdAt`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (response.data.status === 'success') {
        setUsers(response.data.data.users);
        setTotalResults(response.data.results);
      } else {
        throw new Error('Failed to fetch users');
      }
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        navigate('/admin/login');
      }
      setError(err.response?.data?.message || 'Error fetching users');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">
          <h3 className="text-xl font-bold">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
        <p className="text-gray-600 mt-2">Manage and view all customer information</p>
      </motion.div>

      {/* Customer List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid gap-6">
          {users.map((user) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="grid md:grid-cols-4 gap-4">
                {/* Basic Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <FaUser className="text-blue-500" />
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <FaEnvelope className="text-gray-400" />
                    <p>{user.email}</p>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <FaPhone className="text-gray-400" />
                    <p>{user.phone}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className="text-green-500" />
                    <h4 className="font-semibold">Address</h4>
                  </div>
                  <p className="text-gray-600">{user.address.street}</p>
                  <p className="text-gray-600">
                    {user.address.city}, {user.address.state} {user.address.zipCode}
                  </p>
                </div>

                {/* Role & Status */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {user.role.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <FaClock className="text-gray-400" />
                    <p>Joined: {formatDate(user.createdAt)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end items-center space-x-3">
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                    Deactivate
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white shadow-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 rounded-lg bg-blue-50">
              Page {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={users.length < 10}
              className="px-4 py-2 rounded-lg bg-white shadow-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Customers; 