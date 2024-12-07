import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaUserShield, FaKey, FaSpinner, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        'http://localhost:3000/api/admin/roles',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setRoles(response.data.data.roles);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch roles');
      setLoading(false);
    }
  };

  const handleRoleClick = (role) => {
    setSelectedRole(selectedRole?._id === role._id ? null : role);
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
        <h1 className="text-3xl font-bold text-gray-800">Role Management</h1>
        <p className="text-gray-600 mt-2">Manage system roles and their permissions</p>
      </motion.div>

      {/* Action Buttons */}
      <div className="mb-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <FaPlus />
          <span>Create New Role</span>
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roles List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaUserShield className="mr-2" />
              System Roles
            </h2>
          </div>
          <div className="divide-y">
            {roles.map((role) => (
              <motion.div
                key={role._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedRole?._id === role._id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleRoleClick(role)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 capitalize">
                      {role.name}
                    </h3>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {role.active ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        Inactive
                      </span>
                    )}
                    <div className="flex space-x-1">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <FaEdit />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Permissions Details */}
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaKey className="mr-2" />
                Permissions for {selectedRole.name}
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {selectedRole.permissions.map((permission) => (
                  <motion.div
                    key={permission._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {permission.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {permission.description}
                        </p>
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
                      </div>
                      <div className="flex items-center">
                        {permission.module && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            {permission.module}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}

export default RolesPage; 