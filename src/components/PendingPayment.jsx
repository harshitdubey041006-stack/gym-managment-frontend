import { useEffect, useState } from "react";
import { ownerApi } from "../api";
import "../styles/membershipPlan.css";
import { useNavigate } from "react-router-dom";

export default function PendingPayments() {
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [error, setError] = useState("");
  const [confirmingId, setConfirmingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);

  const loadPending = async () => {
    setError("");
    try {
      const res = await ownerApi.get("/membership/pending");
      setPending(res.data);
    } catch (err) {
      console.error("Error loading pending registrations:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to load pending registrations");
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleConfirm = async (pendingId) => {
    setConfirmingId(pendingId);
    setError("");
    try {
      await ownerApi.patch(`/membership/${pendingId}/confirm`);
      // remove it from the list instead of refetching everything
      setPending((prev) => prev.filter((p) => p.pending_id !== pendingId));
    } catch (err) {
      console.error("Error confirming payment:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to confirm payment");
    } finally {
      setConfirmingId(null);
    }
  };

  const handleReject = async (pendingId) => {
    if (!window.confirm("Reject this registration? This can't be undone.")) return;
    setRejectingId(pendingId);
    setError("");
    try {
      await ownerApi.delete(`/membership/${pendingId}/reject`);
      setPending((prev) => prev.filter((p) => p.pending_id !== pendingId));
    } catch (err) {
      console.error("Error rejecting registration:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to reject registration");
    } finally {
      setRejectingId(null);
    }
  };

  return (
    <div className="mp-page">
      <div className="mp-card">
        <h1 className="mp-heading">Pending Registrations</h1>
        <p className="mp-sub">Confirm once you've verified the UPI payment came in, or reject a request.</p>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {pending.length === 0 ? (
          <p>No pending registrations.</p>
        ) : (
          <table className="mp-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Note</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pending.map((p) => (
                <tr key={p.pending_id}>
                  <td>{p.mname}</td>
                  <td>{p.mob_no}</td>
                  <td>{p.plan_name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.payment_note}</td>
                  <td style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      className="mp-submit-btn"
                      disabled={confirmingId === p.pending_id || rejectingId === p.pending_id}
                      onClick={() => handleConfirm(p.pending_id)}
                    >
                      {confirmingId === p.pending_id ? "Confirming..." : "Mark as Paid"}
                    </button>
                    <button
                      type="button"
                      className="mp-reject-btn"
                      disabled={confirmingId === p.pending_id || rejectingId === p.pending_id}
                      onClick={() => handleReject(p.pending_id)}
                    >
                      {rejectingId === p.pending_id ? "Rejecting..." : "Reject"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <button onClick={() => navigate("/main")}>Back to Member Search</button>
    </div>
  );
}