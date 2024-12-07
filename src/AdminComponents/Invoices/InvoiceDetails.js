import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaArrowLeft, FaPrint, FaDownload, FaUser, FaEnvelope, FaClock, FaFileInvoice } from 'react-icons/fa';

function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInvoiceDetails();
  }, [id]);

  const fetchInvoiceDetails = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await axios.get(
        `http://localhost:3000/api/invoices/${id}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );
      
      setInvoice(response.data.data.invoice);
      setLoading(false);
    } catch (err) {
      console.error('Error details:', err);
      setError(err.response?.data?.message || 'Error fetching invoice details');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/admin/invoices')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <FaArrowLeft /> <span>Back to Invoices</span>
          </button>
          <div className="flex space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <FaPrint /> <span>Print</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FaDownload /> <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center space-x-2 text-2xl font-bold text-gray-800">
                <FaFileInvoice className="text-blue-500" />
                <span>{invoice.invoiceNumber}</span>
              </div>
              <p className={`mt-2 px-3 py-1 rounded-full text-sm inline-block
                ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                  invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'}`}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-medium">{formatDate(invoice.createdAt)}</p>
              <p className="text-sm text-gray-500 mt-2">Due Date</p>
              <p className="font-medium">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-8 p-6 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold mb-4 flex items-center space-x-2">
                <FaUser className="text-blue-500" />
                <span>Customer Details</span>
              </h3>
              <p className="font-medium">{invoice.customer.name}</p>
              <div className="flex items-center space-x-2 text-gray-600 mt-2">
                <FaEnvelope className="text-gray-400" />
                <p>{invoice.customer.email}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 flex items-center space-x-2">
                <FaClock className="text-blue-500" />
                <span>Payment Information</span>
              </h3>
              <p className="text-gray-600">Payment Terms: {invoice.paymentTerms}</p>
              <p className="text-gray-600">Status: {invoice.status}</p>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Invoice Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoice.items.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{item.description}</td>
                      <td className="px-6 py-4 text-right">{item.quantity}</td>
                      <td className="px-6 py-4 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">{(item.tax * 100).toFixed(0)}%</td>
                      <td className="px-6 py-4 text-right">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Totals */}
          <div className="border-t pt-8">
            <div className="w-full md:w-1/2 ml-auto">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax Total</span>
                  <span>${invoice.taxTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-gray-600">{invoice.notes}</p>
            </div>
          )}

          {/* Created By */}
          <div className="mt-8 text-sm text-gray-500">
            <p>Created by: {invoice.createdBy.name}</p>
            <p>Last updated: {formatDate(invoice.updatedAt)}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default InvoiceDetails; 