import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Product from './components/Product';
import Cashier from './components/Cashier';
import Reports from './components/Reports';
import DashboardHome from './components/DashboardHome';
import ResetPassword from './components/ResetPassword';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    
      const accessToken = Cookies.get('access');
      const refreshToken = Cookies.get('refresh');
      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);
      const authHeader = `Bearer ${accessToken}`;
      console.log('Authorization Header:', authHeader);
      if (!accessToken) {
        console.error('No access token found');
        return;
      }
      try {
      const response = await axios.post('https://test.klveen.com/merchant/logout', 
        {},
        {
          headers: {
            'Authorization': authHeader
          }
        }
      );
      console.log(response);
      if (response.status === 200) {
        Cookies.remove('access');
        Cookies.remove('refresh');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          !isAuthenticated ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Navigate to="/dashboard" />
          )
        } />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={
          isAuthenticated ? (
            <Dashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/" />
          )
        }>
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<Product />} />
          <Route path="cashier" element={<Cashier />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
