import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../src/pages/HomePage';
import UserRegistration from '../src/UserComponents/UserRegistration';
import UserLogin from '../src/UserComponents/UserLogin';
import AdminLogin from '../src/AdminComponents/AdminLogin';
import Profile from '../src/UserComponents/Profile';
import Navbar from '../src/UserComponents/Navbar';
import Footer from '../src/UserComponents/Footer';
import Leave from './UserComponents/Leave';
import Attendance from './UserComponents/Attendance';
import AttendanceAdmin from './AdminComponents/Attendance';
import Leaves from './AdminComponents/Leaves';
import Users from './AdminComponents/Users';
import Grade from './AdminComponents/Grade';
import AdminDashboard from './AdminComponents/AdminDashboard';
import AdminNavbar from './AdminComponents/AdminNavbar';
import Customers from './AdminComponents/Customers';
import CreateInvoice from './AdminComponents/Invoices/CreateInvoice';
import ShowInvoices from './AdminComponents/Invoices/ShowInvoices';
import InvoiceDetails from './AdminComponents/Invoices/InvoiceDetails';
import TicketPanel from './AdminComponents/Tickets/TicketPanel';
import CustomerDashboard from './CustomerComponents/CustomerDashboard';
import TicketChat from './AdminComponents/Tickets';
import TicketDetails from './CustomerComponents/TicketDetails';
import CreateTicket from './CustomerComponents/CreateTicket';
import RolesPage from './AdminComponents/Roles/RolesPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {window.location.pathname.includes('/admin') ? <AdminNavbar /> : <Navbar />}
        <Routes>
          <Route exact path="/" element={<HomePage/>} />
          <Route path="/signup" element={<UserRegistration/>} />
          <Route path="/login" element={<UserLogin/>} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/Admin/login" element={<AdminLogin/>} />
          <Route path="/user/profile" element={<Profile/>} />
          <Route path="/user/leave" element={<Leave/>} />
          <Route path="/user/attendance" element={<Attendance/>} />
          <Route path="/admin/attendance" element={<AttendanceAdmin/>} />
          <Route path="/admin/leaves" element={<Leaves/>} />
          <Route path="/admin/users" element={<Users/>} />
          <Route path="/admin/grade" element={<Grade/>} />
          <Route path="/admin/dashboard" element={<AdminDashboard/>} />
          <Route path="/admin/invoices" element={<ShowInvoices />} />
          <Route path="/admin/invoices/create" element={<CreateInvoice />} />
          <Route path="/admin/invoices/:id" element={<InvoiceDetails />} />
          <Route path="/admin/tickets" element={<TicketPanel />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/tickets/:id" element={<TicketDetails />} />
          <Route path="/customer/tickets/create" element={<CreateTicket />} />
          <Route path="/admin/roles" element={<RolesPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;