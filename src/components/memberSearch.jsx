import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/memberSearch.css";
import { ownerApi as api, setMemberAccessToken as setAccessToken } from "../api";

export default function Search(){
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    function handleClick(){
        navigate("/members")
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(true)
                api.get(`/members`,{
                    params:{search}
                })
                .then(res => setMembers(Array.isArray(res.data) ? res.data : []))
                .catch(err => console.error(err))
                .finally(() => setLoading(false))
        },300);
        return () => clearTimeout(timeout);
    },[search]);
    function handleDeleteConfirmation(mob_no, name) {
        if (window.confirm(`Are you sure you want to delete member ${name}?`)) {
            handleDeleteMember(mob_no, name);
        }
    }
    function handleDeleteMember( mob_no, name) {
    if (!mob_no) {
        return;
    }
    api.delete(`/members/${mob_no}`)
        .then(() => {
            setMembers(prev => prev.filter(m => m.mob_no !== mob_no));
            alert(`Member ${name} deleted successfully.`);
        })
        .catch(err => {
            alert(`Failed to delete member ${name}.`);
        });
    }

    return(
        <div className="search-bar">
            <input type="text" placeholder="Search by name or contact..." value={search} onChange={(e) => setSearch(e.target.value)}/>
            <div className="member-grid">
                {members.map(m => {
                    const statusClass =
                        m.remaining_days == null
                            ? "status-none"
                            : m.remaining_days >= 0
                            ? "status-active"
                            : "status-expired";

                    return (
                        <div key={m.mob_no} className="member-card">
                            <img src={m.photo_url} alt={m.mname} />
                            <h3>{m.mname}</h3>
                            <p>{m.mob_no}</p>
                            <p>{m.plan_name}</p>
                            <p>{new Date(m.start_date).toLocaleDateString("en-GB")} - {new Date(m.end_date).toLocaleDateString("en-GB")}</p>
                            <p className={statusClass}>
                                {m.remaining_days == null
                                ? "No active plan"
                                : m.remaining_days >= 0
                                ? `${m.remaining_days} days left`
                                : `Expired ${Math.abs(m.remaining_days)} days ago`}
                            </p>
                            <button onClick={() => handleDeleteConfirmation(m.mob_no, m.mname)}>Delete</button>
                        </div>
                    );
                })}
            </div>
            <button onClick={(e) => navigate("/pendingPayments")}>pending payments</button>

            <button onClick={handleClick}>add</button>
        </div>
    )
}