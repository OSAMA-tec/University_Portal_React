import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';

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
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Apply for leave</h2>
      <div className="mb-4">
        <label className="block">Start Date</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded p-2 w-full"/>
      </div>
      <div className="mb-4">
        <label className="block">End Date</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded p-2 w-full"/>
      </div>
      <div className="mb-4">
        <label className="block">Reason</label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="border rounded p-2 w-full"/>
      </div>
      <button onClick={handleLeaveApplication} className="bg-blue-500 text-white rounded px-4 py-2">Apply</button>

      <h2 className="text-lg font-bold my-4">All Leaves</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {leaves.map((leave) => (
          <div key={leave.id} className="border rounded p-4 shadow bg-white">
            <h3 className="font-bold text-sm">{format(parseISO(leave.startDate), 'MM/dd/yyyy')} - {format(parseISO(leave.endDate), 'MM/dd/yyyy')}</h3>
            <p>{leave.reason}</p>
            <p className={`font-bold ${leave.status === 'Approved' ? 'text-green-500' : 'text-red-500'}`}>Status: {leave.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}