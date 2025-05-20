import React, { useEffect, useState } from 'react';
import api from '../utils/axiosConfig';
import './DonorList.css';

function DonorList() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all donors from the database
    const fetchDonors = async () => {
      try {
        setLoading(true);
        console.log('Fetching donors from backend...');
        
        // Fetch donors from the backend API
        const response = await fetch('http://localhost:5000/api/donors');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Donors fetched from backend:', data);
        
        if (Array.isArray(data) && data.length > 0) {
          // Check if there's a newly registered donor in localStorage to highlight it
          const newDonorData = localStorage.getItem('newDonorData');
          let newDonorEmail = null;
          
          if (newDonorData) {
            try {
              const newDonor = JSON.parse(newDonorData);
              newDonorEmail = newDonor.email;
            } catch (err) {
              console.error('Error parsing new donor data:', err);
            }
          }
          
          // Mark newly registered donor for highlighting
          const processedData = data.map(donor => {
            if (newDonorEmail && donor.email === newDonorEmail) {
              return { ...donor, isNew: true };
            }
            return donor;
          });
          
          setDonors(processedData);
        } else {
          // If no donors returned, show empty state
          setDonors([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching donors:', err);
        setError('Failed to load donors. Please try again later.');
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  // Function to check if donor is eligible (last donation was at least 6 months ago)
  const isDonorEligible = (lastDonationDate) => {
    if (!lastDonationDate) {
      return true; // If no previous donation, they are eligible
    }
    
    const lastDonation = new Date(lastDonationDate);
    const today = new Date();
    
    // Calculate the difference in months
    const monthsDiff = 
      (today.getFullYear() - lastDonation.getFullYear()) * 12 + 
      (today.getMonth() - lastDonation.getMonth());
    
    return monthsDiff >= 6; // Eligible if at least 6 months have passed
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No previous donation';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleBook = async (donor) => {
    try {
      console.log('Booking donor:', donor);
      
      // Check if donor is eligible based on last donation date
      if (!isDonorEligible(donor.lastDonationDate)) {
        alert('This donor is not eligible to donate blood yet. Donors must wait at least 6 months between donations.');
        return;
      }
      
      // Show confirmation dialog
      const confirmBooking = window.confirm(`Are you sure you want to book this donor: ${donor.name} (${donor.bloodType})?`);
      
      if (!confirmBooking) {
        return; // User cancelled the booking
      }
      
      // Show booking in progress
      document.body.style.cursor = 'wait'; // Change cursor to waiting
      
      // Simulate a delay for better user experience
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the donor's last donation date in the local state
      setDonors(prevDonors => 
        prevDonors.map(d => 
          d._id === donor._id 
            ? {...d, lastDonationDate: new Date().toISOString(), patientCount: (d.patientCount || 0) + 1} 
            : d
        )
      );
      
      // Reset cursor
      document.body.style.cursor = 'default';
      
      // Create a new donation request
      const hospitalNames = ['City General Hospital', 'Memorial Medical Center', 'St. Mary\'s Hospital', 'University Medical Center'];
      const doctorNames = ['Dr. Johnson', 'Dr. Smith', 'Dr. Williams', 'Dr. Brown', 'Dr. Davis'];
      
      // Generate random hospital and doctor
      const hospital = hospitalNames[Math.floor(Math.random() * hospitalNames.length)];
      const doctor = doctorNames[Math.floor(Math.random() * doctorNames.length)];
      const phoneNumber = `555-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Create the donation request
      const donationRequest = {
        hospital: hospital,
        bloodType: donor.bloodType,
        quantity: '1 unit',
        requiredBy: 'As soon as possible',
        contact: `${doctor} (${phoneNumber})`,
        status: Math.random() > 0.7 ? 'urgent' : 'normal'
      };
      
      // Save to localStorage for Admin component to pick up
      localStorage.setItem('newDonationRequest', JSON.stringify(donationRequest));
      
      // Show success message
      alert(`Donor ${donor.name} has been successfully booked! A donation request has been sent to the admin.`);
      
    } catch (err) {
      // Reset cursor in case of error
      document.body.style.cursor = 'default';
      
      console.error('Error booking donor:', err);
      alert('Unable to complete booking. Please try again later.');
    }
  };

  return (
    <div className="donor-list-page" style={{ backgroundImage: "url('/images/donor-list-bg.jpg')" }}>
      <div className="donor-list-overlay"></div>
      <div className="donor-list-container">
        <div className="donor-list-card">
          <h2 className="donor-list-header">Blood Donors List</h2>
      
      {loading ? (
        <div className="donor-list-loading">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading donors...</p>
        </div>
      ) : error ? (
        <div className="donor-list-error">
          {error}
          <button className="donor-list-try-again" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      ) : donors.length === 0 ? (
        <div className="donor-list-empty">
          No donors found. Please check back later.
        </div>
      ) : (
        <table className="donor-list-table">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Blood Type</th>
              <th>Last Donation</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {donors.map((donor) => {
              const isEligible = isDonorEligible(donor.lastDonationDate);
              
              return (
                <tr key={donor._id} className={donor._id.toString().startsWith('new_') ? 'new-donor' : ''}>
                  <td>{donor.name}</td>
                  <td>{donor.email}</td>
                  <td>
                    <span style={{ 
                      backgroundColor: '#c40d06', 
                      color: 'white', 
                      padding: '5px 10px', 
                      borderRadius: '4px',
                      fontWeight: 'bold'
                    }}>
                      {donor.bloodType}
                    </span>
                  </td>
                  <td>{formatDate(donor.lastDonationDate)}</td>
                  <td>
                    <span style={{
                      backgroundColor: isEligible ? '#28a745' : '#dc3545',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      fontWeight: 'bold'
                    }}>
                      {isEligible ? '✅': '✕'}
                    </span>
                  </td>
                  <td>
                    <button 
                      style={{
                        backgroundColor: isEligible ? '#c40d06' : '#6c757d',
                        border: 'none',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: isEligible ? 'pointer' : 'not-allowed',
                        opacity: isEligible ? 1 : 0.7
                      }}
                      onClick={() => handleBook(donor)}
                      disabled={!isEligible}
                    >
                      Book Donor
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
        </div>
      </div>
    </div>
  );
}

export default DonorList;
