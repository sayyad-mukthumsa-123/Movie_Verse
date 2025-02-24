import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axios/axios';
import bgImage from "../assets/home.jpg";
import { toast, ToastContainer } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const ResetPassword = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchUserEmail = async () => {
      try {
        const response = await axios.get(`/profile/${id}`);
        console.log('API Response:', response.data);

        if (response.data?.email) {
          setEmail(response.data.email);
        } else {
          toast.error('Email not found', { position: 'top-right', autoClose: 3000 });
        }
      } catch (error) {
        toast.error('Failed to fetch user email', { position: 'top-right', autoClose: 3000 });
        console.error('Error fetching email:', error.response?.data || error.message);
      }
    };

    fetchUserEmail();
  }, [id]);

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email || !newPassword) {
      toast.error('Please fill all fields', { position: 'top-right', autoClose: 3000 });
      return;
    }

    if (!validatePassword(newPassword)) {
      toast.error(
        'Password must contain at least one capital letter, one small letter, one number, and one special symbol',
        { position: 'top-right', autoClose: 3000 }
      );
      return;
    }

    try {
      const response = await axios.put('/reset-password', { email, newPassword });
      toast.success(response.data.message, { position: 'top-right', autoClose: 3000 });

      setTimeout(() => {
        localStorage.removeItem('token');
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error resetting password', { position: 'top-right', autoClose: 3000 });
      console.error('Error resetting password:', error);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center px-4 sm:px-6 md:px-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-slate-900 bg-opacity-70"></div>
      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-90 rounded-lg shadow-md p-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-700 text-center mb-3">Reset Password</h1>
        <form onSubmit={handleResetPassword}>
          <div className="mb-2 relative">
            <label className="block text-lg sm:text-2xl font-medium text-cyan-700">Email</label>
            <Tippy content={<span className="text-red-600 text-lg sm:text-2xl p-2 font-semibold">!!! Email is read-only</span>} theme="light" placement="bottom">
              <input
                type="email"
                value={email}
                readOnly
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline text-lg sm:text-2xl cursor-not-allowed"
              />
            </Tippy>
          </div>
          <div className="mb-4 relative">
            <label className="block text-lg sm:text-2xl font-medium text-cyan-700">New Password</label>
            <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline text-lg sm:text-2xl"
                />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg sm:text-2xl text-cyan-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate(`../profile/${id}`)}
              className="w-full sm:w-5/12 text-red-700 text-lg sm:text-2xl outline hover:bg-red-700 hover:text-white transition-all font-medium py-2 px-4 rounded-md focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-5/12 text-green-700 text-lg sm:text-2xl outline hover:bg-green-700 hover:text-white transition-all font-medium py-2 px-4 rounded-md focus:outline-none"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default ResetPassword;

