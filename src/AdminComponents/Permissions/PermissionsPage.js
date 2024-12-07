import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaKey, FaSpinner } from 'react-icons/fa';

function PermissionsPage() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        'http://localhost:3000/api/admin/permissions',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPermissions(response.data.data.permissions);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch permissions');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
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
        <h1 className="text-3xl font-bold text-gray-800">Permissions Management</h1>
        <p className="text-gray-600 mt-2">Manage system permissions and their actions</p>
      </motion.div>

      {/* Permissions List */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">System Permissions</h2>
        </div>
        <div className="divide-y">
          {permissions.map((permission) => (
            <motion.div
              key={permission._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-800">{permission.name}</h3>
              <p className="text-sm text-gray-500">{permission.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {permission.actions.map((action) => (
                  <span
                    key={action}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {action}
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-500">Module: {permission.module}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}

export default PermissionsPage; 