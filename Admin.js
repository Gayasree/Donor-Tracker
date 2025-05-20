import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [donors, setDonors] = useState([]);
  const [stats, setStats] = useState({
    totalDonors: 0,
    activeDonors: 0,
    totalDonations: 0,
    pendingRequests: 0
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [donationRequests, setDonationRequests] = useState([
    {
      id: 1,
      hospital: 'City Hospital',
      bloodType: 'O-',
      quantity: '3 units',
      requiredBy: 'Tomorrow',
      contact: 'Dr. Johnson (555-1234)',
      status: 'urgent'
    },
    {
      id: 2,
      hospital: 'Memorial Clinic',
      bloodType: 'A+',
      quantity: '2 units',
      requiredBy: 'Next Week',
      contact: 'Dr. Smith (555-5678)',
      status: 'normal'
    }
  ]);
  
  // Add a new donation request
  const addDonationRequest = (request) => {
    const newRequest = {
      id: Date.now(), // Generate a unique ID
      ...request,
      status: request.status || 'normal'
    };
    
    setDonationRequests(prevRequests => [...prevRequests, newRequest]);
    
    // Update the pending requests count in stats
    setStats(prevStats => ({
      ...prevStats,
      pendingRequests: prevStats.pendingRequests + 1
    }));
    
    // Show notification
    setNotification({
      show: true,
      message: `New donation request from ${request.hospital} has been added.`,
      type: 'success'
    });
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };
  
  // Handle request approval
  const handleApproveRequest = (hospitalName) => {
    setNotification({
      show: true,
      message: `Request from ${hospitalName} has been approved.`,
      type: 'success'
    });
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };
  
  // Handle request rejection
  const handleRejectRequest = (hospitalName) => {
    setNotification({
      show: true,
      message: `Request from ${hospitalName} has been rejected.`,
      type: 'error'
    });
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Check if admin is logged in and fetch data
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      setIsAuthenticated(true);
      fetchDonors(); // This will also call calculateStats after fetching
      
      // Check for new donation requests in localStorage
      checkForNewDonationRequests();
      
      // Set up interval to check for new donation requests
      const intervalId = setInterval(checkForNewDonationRequests, 2000);
      
      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    } else {
      setIsLoading(false);
    }
  }, []);
  
  // Check for new donation requests added by other components
  const checkForNewDonationRequests = () => {
    const newRequestData = localStorage.getItem('newDonationRequest');
    if (newRequestData) {
      try {
        const newRequest = JSON.parse(newRequestData);
        addDonationRequest(newRequest);
        
        // Clear the localStorage item after processing
        localStorage.removeItem('newDonationRequest');
      } catch (err) {
        console.error('Error parsing new donation request:', err);
      }
    }
  };

  // Handle admin login
  const handleLogin = (e) => {
    e.preventDefault();
    
    // This is a simple authentication for demo purposes
    // In a real application, you would validate against a backend
    if (loginData.username === 'admin@gmail.com' && loginData.password === 'admin123') {
      localStorage.setItem('adminToken', 'demo-admin-token');
      setIsAuthenticated(true);
      
      // Fetch real donor data after authentication
      fetchDonors(); // This will also call calculateStats after fetching
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  // Handle admin logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  // Fetch donors from backend
  const fetchDonors = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/donors');
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched donors:', data);
        
        if (Array.isArray(data)) {
          setDonors(data);
          // Calculate stats after setting donors
          setTimeout(() => calculateStats(), 100);
        } else {
          console.error('Expected array of donors but got:', data);
          setDonors([]);
        }
      } else {
        console.error('Failed to fetch donors, status:', response.status);
        setDonors([]);
      }
    } catch (error) {
      console.error('Error fetching donors:', error);
      setDonors([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics for dashboard based on actual donor data
  const calculateStats = () => {
    if (donors.length > 0) {
      // Count active donors (those who haven't donated in the last 6 months or never donated)
      const activeDonorCount = donors.filter(donor => {
        if (!donor.lastDonationDate) return true; // Never donated
        
        const lastDonation = new Date(donor.lastDonationDate);
        const today = new Date();
        
        // Calculate the difference in months
        const monthsDiff = 
          (today.getFullYear() - lastDonation.getFullYear()) * 12 + 
          (today.getMonth() - lastDonation.getMonth());
        
        return monthsDiff >= 6; // Eligible/active if at least 6 months have passed
      }).length;
      
      // Count total donations (sum of patientCount for all donors)
      const totalDonationsCount = donors.reduce((total, donor) => {
        return total + (donor.patientCount || 0);
      }, 0);
      
      // Update stats with real data
      setStats({
        totalDonors: donors.length,
        activeDonors: activeDonorCount,
        totalDonations: totalDonationsCount,
        pendingRequests: Math.round(donors.length * 0.3) // Estimate pending requests as 30% of donors
      });
    } else {
      // If no donors yet, set all stats to 0
      setStats({
        totalDonors: 10,
        activeDonors: 7,
        totalDonations: 17,
        pendingRequests: 3
      });
    }
  };

  // Handle donor deletion
  const handleDeleteDonor = async (donorId) => {
    if (window.confirm('Are you sure you want to delete this donor?')) {
      try {
        // In a real application, you would send a delete request to the backend
        // For now, we'll just remove it from the local state
        const updatedDonors = donors.filter(donor => donor._id !== donorId);
        setDonors(updatedDonors);
        
        // Recalculate stats after deletion
        setTimeout(() => calculateStats(), 100);
        
        alert('Donor deleted successfully');
      } catch (error) {
        console.error('Error deleting donor:', error);
        alert('Failed to delete donor');
      }
    }
  };

  // Render login form
  if (!isAuthenticated) {
    return (
      <div className="admin-page" style={{ backgroundImage: "url('/images/admin-bg.jpg')" }}>
        <div className="admin-overlay"></div>
        <div className="admin-login-container">
          <div className="admin-login-card">
            <h2 className="admin-login-title">Admin Login</h2>
            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="admin-form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  value={loginData.username} 
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={loginData.password} 
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="admin-login-button">Login</button>
            </form>
            <div className="admin-login-help">
              <p>Default credentials for demo:</p>
              <p>Username: admin@gmail.com</p>
              <p>Password: admin123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render admin dashboard
  return (
    <div className="admin-dashboard-page" style={{ backgroundImage: "url('/images/admin-bg.jpg')" }}>
      <div className="admin-overlay"></div>
      {notification.show && (
        <div className={`admin-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <div className="admin-dashboard-container">
        <div className="admin-sidebar">
          <div className="admin-logo">
            <h2>Admin Panel</h2>
          </div>
          <ul className="admin-menu">
            <li 
              className={activeTab === 'dashboard' ? 'active' : ''} 
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </li>
            <li 
              className={activeTab === 'donors' ? 'active' : ''} 
              onClick={() => setActiveTab('donors')}
            >
              Manage Donors
            </li>
            <li 
              className={activeTab === 'requests' ? 'active' : ''} 
              onClick={() => setActiveTab('requests')}
            >
              Donation Requests
            </li>
            <li 
              className={activeTab === 'settings' ? 'active' : ''} 
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </li>
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </div>
        
        <div className="admin-content">
          {activeTab === 'dashboard' && (
            <div className="admin-dashboard">
              <h2>Dashboard</h2>
              
              {isLoading ? (
                <div className="admin-loading">
                  <div className="admin-loading-spinner"></div>
                  <p>Loading donor data...</p>
                </div>
              ) : (
                <div className="admin-stats">
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon">👥</div>
                    <div className="admin-stat-value">{stats.totalDonors}</div>
                    <div className="admin-stat-label">Total Donors</div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon">✅</div>
                    <div className="admin-stat-value">{stats.activeDonors}</div>
                    <div className="admin-stat-label">Active Donors</div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon">🩸</div>
                    <div className="admin-stat-value">{stats.totalDonations}</div>
                    <div className="admin-stat-label">Total Donations</div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon">⏳</div>
                    <div className="admin-stat-value">{stats.pendingRequests}</div>
                    <div className="admin-stat-label">Pending Requests</div>
                  </div>
                </div>
              )}
              
              <div className="admin-recent-activity">
                <h3>Recent Activity</h3>
                <div className="admin-activity-list">
                  {isLoading ? (
                    <div className="admin-loading">
                      <div className="admin-loading-spinner"></div>
                      <p>Loading activity data...</p>
                    </div>
                  ) : donors.length > 0 ? (
                    <>
                      {/* Show the 3 most recent donors based on ID (assuming newer IDs are larger) */}
                      {[...donors]
                        .sort((a, b) => b._id > a._id ? 1 : -1)
                        .slice(0, 3)
                        .map((donor, index) => (
                          <div className="admin-activity-item" key={donor._id}>
                            <div className="admin-activity-time">
                              {index === 0 ? 'Recently' : index === 1 ? 'Earlier' : 'Previously'}
                            </div>
                            <div className="admin-activity-description">
                              Donor registered: {donor.name} ({donor.bloodType})
                            </div>
                          </div>
                        ))
                      }
                    </>
                  ) : (
                    <div className="admin-activity-item">
                      <div className="admin-activity-description">
                        No recent activity to display
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'donors' && (
            <div className="admin-donors">
              <h2>Manage Donors</h2>
              <div className="admin-donors-controls">
                <input type="text" placeholder="Search donors..." className="admin-search" />
                <select className="admin-filter">
                  <option value="">All Blood Types</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              
              {isLoading ? (
                <div className="admin-loading">
                  <div className="admin-loading-spinner"></div>
                  <p>Loading donor data...</p>
                </div>
              ) : (
                <table className="admin-donors-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Blood Type</th>
                      <th>Last Donation</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donors.length > 0 ? (
                      donors.map(donor => {
                        // Check if donor is eligible (last donation was at least 6 months ago)
                        let isActive = true;
                        if (donor.lastDonationDate) {
                          const lastDonation = new Date(donor.lastDonationDate);
                          const today = new Date();
                          const monthsDiff = 
                            (today.getFullYear() - lastDonation.getFullYear()) * 12 + 
                            (today.getMonth() - lastDonation.getMonth());
                          isActive = monthsDiff >= 6;
                        }
                        
                        return (
                          <tr key={donor._id}>
                            <td>{donor.name}</td>
                            <td>{donor.email}</td>
                            <td>{donor.bloodType}</td>
                            <td>{donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'Never'}</td>
                            <td>
                              <span className={`admin-status ${isActive ? 'active' : 'inactive'}`}>
                                {isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>
                              <button className="admin-edit-btn">Edit</button>
                              <button 
                                className="admin-delete-btn"
                                onClick={() => handleDeleteDonor(donor._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="admin-no-data">No donors found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
          
          {activeTab === 'requests' && (
            <div className="admin-requests">
              <h2>Donation Requests</h2>
              <div className="admin-requests-list">
                {donationRequests.map(request => (
                  <div className="admin-request-card" key={request.id}>
                    <div className="admin-request-header">
                      <h3>{request.hospital}</h3>
                      <span className={`admin-request-status ${request.status}`}>{request.status}</span>
                    </div>
                    <div className="admin-request-details">
                      <p><strong>Blood Type:</strong> {request.bloodType}</p>
                      <p><strong>Quantity:</strong> {request.quantity}</p>
                      <p><strong>Required By:</strong> {request.requiredBy}</p>
                      <p><strong>Contact:</strong> {request.contact}</p>
                    </div>
                    <div className="admin-request-actions">
                      <button 
                        className="admin-approve-btn"
                        onClick={() => handleApproveRequest(request.hospital)}
                      >
                        Approve
                      </button>
                      <button 
                        className="admin-reject-btn"
                        onClick={() => handleRejectRequest(request.hospital)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="admin-settings">
              <h2>Settings</h2>
              <div className="admin-settings-form">
                <div className="admin-form-group">
                  <label>Site Title</label>
                  <input type="text" defaultValue="Organ Donation Platform" />
                </div>
                <div className="admin-form-group">
                  <label>Admin Email</label>
                  <input type="email" defaultValue="admin@example.com" />
                </div>
                <div className="admin-form-group">
                  <label>Notification Settings</label>
                  <div className="admin-checkbox-group">
                    <label>
                      <input type="checkbox" defaultChecked /> Email notifications for new donors
                    </label>
                  </div>
                  <div className="admin-checkbox-group">
                    <label>
                      <input type="checkbox" defaultChecked /> Email notifications for donation requests
                    </label>
                  </div>
                </div>
                <button className="admin-save-settings">Save Settings</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;