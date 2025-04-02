import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const ResetPassword = () => {
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const token = Cookies.get('resetToken');

  if (!token) {
    navigate('/');
    return null;
  }
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validatePasswords = () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$&?!]).{8,}$/;
    
    if (!passwordRegex.test(passwords.password)) {
      setError('Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character (@$&?!)');
      return false;
    }
    if (passwords.password !== passwords.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    try {
      const response = await axios.post('https://test.klveen.com/merchant/resetpassword', 
        passwords,  // Request body
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }  // Request config
      );
      console.log('Response:', response);

      if (response.status !== 200) {
        setError('Failed to reset password. Please try again.');
        setSuccess('');
        return;
      }
      
      setSuccess('Password has been successfully reset');
      setError('');
      setTimeout(() => navigate('/'), 3000);
      Cookies.remove('resetToken');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-[1.02]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">BAYARCEPAT</h1>
          <p className="text-gray-600">Reset your password</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-100 rounded-lg">
              {success}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={passwords.password}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              required
              placeholder="Enter your new password"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              required
              placeholder="Confirm your new password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform transition-all duration-200 hover:scale-[1.02]"
          >
            Reset Password
          </button>
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;