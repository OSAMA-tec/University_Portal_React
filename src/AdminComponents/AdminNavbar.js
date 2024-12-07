import React from 'react';
import { Link } from 'react-router-dom';

function AdminNavbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/admin/dashboard" className="text-xl font-bold">
          Admin Panel
        </Link>
        
        <div className="flex space-x-6">
          <Link to="/admin/invoices" className="hover:text-gray-300 transition-colors">
            Invoices
          </Link>
          <Link to="/admin/customers" className="hover:text-gray-300 transition-colors">
            Customers
          </Link>
          <Link to="/admin/tickets" className="hover:text-gray-300 transition-colors">
            Tickets
          </Link>
          <button 
            onClick={() => {
              // Add logout logic here
              localStorage.removeItem('adminToken');
              window.location.href = '/admin/login';
            }}
            className="hover:text-gray-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar; 