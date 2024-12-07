import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFileInvoice, FaUsers, FaTicketAlt, FaComments, FaLock, FaUserTag, FaChartLine } from 'react-icons/fa';
import axios from 'axios';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    openTickets: 0,
    activeSubscriptions: 0,
    pendingBills: 0,
    recentUsers: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await axios.get(
        'http://localhost:3000/api/admin/dashboard',
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );

      setStats({
        totalUsers: response.data.data.totalUsers,
        activeUsers: response.data.data.activeUsers,
        openTickets: response.data.data.openTickets || 0, // Assuming you still want to keep this
        activeSubscriptions: response.data.data.activeSubscriptions,
        pendingBills: response.data.data.pendingBills,
        recentUsers: response.data.data.recentUsers
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const dashboardSections = [
    { title: 'Invoices', icon: <FaFileInvoice />, color: 'blue', path: '/admin/invoices', count: '150+' },
    { title: 'Customers', icon: <FaUsers />, color: 'green', path: '/admin/customers', count: stats.totalUsers },
    { title: 'Active Users', icon: <FaUsers />, color: 'green', path: '/admin/users', count: stats.activeUsers },
    { title: 'Tickets', icon: <FaTicketAlt />, color: 'red', path: '/admin/tickets', count: stats.openTickets },
    { title: 'Chats', icon: <FaComments />, color: 'purple', path: '/admin/chats', count: '18' },
    { title: 'Subscriptions', icon: <FaLock />, color: 'orange', path: '/admin/subscriptions', count: stats.activeSubscriptions },
    { title: 'Pending Bills', icon: <FaUserTag />, color: 'pink', path: '/admin/bills', count: stats.pendingBills },
    { title: 'Performance Insight', icon: <FaChartLine />, color: 'teal', path: '/admin/performance', count: 'View' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      >
        {['Total Users', 'Active Users', 'Pending Bills', 'Active Subscriptions'].map((stat, index) => (
          <motion.div
            key={stat}
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-gray-500 text-sm">{stat}</h3>
            <p className="text-2xl font-bold mt-2">
              {index === 0 ? stats.totalUsers : index === 1 ? stats.activeUsers : index === 2 ? stats.pendingBills : stats.activeSubscriptions}
            </p>
            <span className="text-green-500 text-sm">+2.5% from last month</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Sections Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {dashboardSections.map((section) => (
          <motion.div
            key={section.title}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
            onClick={() => navigate(section.path)}
          >
            <div className={`p-6 transition-all duration-300 hover:bg-${section.color}-50`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${section.color}-100 text-${section.color}-600`}>
                  {section.icon}
                </div>
                <span className={`text-${section.color}-600 font-semibold`}>{section.count}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{section.title}</h3>
              <p className="text-gray-500 mt-2">
                Manage your {section.title.toLowerCase()} and related settings
              </p>
            </div>
            <div className={`h-1 bg-${section.color}-500`}></div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10 bg-white rounded-xl shadow-sm p-6"
      >
        <h2 className="text-2xl font-bold mb-4">Recent Users</h2>
        <div className="space-y-4">
          {stats.recentUsers.map((user) => (
            <div key={user._id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex-1">
                <p className="text-gray-800">{user.name} ({user.email})</p>
                <p className="text-sm text-gray-500">Role: {user.role.name}</p>
                <p className="text-sm text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default AdminDashboard; 