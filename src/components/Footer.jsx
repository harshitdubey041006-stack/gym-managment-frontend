import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer">
            <span>© {new Date().getFullYear()} GymNeX. All rights reserved.</span>
            <div className="footer-links">
                <Link to="/about">About</Link>
                <Link to="/plansDetail">Plans</Link>
                <Link to="/contact">Contact Us</Link>
            </div>
        </footer>
    );
}

export default Footer;