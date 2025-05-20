import React from 'react';

const Contact = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Contact Us</h2>
      <p style={styles.text}>
        If you have any questions, feedback, or would like to get involved, we’d love to hear from you.
      </p>
      <ul style={styles.text}>
        <li>Email: support@donortracker.org</li>
        <li>Phone: +91 98765 43210</li>
        <li>Address: Life House, Chennai, India</li>
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px 20px',
    backgroundColor: '#dc3545',  // Bootstrap red
    maxWidth: '900px',
    margin: 'auto',
    borderRadius: '10px',
    marginTop: '40px',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#fff',
    textAlign: 'center',
  },
  text: {
    fontSize: '1.1rem',
    lineHeight: '1.7',
    marginBottom: '15px',
    color: '#fff',
  }
};

export default Contact;
