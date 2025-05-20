import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-background d-flex flex-column align-items-center">
      {/* Welcome Section */}
      <div className="home-content text-center text-black mt-5 mb-4 my-5">
        <h1>Welcome to Organ Donation</h1>
        <p>Don’t take your organs to heaven. Heaven knows we need them here.</p>
      </div>

      {/* About Us Section */}
      <div className="section-red">
        <h2 className="section-heading">About Us</h2>
        <p className="section-text">
          Welcome to <strong>Organ Donation Platform</strong> a platform dedicated to connecting generous donors with those in need of life-saving blood and organs.
          Our mission is to make organ and blood donation easier, transparent, and accessible for everyone.
        </p>
        <p className="section-text">
          We believe in the power of giving. Every donation is a step towards saving a life, and every donor is a hero.
          By registering on our platform, you're not just filling a form — you're giving hope.
        </p>
        <p className="section-text">
          This website was built with love and purpose to support patients, hospitals, and communities.
          Together, let’s create a future where no one has to wait for a life-saving gift.
        </p>
      </div>

      {/* Contact Section */}
      <div className="section-red">
        <h2 className="section-heading">Contact Us</h2>
        <p className="section-text">
          Have questions or want to get involved? We'd love to hear from you!
        </p>
        <p className="section-text">
          📧 Email: <a href="mailto:gayasreemanigandan@gmail.com" className="contact-link">gayasreemanigandan@gmail.com</a>
        </p>
        <p className="section-text">
          📍 Location: Karur, India
        </p>
        <p className="section-text">
          💬 You can also reach us through our social media channels.
        </p>
      </div>
    </div>
  );
};

export default Home;
