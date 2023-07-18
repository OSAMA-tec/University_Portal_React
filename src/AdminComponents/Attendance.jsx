import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Attendance() {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
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
                record._id === userId ? { ...record, status: selectedStatus } : record
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

    return (
        <motion.div className="p-6 bg-gray-100 min-h-screen" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }}>
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Attendance Records</h2>
            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attendanceRecords.map((record, index) => (
                    <motion.div 
                        key={record._id} 
                        className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white cursor-pointer hover:shadow-lg transition duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}>
                        <h3 className="font-bold text-sm mb-2 text-blue-600" onClick={() => setSelectedUser(record._id)}>{record.user}</h3>
                        <p className={`font-bold ${record.status === 'Present' ? 'text-green-500' : 'text-red-500'}`}>{record.status}</p>
                        <p>{new Date(record.date).toLocaleDateString()}</p>
                        <button 
                            onClick={() => handleAttendanceUpdate(record._id)} 
                            className="bg-blue-500 text-white rounded px-2 py-1 mt-2 shadow hover:bg-blue-600 transition duration-200">{selectedUser === record._id ? 'Update' : 'Edit'}</button>
                    </motion.div>
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
        </motion.div>
    );
}