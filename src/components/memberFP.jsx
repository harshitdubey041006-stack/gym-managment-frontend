import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function MemberFP({ isLogin }) {
    const navigate = useNavigate();
    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">Gym<span>NeX</span></div>
                <h1>Welcome</h1>
                <p className="auth-subtext">Are you new here, or already a member?</p>

                <div className="choice-group">
                    <button type="button" className="auth-btn" onClick={() => navigate("/memberRegistration")}>
                        Register
                    </button>

                    <button type="button" className="auth-btn-outline" onClick={() => isLogin ? navigate("/memberStatus") : navigate("/memberLogin")}>
                        Login
                        <span className="choice-subtext">(if already registered)</span>
                    </button>
                </div>
            </div>
        </div>
    );
}