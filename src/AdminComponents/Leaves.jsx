import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('https://universityportal-9c90610042e0.herokuapp.com/admin/leaves/users', {
      headers: {
        'x-auth-token': token
      }
    }).then(response => {
      setLeaves(response.data.leaveRecord);
    }).catch(error => {
      console.error(error);
    });
  }, [token]);

  const handleLeaveUpdate = (leaveId) => {
    axios.put(`https://universityportal-9c90610042e0.herokuapp.com/admin/leaves/users/${leaveId}`, {
      status: selectedStatus
    }, {
      headers: {
        'x-auth-token': token
      }
    }).then(response => {
      const updatedLeaves = leaves.map(leave => 
        leave._id === leaveId ? {...leave, status: selectedStatus} : leave
      );
      setLeaves(updatedLeaves);
      setSelectedLeave(null);
      setSelectedStatus('');
      setSuccessMessage(response.data.msg);
      setErrorMessage('');
    }).catch(error => {
      console.error(error);
      setErrorMessage(error.response.data.msg);
      setSuccessMessage('');
    });
  };

  return (
    <div className="p-4">
    <h2 className="text-2xl font-bold mb-4">Leave Requests</h2>
    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    {successMessage && <p className="text-green-500">{successMessage}</p>}
    <div className="grid md:grid-cols-2 gap-4">
      {leaves.map((leave) => (
        <div key={leave._id} className="border rounded p-4 shadow bg-white cursor-pointer" onClick={() => setSelectedLeave(leave._id)}>
          <h3 className="font-bold text-lg">{leave.user}</h3>
          <p>Start Date: {new Date(leave.startDate).toLocaleDateString()}</p>
          <p>End Date: {new Date(leave.endDate).toLocaleDateString()}</p>
          <p>Reason: {leave.reason}</p>
          <p>Status: <span className={`font-bold ${leave.status === 'Rejected' ? 'text-red-500' : leave.status === 'Approved' ? 'text-green-500' : 'text-blue-500'}`}>{leave.status}</span></p>
        </div>
      ))}
    </div>
    {selectedLeave && (
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded shadow">
          <button onClick={() => setSelectedLeave(null)} className="float-right">X</button>
          <h2 className="text-2xl font-bold mb-4">Update Leave Status</h2>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="border rounded p-2 w-full">
            <option value="">Select status...</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button onClick={() => handleLeaveUpdate(selectedLeave)} className="bg-blue-500 text-white rounded px-4 py-2 mt-4">Update</button>
        </div>
      </div>
    )}
  </div>
  );
}