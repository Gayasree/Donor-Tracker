import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      console.log('Attempting login with:', { email });
      
      const response = await fetch('http://localhost:5000/api/donors/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      console.log('Login response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      const { token } = data;
      
      // Save token in localStorage
      localStorage.setItem('token', token);
      
      // Show success message
      setError('Login Successful!');
      
      // Callback to parent after login or navigate to profile
      setTimeout(() => {
        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess();
        } else {
          // If no callback provided, navigate to profile page
          navigate('/profile');
        }
      }, 1000);
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    }
  };

  // Define the background style with the correct path to the image
  const backgroundStyle = {
    backgroundImage: `url(${window.location.origin}/images/donation.jpg)`
  };

  return (
    <div className="login-page" style={backgroundStyle}>
      <div className="login-overlay"></div>
      <div className="login-card-container">
        <div className="login-card">
          <h2 className="login-card-header">Donor Login</h2>
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="login-form-group">
              <input
                type="email"
                className="login-form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
              />
            </div>

            <div className="login-form-group">
              <input
                type="password"
                className="login-form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>

            <button type="submit" className="login-submit-button">
              Login
            </button>

            {error && <div className="login-error-message">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
