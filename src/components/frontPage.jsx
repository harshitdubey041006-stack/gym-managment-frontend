// import react from "react";
import img1 from "../assets/gym-image2.jpg";
import {Link, useNavigate} from "react-router-dom";
import "../styles/frontPage.css";
import Footer from "./Footer";
// import api, { setAccessToken } from "../api";


function FrontPage({ isUserLoggedIn }) {
    const navigate = useNavigate();
    function handleLogin(e){
        e.preventDefault();
        navigate("/main")
    }
    function handleRegister(e){
        e.preventDefault();
        navigate("/register");
    }

    // handling plan selection 
    function handleChoosePlan(e, planName, price, durationDays){
        e.preventDefault();
        
        navigate(isUserLoggedIn ? "/memberStatus" : "/memberLogin", {
        state: { planName, price, durationDays }
        });
    }
    return(
        <div className="frontPage">
            {/* navbar */}
            <div className="navbar">
                <div className="logo">Gym<span>NeX</span></div>
                <div className="navbar-links">
                    <Link className="navbar-link" to="/">Home</Link>
                    <Link className="navbar-link" to="/about">About</Link>
                    <Link className="navbar-link" to="/plansDetail">Plans</Link>
                    <Link className="navbar-link" to="/contact">Contact Us</Link>
                </div>
                <div className="navbar-actions">
                    <button className="btn-outline" onClick={handleLogin}>Owner Login</button>
                    <button className="btn-fill" onClick={handleRegister}>Owner Register</button>
                </div>
            </div>

            {/* hero section */}
            <div className="hero1">
                <div className="hero-text">
                    <span className="badge">India's Fastest-Growing Gym Community</span>
                    <h1>POWER YOUR <span className="accent">PROGRESS</span></h1>
                    <p>
                        Strong gear. Strong you. Join India's fastest-growing community &
                        transform yourself with premium equipment, expert trainers, and modern
                        workout plans.
                    </p>
                    <div className="hero-cta">
                        <Link className="joinNow" to="/memberFP">Join Now</Link>
                        <Link className="btn-ghost" to="/plansDetail">View Plans →</Link>
                    </div>
                </div>

                <div className="hero-image">
                    <div className="hero-image-glow"></div>
                    <img src={img1} alt="Gym Banner" />
                    <div className="floating-card">
                        <span className="floating-card-number">10K+</span>
                        <span className="floating-card-label">Active Members</span>
                    </div>
                </div>
            </div>

            {/* thodi tareef */}
            <div className="tareef">
                <div className="tareef-card">
                    <span className="tareef-number">10K+</span>
                    <span className="tareef-label">Members</span>
                </div>
                <div className="tareef-card">
                    <span className="tareef-number">5+</span>
                    <span className="tareef-label">Years Experience</span>
                </div>
                <div className="tareef-card">
                    <span className="tareef-number">50+</span>
                    <span className="tareef-label">Professional Trainers</span>
                </div>
            </div>

            {/* plans */}
            <div className="plans-heading">
                <span className="badge">Membership</span>
                <h2>Choose Your Plan</h2>
            </div>

            <div className="plans">
                <div className="plan-card">
                    <h2>Basic</h2>
                    <h3 className="plan-price">₹700<span>/mo</span></h3>
                    <p className="plan-desc">Only strength building with a common trainer</p>
                    <button className="btn-outline plan-btn" type="submit" onClick={(e) => handleChoosePlan(e, "Basic", 700, 30)}>Choose Plan</button>
                </div>
                <div className="plan-card plan-highlight">
                    <span className="popular-tag">Most Popular</span>
                    <h2>Moderate</h2>
                    <h3 className="plan-price">₹1000<span>/mo</span></h3>
                    <p className="plan-desc">Strength building with cardio and a common trainer</p>
                    <button className="btn-fill plan-btn" type="submit" onClick={(e) => handleChoosePlan(e, "Moderate", 1000, 30)}>Choose Plan</button>
                </div>
                <div className="plan-card">
                    <h2>Premium</h2>
                    <h3 className="plan-price">₹5000<span>/mo</span></h3>
                    <p className="plan-desc">Personal trainer, cardio + strength, personal locker room & weekly yoga classes</p>
                    <button className="btn-outline plan-btn" type="submit" onClick={(e) => handleChoosePlan(e, "Premium", 5000, 30)}>Choose Plan</button>
                </div>
            </div>
            <Footer />
        </div>
        
    );
}
export default FrontPage;