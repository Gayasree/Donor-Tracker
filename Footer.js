import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.content}>
        <p>© {new Date().getFullYear()} Donor Tracker | All Rights Reserved</p>
        <p>
          Developed with ❤️ by Gayasree | 
          <a href="mailto:your-email@example.com" style={styles.link}> Contact Us</a>
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#222',
    color: '#fff',
    padding: '20px 0',
    textAlign: 'center',
    marginTop: '50px'
  },
  content: {
    maxWidth: '1000px',
    margin: 'auto',
  },
  link: {
    color: '#00bfff',
    marginLeft: '5px',
    textDecoration: 'none',
  }
};

export default Footer;
