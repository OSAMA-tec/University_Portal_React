import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaFileInvoice, FaSearch } from 'react-icons/fa';

function ShowInvoices() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchInvoices();
  }, [currentPage, dateRange]);

  const fetchInvoices = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await axios.get(
        `http://localhost:3000/api/invoices?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&sort=-createdAt&page=${currentPage}&limit=10`,
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );
      
      setInvoices(response.data.data.invoices);
      setTotalPages(response.data.data.pagination.pages);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching invoices');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
            <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
            <p className="text-gray-600 mt-2">Manage and view all invoices</p>
          </div>
          <button
            onClick={() => navigate('/admin/invoices/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <FaPlus /> <span>Create Invoice</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchInvoices}
                className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2"
              >
                <FaSearch /> <span>Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="grid gap-6">
          {invoices.map((invoice) => (
            <motion.div
              key={invoice._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <FaFileInvoice className="text-blue-500" />
                    <div>
                      <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                      <p className="text-sm text-gray-500">{invoice.customer.name}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-semibold">${invoice.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-semibold">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                  <button
                    onClick={() => navigate(`/admin/invoices/${invoice._id}`)}
                    className="px-4 py-2 text-blue-600 hover:text-blue-800"
                  >
                    View Details
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
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === totalPages}
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

export default ShowInvoices; 