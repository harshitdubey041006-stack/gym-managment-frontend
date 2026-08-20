import React from "react";
import { Link } from "react-router-dom";
import "../styles/contactUs.css";

const Contact = () => {
  return (
    
    <div className="contact">
        {/* navbar */}
            <div className="navbar">
                <div className="logo">GymNeX</div>
                <Link className="navbar-link" to="/">Home</Link>
                <Link className="navbar-link" to="/about">About</Link>
                <Link className="navbar-link" to="/PlansDetail">Plans</Link>
                <Link className="navbar-link" to="/contact">Contact Us</Link>
                
                {/* <button onClick={handleLogin}>Owner Login</button>
                <button onClick={handleRegister}>Owner Register</button> */}

            </div>

      <h1>Contact Us</h1>

      <div className="contact-details">
        <p>
          <strong>Address:</strong> 123 Fitness Street, MP Nagar, New Bhopal, India
        </p>

        <p>
          <strong>Phone:</strong> +91 9876543210
        </p>

        <p>
          <strong>Email:</strong> info@gymfit.com
        </p>

        <p>
          <strong>Working Hours:</strong> Monday - Saturday, 6:00 AM - 10:00 PM
        </p>
      </div>
    </div>
  );
};

export default Contact;