import { useState } from "react";
import { useNavigate, useSearchParams,useLocation } from "react-router-dom";
import { memberApi as api, setMemberAccessToken as setAccessToken } from "../api";
import "../styles/auth.css";

function memberRegistration() {
    const navigate = useNavigate();
    const location = useLocation();
    const{planName,price,durationDays}=location.state ?? {};
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [ownerCode, setOwnerCode] = useState("");
    console.log("planName:", planName, "price:", price, "durationDays:", durationDays);
    
    const[otp,setOtp]=useState();
    const[step,setStep] = useState("email")
    const [message,setMessage]=useState("");
    const[loading,setLoading]=useState(false);
    const[error,setError]=useState("");
    
    // const location = useLocation();
    // const{planName,price,durationDays}=location.state ?? {};
    
    async function sendOtp(e){
        e.preventDefault();
        setMessage("")
        setLoading(true);

        if(!email){
            setError("Please enter your email first");
            return;
        }
        try{
            const result = await api.post("/memberRegistration/send-otp",{
            email
        })
        setMessage(result.data.message || "OTP sent to your email");
        setStep("otp"); // move to OTP entry
        }catch(err){
            console.error(err);
            setError(err.response?.data?.error || "Failed to send OTP");
        }finally{
            setLoading(false);
        }
    }
    async function verifyOtp(e){
        e.preventDefault();
        setError("");
        setMessage("");
        if(!otp){
            setError("Please enter the OTP sent to your email");
            return;
        }
        setLoading(true);

        try{
            const result = await api.post("/memberRegistration/verify-otp",{email,otp});
            setMessage(result.data.message || "Email verified");
            setStep("details"); // move to name/password/owner code
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    }
    
    async function handleRegister(e) {
        e.preventDefault(); // stops the page reload
        console.log({ name, email, ownerCode });
        setLoading(true);
        try{
            const result = await api.post("/memberRegistration/register",{
            name,
            email,
            password:ownerCode,
            
            });
            console.log("memberRegistrationed:", result.data);
            navigate("/memberLogin",{state:{planName,price,durationDays}});
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Registration failed");
        } finally {
            setLoading(false);
        }
        

    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">Gym<span>NeX</span></div>
                <h1>Member Register</h1>

                <div className="step-indicator">
                    <div className={`step-dot ${step === "email" ? "active" : (step === "otp" || step === "details") ? "done" : ""}`}>1</div>
                    <div className="step-line"></div>
                    <div className={`step-dot ${step === "otp" ? "active" : step === "details" ? "done" : ""}`}>2</div>
                    <div className="step-line"></div>
                    <div className={`step-dot ${step === "details" ? "active" : ""}`}>3</div>
                </div>

                {/* step1 */}
                {step == "email" && <form onSubmit={sendOtp} className="auth-form">
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="text"
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
                }

                {/* step2 */}
                {step=="otp" &&
                <form onSubmit={verifyOtp} className="auth-form">
                    <p className="auth-subtext">OTP sent to {email}</p>
                    <div className="input-group">
                        <label htmlFor="otp">Enter OTP</label>
                        <input
                            id="otp"
                            type="text"
                            placeholder="6-digit code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>
                    {error && <p className="auth-error">{error}</p>}
                    {message && <p className="auth-message">{message}</p>}
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "verifying..." : "Verify OTP"}
                    </button>
                    {/* let them resend if it expired or didn't arrive */}
                    <button type="button" className="auth-link-btn" onClick={sendOtp} disabled={loading}>
                        Resend OTP
                    </button>
                </form>
                }

                {/* step3 */}
                {step == "details" && (
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
                            <label htmlFor="detailsEmail">Email</label>
                            <input
                                id="detailsEmail"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="ownerCode">Password</label>
                            <input
                                id="ownerCode"
                                type="text"
                                placeholder="Enter a strong password"
                                value={ownerCode}
                                onChange={(e) => setOwnerCode(e.target.value)}
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

export default memberRegistration;