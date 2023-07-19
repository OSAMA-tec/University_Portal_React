import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" }}
};

export default function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('https://universityportal-9c90610042e0.herokuapp.com/user/leaves', {
      headers: {
        'x-auth-token': token
      }
    }).then(response => {
      setLeaves(response.data);
    }).catch(error => {
      console.error(error);
    });
  }, [token]);

  const handleLeaveApplication = () => {
    axios.post('https://universityportal-9c90610042e0.herokuapp.com/user/leave-user', {
      startDate,
      endDate,
      reason
    }, {
      headers: {
        'x-auth-token': token
      }
    }).then(response => {
      setLeaves(prevLeaves => [response.data, ...prevLeaves]);
      setStartDate('');
      setEndDate('');
      setReason('');
    }).catch(error => {
      console.error(error);
    });
  };

  return (
    <motion.div className="p-4 bg-gray-100 min-h-screen" variants={variants} initial="hidden" animate="visible">
      <h2 className="text-3xl font-bold mb-4 text-gray-700">Apply for leave</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-lg">Start Date</label>
        <motion.input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          className="border-2 rounded-lg p-2 w-full transition duration-500 ease-in-out focus:border-blue-500 focus:outline-none mt-2 shadow-md"
          variants={itemVariants}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-lg">End Date</label>
        <motion.input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          className="border-2 rounded-lg p-2 w-full transition duration-500 ease-in-out focus:border-blue-500 focus:outline-none mt-2 shadow-md"
          variants={itemVariants}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-lg">Reason</label>
        <motion.textarea 
          value={reason} 
          onChange={(e) => setReason(e.target.value)} 
          className="border-2 rounded-lg p-2 w-full transition duration-500 ease-in-out focus:border-blue-500 focus:outline-none mt-2 shadow-md"
          rows="5"
          variants={itemVariants}
        />
      </div>
      <motion.button 
        onClick={handleLeaveApplication} 
        className="bg-blue-500 text-white rounded-lg px-4 py-2 cursor-pointer transition duration-500 ease-in-out hover:bg-blue-700 focus:outline-none shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        variants={itemVariants}
      >
        Apply
      </motion.button>

      <h2 className="text-3xl font-bold my-4 text-gray-700">All Leaves</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div variants={variants}>
          {leaves.map((leave) => (
            <motion.div 
              key={leave.id} 
              className="border-2 rounded-lg p-4 shadow-md bg-white transition duration-500 ease-in-out hover:shadow-lg" 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-medium text-sm text-blue-600">{format(parseISO(leave.startDate), 'MM/dd/yyyy')} - {format(parseISO(leave.endDate), 'MM/dd/yyyy')}</h3>
              <p className="text-gray-700">{leave.reason}</p>
              <p className={`font-bold text-lg ${leave.status === 'Approved' ? 'text-green-500' : 'text-red-500'}`}>Status: {leave.status}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}