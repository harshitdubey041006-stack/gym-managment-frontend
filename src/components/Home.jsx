import react from "react";
import { useNavigate } from "react-router-dom";
import { ownerApi as api, setOwnerAccessToken as setAccessToken } from "../api";

function Home(){
    const navigate = useNavigate();
    function handleRegister(){
        navigate("/register");
    }
    function handleLogin(){
        navigate("/login");
    }
    return(
        <div className="home">
            <button onClick = {handleRegister}>Register</button>
            <button onClick = {handleLogin}>Login</button>
        </div>
    )
}

export default Home;