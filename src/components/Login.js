import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://test.klveen.com/merchant/forgotpassword', { email: forgotEmail });
      setSuccess('Password reset instructions have been sent to your email.');
      setError('');
      setTimeout(() => {
        setShowForgotPassword(false);
        setSuccess('');
      }, 3000);
      const status = response.status;
      console.log(response);
      console.log(status);
      if (status === 200) {
        const resetToken = response.data.resetToken;
        Cookies.set('resetToken', resetToken, {
          expires: 15/24/60,
          secure: true,
          sameSite: 'strict',
          path:'/'
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process request. Please try again.');
      setSuccess('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://test.klveen.com/merchant/login', credentials, {
        withCredentials: true
      });
      console.log(response);
      if (response.status === 200) {
        const accessToken = response.data.data.accessToken;
        const refreshToken = response.data.data.refreshToken;
        
        Cookies.set('access', accessToken, {
          expires: 15/24/60,
          secure: true,
          sameSite:'strict',
          path:'/'
        });

        Cookies.set('refresh', refreshToken, {
          expires: 7,
          secure: true,
          sameSite:'strict',
          path:'/'
        });

        onLogin();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 ease-out hover:scale-[1.02] overflow-hidden">
        <div className="text-center mb-8 transition-opacity duration-300">
          <h1 className="text-4xl font-bold text-orange-600 mb-2 transition-transform duration-300 ease-out">{showForgotPassword ? 'BAYARCEPAT' : 'BAYARCEPAT'}</h1>
          <p className="text-gray-600 transition-all duration-300 ease-out">{showForgotPassword ? 'Reset your password' : 'Welcome back! Please login to continue'}</p>
        </div>
        <div className="relative">
          <div className={`transform transition-all duration-700 ease-out ${showForgotPassword ? 'translate-x-[-130%] scale-95 opacity-0 absolute inset-0' : 'translate-x-0 scale-100 opacity-100'}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-100 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  required
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform transition-all duration-200 hover:scale-[1.02]"
              >
                Sign in
              </button>
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors duration-200"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          </div>
          <div className={`transform transition-all duration-700 ease-out ${!showForgotPassword ? 'translate-x-[130%] scale-95 opacity-0 absolute inset-0' : 'translate-x-0 scale-100 opacity-100'}`}>
            <form onSubmit={handleForgotPassword} className="space-y-6">
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
                <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="forgotEmail"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  required
                  placeholder="Enter your email"
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
                  onClick={() => setShowForgotPassword(false)}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors duration-200"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;