import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash } from 'react-icons/fa';

function CreateInvoice() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [invoiceData, setInvoiceData] = useState({
    customerId: '',
    items: [
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        tax: 0.10,
        total: 0
      }
    ],
    dueDate: '',
    notes: '',
    paymentTerms: 'Net 15'
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await axios.get(
        'http://localhost:3000/api/admin/users?active=true&page=1&limit=10&sort=-createdAt',
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );
      setCustomers(response.data.data.users);
    } catch (err) {
      setError('Error fetching customers');
    }
  };

  const calculateItemTotal = (item) => {
    const subtotal = item.quantity * item.unitPrice;
    const taxAmount = subtotal * item.tax;
    return subtotal + taxAmount;
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      total: field === 'quantity' || field === 'unitPrice' || field === 'tax' 
        ? calculateItemTotal({
            ...newItems[index],
            [field]: parseFloat(value) || 0
          })
        : newItems[index].total
    };
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
          tax: 0.10,
          total: 0
        }
      ]
    });
  };

  const removeItem = (index) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      await axios.post('http://localhost:3000/api/invoices', invoiceData, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      navigate('/admin/invoices');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Invoice</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {/* Customer Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer
            </label>
            <select
              value={invoiceData.customerId}
              onChange={(e) => setInvoiceData({ ...invoiceData, customerId: e.target.value })}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          {/* Items */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Items
            </label>
            {invoiceData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="col-span-4">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required
                    min="1"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required
                    step="0.01"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="Tax Rate"
                    value={item.tax}
                    onChange={(e) => handleItemChange(index, 'tax', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required
                    step="0.01"
                  />
                </div>
                <div className="col-span-1">
                  <p className="p-2 text-right">${item.total.toFixed(2)}</p>
                </div>
                <div className="col-span-1">
                  {invoiceData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <FaPlus /> <span>Add Item</span>
            </button>
          </div>

          {/* Due Date and Payment Terms */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Terms
              </label>
              <select
                value={invoiceData.paymentTerms}
                onChange={(e) => setInvoiceData({ ...invoiceData, paymentTerms: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={invoiceData.notes}
              onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
              className="w-full p-2 border rounded-lg"
              rows="3"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default CreateInvoice; 