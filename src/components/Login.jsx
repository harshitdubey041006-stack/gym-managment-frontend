import { ownerApi as api, setOwnerAccessToken as setAccessToken } from "../api";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/login.css";

function Login({ onLogin }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const[loading,setLoading]=useState(false);
    const[error,setError]=useState("");

    async function handleSubmit(e) {
        e.preventDefault(); // stops the page reload
        console.log({ email, password });
        setLoading(true);
        try{
            const result = await api.post("/auth/login",{
            email,
            password
            });
             // adjust key name to match your actual response shape
            setAccessToken(result.data.accessToken);
            onLogin();
            navigate("/main");
        }catch(err){
            console.error(err);
            setError(err.response?.data?.message || "Login failed");
        }finally{
            setLoading(false);
        }
        

    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">Gym<span>NeX</span></div>
                <h1>Owner Login</h1>
                <p className="auth-subtext">Sign in to manage your gym</p>

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
                </form>
            </div>
        </div>
    );
}

export default Login;