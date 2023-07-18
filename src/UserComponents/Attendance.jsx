import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('https://universityportal-9c90610042e0.herokuapp.com/user/attendance', {
      headers: {
        'x-auth-token': token
      }
    }).then(response => {
      setAttendanceRecords(response.data);
      setError(null); // Clear any previous error
    }).catch(error => {
      console.error(error);
      setError('Failed to fetch attendance records');
    });
  }, [token]);

  const handleAttendanceSubmit = () => {
    axios.post('https://universityportal-9c90610042e0.herokuapp.com/user/attendance', {
      status: attendanceStatus
    }, {
      headers: {
        'x-auth-token': token
      }
    }).then(response => {
      setAttendanceRecords(prevRecords => [response.data, ...prevRecords]);
      setAttendanceStatus('');
      setError(null); // Clear any previous error
    }).catch(error => {
      console.error(error);
      setError('Failed to submit attendance');
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Mark Attendance</h2>
      <div className="mb-4">
        <label className="block">Status</label>
        <select value={attendanceStatus} onChange={(e) => setAttendanceStatus(e.target.value)} className="border rounded p-2 w-full">
          <option value="">Select status...</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
      </div>
      <button onClick={handleAttendanceSubmit} className="bg-blue-500 text-white rounded px-4 py-2">Submit</button>
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <h2 className="text-lg font-bold my-4">Attendance Records</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {attendanceRecords.map((record) => (
          <div key={record.id} className="border rounded p-4 shadow bg-white">
            <h3 className="font-bold text-sm">{new Date(record.date).toLocaleDateString()}</h3>
            <p className={`font-bold ${record.status === 'Present' ? 'text-green-500' : 'text-red-500'}`}>{record.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}