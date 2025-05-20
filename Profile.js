import React, { useEffect, useState } from 'react';
import api from '../utils/axiosConfig';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ lastDonationDate: '', patientCount: 0 });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          return;
        }
        
        console.log('Fetching profile with token:', token ? 'Token exists' : 'No token');
        
        const response = await fetch('http://localhost:5000/api/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Profile data:', data);
        
        setUser(data);
        setFormData({
          lastDonationDate: data.lastDonationDate?.substring(0, 10) || '',
          patientCount: data.patientCount || 0,
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to update your profile');
        return;
      }
      
      console.log('Updating profile with data:', formData);
      
      const response = await fetch('http://localhost:5000/api/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Update failed');
      }
      
      const data = await response.json();
      console.log('Update response:', data);
      
      setEditing(false);
      
      // Update the user state instead of reloading
      setUser(data);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update profile: ' + (err.message || 'Unknown error'));
    }
  };

  if (!user) return <div className="profile-loading">Loading profile...</div>;

  return (
    <div className="profile-page" style={{ backgroundImage: "url('/images/profile-bg.jpg')" }}>
      <div className="profile-overlay"></div>
      <div className="profile-card-container">
        <div className="profile-card">
          <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <h2 className="profile-name">{user.name}</h2>
          <div className="profile-info">
            <div className="profile-info-item">
              <span className="profile-info-label">Email:</span>
              <span className="profile-info-value">{user.email}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Last Donation:</span>
              <span className="profile-info-value">{user.lastDonationDate?.substring(0, 10) || 'N/A'}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Patients Helped:</span>
              <span className="profile-info-value">{user.patientCount || 0}</span>
            </div>
          </div>

          {editing ? (
            <div className="profile-edit-section">
              <div className="profile-edit-field">
                <label>Last Donation Date:</label>
                <input
                  type="date"
                  value={formData.lastDonationDate}
                  onChange={(e) => setFormData({ ...formData, lastDonationDate: e.target.value })}
                />
              </div>
              <div className="profile-edit-field">
                <label>Patient Count:</label>
                <input
                  type="number"
                  min={0}
                  value={formData.patientCount}
                  onChange={(e) => setFormData({ ...formData, patientCount: e.target.value })}
                />
              </div>
              <div className="profile-buttons">
                <button className="profile-save-btn" onClick={handleUpdate}>Save Changes</button>
                <button className="profile-cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <button className="profile-edit-btn" onClick={() => setEditing(true)}>Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
