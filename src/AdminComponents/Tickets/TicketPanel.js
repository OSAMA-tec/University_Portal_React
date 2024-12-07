import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaFilter, FaSearch, FaExclamationCircle, FaClock, FaUser } from 'react-icons/fa';
import TicketChat from './TicketChat';

function TicketPanel() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: 'open',
    priority: '',
    category: ''
  });
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [currentPage, filters]);

  const fetchTickets = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.category && { category: filters.category })
      });

      const response = await axios.get(
        `http://localhost:3000/api/tickets?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );

      setTickets(response.data.data.tickets);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching tickets');
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-green-600 bg-green-50';
      case 'closed': return 'text-gray-600 bg-gray-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const handleChatOpen = (ticketId) => {
    setSelectedTicketId(ticketId);
    setIsChatOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Support Tickets</h1>
            <p className="text-gray-600 mt-2">Manage and respond to customer support tickets</p>
          </div>
          <button
            onClick={() => navigate('/admin/tickets/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Ticket
          </button>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            {/* Similar filters for priority and category */}
          </div>
        </motion.div>

        {/* Tickets List */}
        <div className="grid gap-4">
          {tickets.map((ticket, index) => (
            <motion.div
              key={ticket._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${getPriorityColor(ticket.priority)}`}>
                      <FaExclamationCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{ticket.subject}</h3>
                      <p className="text-gray-600 mt-1">{ticket.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <FaUser className="mr-2" /> {ticket.customer.name}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <FaClock className="mr-2" /> {new Date(ticket.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleChatOpen(ticket._id)}
                      className="px-4 py-2 text-green-600 hover:text-green-800"
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
                      className="px-4 py-2 text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {tickets.length === 0 && (
          <div className="text-center py-12">
            <FaTicketAlt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No tickets found</h3>
            <p className="mt-2 text-gray-500">No tickets match your current filters.</p>
          </div>
        )}
      </motion.div>
      {selectedTicketId && (
        <TicketChat
          ticketId={selectedTicketId}
          isOpen={isChatOpen}
          onClose={() => {
            setIsChatOpen(false);
            setSelectedTicketId(null);
          }}
        />
      )}
    </div>
  );
}

export default TicketPanel; 