import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

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
            setError(null);
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
            setError(null);
        }).catch(error => {
            console.error(error);
            setError('Failed to submit attendance');
        });
    };

    const pageVariants = {
        initial: {
            opacity: 0,
            x: "-100vw",
            scale: 0.8
        },
        in: {
            opacity: 1,
            x: 0,
            scale: 1
        },
        out: {
            opacity: 0,
            x: "100vw",
            scale: 1.2
        }
    };

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.5
    };

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="p-10 bg-gray-100"
        >
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Mark Attendance</h2>
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                <select value={attendanceStatus} onChange={(e) => setAttendanceStatus(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option value="">Select status...</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                </select>
            </motion.div>
            <motion.button whileHover={{ scale: 1.1 }} onClick={handleAttendanceSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</motion.button>
            {error && <motion.p initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }} className="mt-4 text-red-500">{error}</motion.p>}

            <h2 className="text-2xl font-bold my-6 text-blue-700">Attendance Records</h2>
            <motion.div className="grid md:grid-cols-2 gap-4">
                {attendanceRecords.map((record) => (
                    <motion.div key={record.id} whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="border rounded p-4 shadow bg-white">
                        <h3 className="font-bold text-sm">{new Date(record.date).toLocaleDateString()}</h3>
                        <p className={`font-bold ${record.status === 'Present' ? 'text-green-500' : 'text-red-500'}`}>{record.status}</p>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}