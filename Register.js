import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', bloodType: '', age: '', dob: ''
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!form.name || !form.email || !form.password || !form.bloodType || !form.age || !form.dob) {
      setMessage("Please fill in all required fields");
      return;
    }
    
    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setMessage("Please enter a valid email address");
      return;
    }
    
    // Create a payload without confirmPassword
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      bloodType: form.bloodType,
      age: parseInt(form.age, 10),
      dob: form.dob
    };
    
    console.log('Submitting registration with payload:', payload);
    setMessage("Processing registration...");
    
    try {
      const res = await fetch('http://localhost:5000/api/donors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      console.log('Registration response:', data);
      
      if (res.ok) {
        setMessage(data.message || 'Registration successful!');
        setIsSuccess(true);
        
        // Save the donor data to localStorage for the donor list to use
        const donorData = {
          name: form.name,
          email: form.email,
          bloodType: form.bloodType,
          age: parseInt(form.age, 10)
        };
        localStorage.setItem('newDonorData', JSON.stringify(donorData));
        
        // Clear form on success
        setForm({
          name: '', email: '', password: '', confirmPassword: '', bloodType: '', age: '', dob: ''
        });
        
        // Redirect to donor list after successful registration
        setTimeout(() => {
          navigate('/donor-list');
        }, 1500);
      } else {
        setMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error('Registration error:', err);
      setMessage("Network error. Please check your connection and try again.");
    }
  };

  // Define the background style with the correct path to the image
  const backgroundStyle = {
    backgroundImage: `url(${window.location.origin}/images/donation.jpg)`
  };

  return (
    <div className="register-page" style={backgroundStyle}>
      <div className="register-overlay"></div>
      <div className="register-card-container">
        <div className="register-card">
          <h2 className="register-card-header">Become a Donor</h2>
          
          {message && (
            <div className={`register-message ${message.includes('failed') ? 'register-error-message' : isSuccess ? 'register-success-message' : ''}`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="register-form-group">
              <input 
                name="name" 
                onChange={handleChange} 
                placeholder="Full Name" 
                className="register-form-control" 
                required 
              />
            </div>
            
            <div className="register-form-group">
              <input 
                name="email" 
                type="email" 
                onChange={handleChange} 
                placeholder="Email Address" 
                className="register-form-control" 
                required 
              />
            </div>
            
            <div className="register-form-group">
              <input 
                name="password" 
                type="password" 
                onChange={handleChange} 
                placeholder="Password" 
                className="register-form-control" 
                required 
              />
            </div>
            
            <div className="register-form-group">
              <input 
                name="confirmPassword" 
                type="password" 
                onChange={handleChange} 
                placeholder="Confirm Password" 
                className="register-form-control" 
                required 
              />
            </div>
            
            <div className="register-form-group">
              <select 
                name="bloodType" 
                onChange={handleChange} 
                className="register-form-control" 
                required
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A−</option>
                <option value="B+">B+</option>
                <option value="B-">B−</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB−</option>
                <option value="O+">O+</option>
                <option value="O-">O−</option>
              </select>
            </div>
            
            <div className="register-form-group">
              <input 
                name="age" 
                type="number" 
                onChange={handleChange} 
                placeholder="Age" 
                className="register-form-control" 
                required 
              />
            </div>
            
            <div className="register-form-group">
              <label className="register-label">Date of Birth</label>
              <input 
                name="dob" 
                type="date" 
                onChange={handleChange} 
                className="register-form-control" 
                required 
              />
            </div>
            
            <button 
              type="submit" 
              className="register-submit-button"
            >
              Register as Donor
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
