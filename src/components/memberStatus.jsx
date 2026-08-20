import { useState, useEffect } from "react";
import { memberApi as api } from "../api"; // axios instance sending the member's token
import { useNavigate,useLocation } from "react-router-dom";
import "../styles/memberStatus.css";


export default function MemberStatus() {
    
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const[state,setState]=useState("add");
    const navigate = useNavigate();
     const location = useLocation(); 

    const{planName,price,durationDays} = location.state ?? {};
    console.log("planName : ", planName);
    console.log("price : ", price);
    console.log("durationDays : ", durationDays);

    useEffect(() => {
    const fetchStatus = async () => {
        try {
           const result = await api.get("/me"); // matches your backend route
            setStatus(result.data);
            console.log("membership status is : ",result.data);
            if(result.data){
                setState("added");
            }else{
                setState("add");
            }
        
        } catch (err) {
            console.error(err);
            setError("Could not load your membership details");
        } finally {
            setLoading(false);
            
        }
    };

    fetchStatus();
    }, []);

    // if (loading) return <div className="memStatus">Loading...</div>;
    // if (error) return <div className="memStatus">{error}</div>;
    // if (!status) return <div className="memStatus">No membership found</div>;

    return (
        <div className="memStatus-page">
            {state === "added" && (<div className="memStatus">
        <img src={status.photo_url} alt={status.mname} />
        <h2>{status.mname}</h2>
        <div className="memStatus-details">
            <p><span>Plan</span>{status.plain_name}</p>
            <p><span>Duration</span>{status.duration_days} days</p>
            <p><span>Start</span>{new Date(status.start_date).toLocaleDateString('en-GB')}</p>
            <p><span>Expires</span>{new Date(status.expiry_date).toLocaleDateString('en-GB')}</p>
            <p><span>Remaining Days</span>{status.remaining_days}</p>
            <p><span>Mobile Number</span>{status.mob_no}</p>
            <p><span>Amount paid</span>{status.ammount_paid}</p>
        </div>
    </div>)
    }
    {state ==="add" && 
        (<div className="addMem">
            <h2>You are not a member yet</h2>
            <p className="addMem-sub">Join now to unlock access, plans, and tracking.</p>
            <button className="addMem-btn" onClick={() => navigate("/members", { state: { userOrMem: "member",planName, price, durationDays }})}>Become a member</button>

        </div>)
    }
    </div>
    );
}