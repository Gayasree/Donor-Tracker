import React from 'react';

const AboutUs = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>About Us</h2>
      <p style={styles.text}>
        Welcome to <strong>Organ Donation Platform</strong> a platform dedicated to connecting generous donors with those in need of life-saving blood and organs. 
        Our mission is to make organ and blood donation easier, transparent, and accessible for everyone.
      </p>
      <p style={styles.text}>
        We believe in the power of giving. Every donation is a step towards saving a life, and every donor is a hero. 
        By registering on our platform, you're not just filling a form — you're giving hope.
      </p>
      <p style={styles.text}>
        This website was built with love and purpose to support patients, hospitals, and communities. 
        Together, let’s create a future where no one has to wait for a life-saving gift.
      </p>
    </div>
  );
};

const styles = {
  container: {
    padding: '100px 20px',
    backgroundColor: '#dc3545', // Bootstrap "danger" red
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

export default AboutUs;
