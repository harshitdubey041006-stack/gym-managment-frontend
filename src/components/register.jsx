import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ownerApi as api, setOwnerAccessToken as setAccessToken } from "../api";
import "../styles/auth.css";

function Register() {
    const [step, setStep] = useState("email");

    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [uniquePassword, setUniquePassword] = useState("");
    const [otp, setOtp] = useState("");
    const [ownerCode, setOwnerCode] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function handleSendOtp(e) {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email) {
            setError("Please enter your email first");
            return;
        }
        setLoading(true);
        try{
            const result = await api.post("/auth/send-otp",{ email });
            setMessage(result.data.message || "OTP sent to your email");
            setStep("otp");
        }catch(err){
            setError(err.response?.data?.error || "Failed to send OTP");
        }finally{
            setLoading(false);
        }
    }

    async function handleVerifyOtp(e) {
        e.preventDefault();
        setError("");
        setMessage("");
        if (!otp) {
            setError("Please enter the OTP sent to your email");
            return;
        }
        setLoading(true);
        try {
            const result = await api.post("/auth/verify-otp", { email, otp });
            setMessage(result.data.message || "Email verified");
            setStep("details");
        } catch (err) {
            setError(err.response?.data?.error || "Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        setError("");
        if (!name || !password || !ownerCode) {
            setError("Please fill all fields");
            return;
        }
        setLoading(true);
        try {
            const result = await api.post("/auth/register", {
                name,
                email,
                password: password,
                uniqueCode: ownerCode
            });
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">Gym<span>NeX</span></div>
                <h1>Owner Register</h1>

                <div className="step-indicator">
                    <div className={`step-dot ${step === "email" ? "active" : (step === "otp" || step === "details") ? "done" : ""}`}>1</div>
                    <div className="step-line"></div>
                    <div className={`step-dot ${step === "otp" ? "active" : step === "details" ? "done" : ""}`}>2</div>
                    <div className="step-line"></div>
                    <div className={`step-dot ${step === "details" ? "active" : ""}`}>3</div>
                </div>

                {step === "email" && (
                    <form onSubmit={handleSendOtp} className="auth-form">
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {error && <p className="auth-error">{error}</p>}
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {step === "otp" && (
                    <form onSubmit={handleVerifyOtp} className="auth-form">
                        <p className="auth-subtext">OTP sent to {email}</p>

                        <div className="input-group">
                            <label htmlFor="otp">Enter OTP</label>
                            <input
                                id="otp"
                                type="text"
                                placeholder="6-digit code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                            />
                        </div>

                        {error && <p className="auth-error">{error}</p>}
                        {message && <p className="auth-message">{message}</p>}

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>

                        <button type="button" className="auth-link-btn" onClick={handleSendOtp} disabled={loading}>
                            Resend OTP
                        </button>
                    </form>
                )}

                {step === "details" && (
                    <form onSubmit={handleRegister} className="auth-form">
                        <p className="auth-message">Email verified: {email}</p>

                        <div className="input-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="ownerCode">Owner Registration Code</label>
                            <input
                                id="ownerCode"
                                type="text"
                                placeholder="Provided by GymNeX"
                                value={ownerCode}
                                onChange={(e) => setOwnerCode(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="uniquePassword">Unique Password</label>
                            <input
                                id="uniquePassword"
                                type="text"
                                value={uniquePassword}
                                onChange={(e) => setUniquePassword(e.target.value)}
                            />
                        </div>

                        {error && <p className="auth-error">{error}</p>}
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Register;