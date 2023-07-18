import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedFullReport, setSelectedFullReport] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('https://universityportal-9c90610042e0.herokuapp.com/admin/record/allusers', {
      headers: {
        'x-auth-token': token
      }
    }).then(response => {
      setAttendanceRecords(response.data.records);
    }).catch(error => {
      console.error(error);
    });
  }, [token]);

  const handleAttendanceUpdate = (userId) => {
    axios.put(`https://universityportal-9c90610042e0.herokuapp.com/admin/updateAttendance/${userId}`, {
      status: selectedStatus
    }, {
      headers: {
        'x-auth-token': token
      }
    }).then(response => {
      const updatedRecords = attendanceRecords.map(record => 
        record._id === userId ? {...record, status: selectedStatus} : record
      );
      setAttendanceRecords(updatedRecords);
      setSelectedUser(null);
      setSelectedStatus('');
      setSuccessMessage(response.data.msg);
      setErrorMessage('');
    }).catch(error => {
      console.error(error);
      setErrorMessage(error.response.data.msg);
      setSuccessMessage('');
    });
  };

  const handleAttendanceDelete = (userId, attendanceId) => {
    axios.delete(`https://universityportal-9c90610042e0.herokuapp.com/admin/deleteAttendance/${userId}/${attendanceId}`, {
      headers: {
        'x-auth-token': token
      }
    }).then(response => {
      const updatedRecords = attendanceRecords.filter(record => 
        record._id !== userId
      );
      setAttendanceRecords(updatedRecords);
      setSuccessMessage(response.data.msg);
      setErrorMessage('');
    }).catch(error => {
      console.error(error);
      setErrorMessage(error.response.data.msg);
      setSuccessMessage('');
    });
  };

  const handleGenerateReport = (userId) => {
    axios.get(`https://universityportal-9c90610042e0.herokuapp.com/admin/record/report/users/${userId}`, {
      headers: {
        'x-auth-token': token
      }
    }).then(response => {
      setSelectedReport(response.data.report);
    }).catch(error => {
      console.error(error);
    });
  };

  const handleFullReport = () => {
    axios.get(`https://universityportal-9c90610042e0.herokuapp.com/admin/record/report/allusers`, {
      headers: {
        'x-auth-token': token
      }
    }).then(response => {
        setSelectedFullReport(response.data.report);
    }).catch(error => {
      console.error(error);
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Attendance Records</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <button onClick={() => handleFullReport()} className="bg-blue-400 text-white rounded px-2 py-1 mb-5 ml-2">Full Report</button>
      <div className="grid md:grid-cols-2 gap-4">
        {attendanceRecords.map((record) => (
          <div key={record._id} className="border rounded p-4 shadow bg-white cursor-pointer">
            <h3 className="font-bold text-sm" onClick={() => setSelectedUser(record._id)}>{record.user}</h3>
            <p className={`font-bold ${record.status === 'Present' ? 'text-green-500' : 'text-red-500'}`}>{record.status}</p>
            <p>{new Date(record.date).toLocaleDateString()}</p>
            <button onClick={() => handleAttendanceDelete(record._id, record.user)} className="bg-red-500 text-white rounded px-2 py-1">Delete</button>
            <button onClick={() => handleGenerateReport(record.user)} className="bg-green-500 text-white rounded px-2 py-1 ml-2">Generate Report</button>
          </div>
        ))}
      </div>
      {selectedUser && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow">
            <button onClick={() => setSelectedUser(null)} className="float-right">X</button>
            <h2 className="text-lg font-bold mb-4">Update Attendance</h2>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="border rounded p-2 w-full">
              <option value="">Select status...</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
            <button onClick={() => handleAttendanceUpdate(selectedUser)} className="bg-blue-500 text-white rounded px-4 py-2 mt-4">Update</button>
          </div>
        </div>
      )}
  
      {selectedReport && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow">
            <button onClick={() => setSelectedReport(null)} className="float-right">X</button>
            <h2 className="text-lg font-bold mb-4">Attendance Report</h2>
            <p>Present Count: {selectedReport.presentCount}</p>
            <p>Absent Count: {selectedReport.absentCount}</p>
            <p>Present Dates: {selectedReport.presentDates.join(', ')}</p>
            <p>Absent Dates: {selectedReport.absentDates.join(', ')}</p>
            <h3 className="text-lg font-bold mt-4 mb-2">All Records:</h3>
            {selectedReport.allrecords.map((record, index) => (
              <div key={index} className="border rounded p-4 shadow bg-white mt-2">
                <p>Attendance ID: {record._id}</p>
                <p>User ID: {record.user}</p>
                <p>Status: {record.status}</p>
                <p>Date: {new Date(record.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedFullReport && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow">
            <button onClick={() => setSelectedFullReport(null)} className="float-right">X</button>
            <h2 className="text-lg font-bold mb-4">Attendance Report</h2>
            <p>Present Count: {selectedFullReport.presentCount}</p>
            <p>Absent Count: {selectedFullReport.absentCount}</p>
            <p>Present Dates: {selectedFullReport.presentDates.join(', ')}</p>
            <p>Absent Dates: {selectedFullReport.absentDates.join(', ')}</p>
          </div>
        </div>
      )}
    </div>
  );
}