import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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

  const handleLogout = () => {
    setIsAuthenticated(false);
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
