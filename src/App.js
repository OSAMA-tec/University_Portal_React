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

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<HomePage/>} />
          <Route path="/signup" element={<UserRegistration/>} />
          <Route path="/login" element={<UserLogin/>} />
          <Route path="/Admin/login" element={<AdminLogin/>} />
          <Route path="/user/profile" element={<Profile/>} />
          <Route path="/user/leave" element={<Leave/>} />
          <Route path="/user/attendance" element={<Attendance/>} />
          <Route path="/admin/attendance" element={<AttendanceAdmin/>} />
          <Route path="/admin/leaves" element={<Leaves/>} />
          <Route path="/admin/users" element={<Users/>} />
          <Route path="/admin/grade" element={<Grade/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;