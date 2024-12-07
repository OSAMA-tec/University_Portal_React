import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaComment, FaEye } from 'react-icons/fa';
import CustomerNavbar from './CustomerNavbar';
import TicketChat from '../AdminComponents/Tickets/TicketChat';

function CustomerDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    open: 0,
    closed: 0
  });

  useEffect(() => {
    const storedUserData = localStorage.getItem('adminData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        'http://localhost:3000/api/tickets?page=1&limit=10',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const allTickets = response.data.data.tickets;
      setTickets(allTickets);
      
      // Calculate ticket statistics
      setTicketStats({
        total: allTickets.length,
        open: allTickets.filter(t => t.status === 'open').length,
        closed: allTickets.filter(t => t.status === 'closed').length
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setLoading(false);
    }
  };

  const handleChatOpen = (ticketId) => {
    setSelectedTicketId(ticketId);
    setIsChatOpen(true);
  };

  const handleViewDetails = (ticketId) => {
    navigate(`/customer/tickets/${ticketId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <CustomerNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Tickets</p>
                <h3 className="text-2xl font-bold">{ticketStats.total}</h3>
              </div>
              <FaTicketAlt className="h-8 w-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Open Tickets</p>
                <h3 className="text-2xl font-bold text-green-600">{ticketStats.open}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaTicketAlt className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Closed Tickets</p>
                <h3 className="text-2xl font-bold text-gray-600">{ticketStats.closed}</h3>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">
                <FaTicketAlt className="h-8 w-8 text-gray-500" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/customer/tickets/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Ticket
          </button>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Your Tickets</h2>
          </div>
          <div className="divide-y">
            {tickets.map((ticket) => (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {ticket.subject}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {ticket.description}
                    </p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                        ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ticket.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        Created: {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleChatOpen(ticket._id)}
                      className="flex items-center space-x-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <FaComment className="h-4 w-4" />
                      <span>Chat</span>
                    </button>
                    <button
                      onClick={() => handleViewDetails(ticket._id)}
                      className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FaEye className="h-4 w-4" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {tickets.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <FaTicketAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p>No tickets found. Create a new ticket to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Component */}
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

export default CustomerDashboard; 