import react from "react";
import { Link,useNavigate } from "react-router-dom";
import "../styles/about.css";
import joeImg from "../assets/gym-trainer3.jpg";
import mikeImg from "../assets/gym-tranner2.jpg";
import johnImg from "../assets/personal-trainer1.webp";


export default function About(){
    const navigate = useNavigate();
    function handleClick(e){
        e.preventDefault();
        navigate("/contact")
    }
    return(
        <div className="parent">
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

            <div className="about-section">
            <h1>About Us Page</h1>
            <p>We Are GymNex And We Buil What Body Need.</p>
            </div>

            <h2>Our Team</h2>
            <div className="row">
            <div className="column">
                <div className="card">
                <img src={joeImg} alt="Harshit" style={{width: '100%'}}></img>
                <div className="container">
                <h2>Joe</h2>
                <p className="title">CEO & Founder</p>
                <p>Student and fitness trainer.</p>
                <p>Joe@example.com</p>
                <p><button className="button" onClick={handleClick}>Contact</button></p>
                </div>
                </div>
            </div>

            <div className="column">
                <div className="card">
                <img src={mikeImg} alt="Mike" style={{width: '100%'}}></img>
                <div className="container">
                    <h2>Mike</h2>
                    <p className="title">Art Director</p>
                    <p>completed trainning from 7c fitness with 4.5 starts.</p>
                    <p>mike@example.com</p>
                    <p><button className="button" onClick={handleClick}>Contact</button></p>
                </div>
                </div>
            </div>

            <div className="column">
                <div className="card">
                <img src={johnImg} alt="John" style={{width: '100%'}}></img>
                <div className="container">
                    <h2>John Doe</h2>
                    <p className="title">Designer</p>
                    <p>Have experience of more than 12 years.</p>
                    <p>john@example.com</p>
                    <p><button className="button" onClick={handleClick}>Contact</button></p>
                </div>
                </div>
            </div>
            </div>
        </div>
    );
}