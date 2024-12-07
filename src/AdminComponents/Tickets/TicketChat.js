import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaPaperPlane, FaTimes, FaSpinner, FaUser, FaLock } from 'react-icons/fa';

function TicketChat({ ticketId, onClose, isOpen }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [ticketId, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await axios.get(
        `http://localhost:3000/api/tickets/${ticketId}/messages?page=1&limit=50`,
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );
      setMessages(response.data.data.messages.reverse());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await axios.post(
        `http://localhost:3000/api/tickets/${ticketId}/messages`,
        {
          content: newMessage,
          isInternal: false
        },
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );
      setMessages(prev => [...prev, response.data.data.message]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-0 right-4 w-96 h-[600px] bg-white rounded-t-xl shadow-xl flex flex-col"
      >
        {/* Chat Header */}
        <div className="p-4 border-b flex justify-between items-center bg-blue-600 text-white rounded-t-xl">
          <h3 className="font-semibold">Ticket Chat</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-700 rounded"
          >
            <FaTimes />
          </button>
        </div>

        {/* Messages Container */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
            </div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender._id === localStorage.getItem('adminId') ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  message.sender._id === localStorage.getItem('adminId')
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                  } rounded-lg p-3`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <FaUser className="h-4 w-4" />
                    <span className="text-sm font-medium">{message.sender.name}</span>
                    {message.isInternal && (
                      <FaLock className="h-3 w-3" title="Internal Message" />
                    )}
                  </div>
                  <p>{message.content}</p>
                  <span className="text-xs opacity-75 block mt-1">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
            >
              {sending ? (
                <FaSpinner className="animate-spin h-4 w-4" />
              ) : (
                <FaPaperPlane />
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}

export default TicketChat; 