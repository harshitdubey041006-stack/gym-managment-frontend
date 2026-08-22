import { memberApi as api, setMemberAccessToken as setAccessToken } from "../api";
import { useState } from "react";
import { useNavigate, useSearchParams,useLocation } from "react-router-dom";
import "../styles/auth.css";


function MemberLogin({ onLogin }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const[loading,setLoading]=useState(false);
    const[error,setError]=useState("");
    
    const location = useLocation();
    const{planName,price,durationDays}=location.state ?? {};

    async function handleSubmit(e) {
        e.preventDefault(); // stops the page reload
        setLoading(true);
        try{
            const result = await api.post("/memberRegistration/login",{
            email,
            password
            });
             // adjust key name to match your actual response shape
            setAccessToken(result.data.accessToken);
            onLogin();
            navigate("/memberStatus",{state:{planName,price,durationDays,email:email}});
        }catch(err){
            setError(err.response?.data?.message || err.response?.data?.error || "Login failed")
            
        }finally{
            setLoading(false);
        }
        

    }
    function handleNavigateToRegister(e) {
        e.preventDefault();
        navigate("/memberRegistration",{state:{planName,price,durationDays}}); 
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">Gym<span>NeX</span></div>
                <h1>Member Login</h1>
                <p className="auth-subtext">Sign in to view your membership</p>

                <form onSubmit={handleSubmit} className="auth-form">
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

                    <div className="input-group">
                        <label htmlFor="password" aria-required>Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    <button type="button" className="auth-btn" onClick={handleNavigateToRegister}>
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default MemberLogin;