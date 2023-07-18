import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

function UserRegistration() {
  const [message, setMessage] = useState("");
  const history = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('https://universityportal-9c90610042e0.herokuapp.com/user/register', data);
      setMessage("Registration successful!");
      localStorage.setItem('token', response.data.token);
      history("/login");
    } catch (error) {
      setMessage("Registration failed!");
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="p-8 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">User Registration</h2>
        </div>
        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6">
            <motion.label
              className="text-sm font-medium text-gray-700 tracking-wide"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Registration Number
            </motion.label>
            <motion.input
              className="py-2 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              type="text"
              {...register('regNo', { required: true })}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            />
            {errors.regNo && <span className="text-red-500">This field is required</span>}
            <motion.label
              className="text-sm font-medium text-gray-700 tracking-wide"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Email
            </motion.label>
            <motion.input
              className="py-2 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              type="email"
              {...register('email', { required: true })}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            />
            {errors.email && <span className="text-red-500">This field is required</span>}

            <motion.label
              className="text-sm font-medium text-gray-700 tracking-wide"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Name
            </motion.label>
            <motion.input
              className="py-2 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              type="text"
              {...register('name', { required: true })}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            />
            {errors.name && <span className="text-red-500">This field is required</span>}

            <motion.label
              className="text-sm font-medium text-gray-700 tracking-wide"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Password
            </motion.label>
            <motion.input
              className="py-2 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              type="password"
              {...register('password', { required: true })}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            />
            {errors.password && <span className="text-red-500">This field is required</span>}

            <motion.button
              type="submit"
              className="mt-3 py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-indigo-500 hover:bg-indigo-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Register
            </motion.button>
            {message && <p className="text-red-500">{message}</p>}
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default UserRegistration;