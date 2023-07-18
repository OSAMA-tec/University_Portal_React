import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

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
    <motion.div className="p-4" variants={variants} initial="hidden" animate="visible">
      <h2 className="text-lg font-bold mb-4">Apply for leave</h2>
      <div className="mb-4">
        <label className="block">Start Date</label>
        <motion.input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          className="border rounded p-2 w-full transition duration-500 ease-in-out focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label className="block">End Date</label>
        <motion.input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          className="border rounded p-2 w-full transition duration-500 ease-in-out focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label className="block">Reason</label>
        <motion.textarea 
          value={reason} 
          onChange={(e) => setReason(e.target.value)} 
          className="border rounded p-2 w-full transition duration-500 ease-in-out focus:border-blue-500 focus:outline-none"
        />
      </div>
      <motion.button 
        onClick={handleLeaveApplication} 
        className="bg-blue-500 text-white rounded px-4 py-2 cursor-pointer transition duration-500 ease-in-out hover:bg-blue-700"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Apply
      </motion.button>

      <h2 className="text-lg font-bold my-4">All Leaves</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div variants={variants}>
          {leaves.map((leave) => (
            <motion.div 
              key={leave.id} 
              className="border rounded p-4 shadow bg-white transition duration-500 ease-in-out hover:shadow-lg" 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-bold text-sm">{format(parseISO(leave.startDate), 'MM/dd/yyyy')} - {format(parseISO(leave.endDate), 'MM/dd/yyyy')}</h3>
              <p>{leave.reason}</p>
              <p className={`font-bold ${leave.status === 'Approved' ? 'text-green-500' : 'text-red-500'}`}>Status: {leave.status}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}