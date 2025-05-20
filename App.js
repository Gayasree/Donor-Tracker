import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import DonorList from './components/DonorList';
import Profile from './components/Profile';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Admin from './components/Admin';
import Footer from './components/Footer';

// Custom login route component that handles authentication
const LoginRoute = () => {
  const navigate = useNavigate();
  
  const handleLoginSuccess = () => {
    // Navigate to profile page after successful login
    navigate('/profile');
  };
  
  return <Login onLoginSuccess={handleLoginSuccess} />;
};

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/donor-list" element={<DonorList />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
