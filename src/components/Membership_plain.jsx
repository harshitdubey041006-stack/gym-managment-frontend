import { useState } from "react";
import { memberApi, ownerApi, setMemberAccessToken as setAccessToken } from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/membershipPlan.css";
import useBlockBackNavigation from "./BlockBackNavigation";

const PLANS = [
  { label: "1 Month", planName: "1 Month", durationDays: 30, price: 700 },
  { label: "2 Months", planName: "2 Months", durationDays: 60, price: 1200 },
  { label: "3 Months", planName: "3 Months", durationDays: 90, price: 1500 },
  { label: "6 Months", planName: "6 Months", durationDays: 180, price: 3000 },
  { label: "12 Months", planName: "12 Months", durationDays: 365, price: 5000 },
];

export default function MembershipPlanForm({ onSubmit, isOwner }) {
  useBlockBackNavigation("/");

  const api = isOwner ? ownerApi : memberApi;
  const navigate = useNavigate();
  const location = useLocation();

  // Member details collected on the Members page, forwarded through this form
  const { mobNo, mName, gender, photoUrl, status, userOrMem } = location.state ?? {};

  const [planName, setPlanName] = useState(location.state?.planName ?? "");
  const [durationDays, setDurationDays] = useState(location.state?.durationDays ?? "");
  const [price, setPrice] = useState(location.state?.price ?? "");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [status2, setStatus2] = useState("idle"); // "idle" | "saving" | "success" | "error"

  const handlePlanClick = (plan, index) => {
    setSelectedIndex(index);
    setPlanName(plan.planName);
    setDurationDays(plan.durationDays);
    setPrice(plan.price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      plainName: planName,
      durationDays: Number(durationDays),
      price: Number(price),
    };

    if (onSubmit) {
      onSubmit(payload);
      return;
    }

    setStatus2("saving");

    try {
      const res = await api.post("/membershipPlan", payload);
      console.log("Plan saved:", res.data);
      setStatus2("success");

      navigate("/membership", {
        state: { mobNo, mName, gender, photoUrl, status, userOrMem, planName, price, durationDays },
      });
    } catch (err) {
      console.error("Failed to save plan:", err);
      setStatus2("error");
    }
  };

  return (
    <div className="mp-page">
      <form onSubmit={handleSubmit} className="mp-card">
        <h1 className="mp-heading">Add Membership Plan</h1>
        <p className="mp-sub">
          Pick a plan to auto-fill duration and price — both stay editable.
        </p>

        <label className="mp-label">Plan</label>
        <div className="mp-plan-grid">
          {PLANS.map((plan, index) => (
            <button
              type="button"
              key={plan.label}
              onClick={() => handlePlanClick(plan, index)}
              className={`mp-plan-btn ${selectedIndex === index ? "mp-plan-btn-active" : ""}`}
            >
              {plan.label}
            </button>
          ))}
        </div>

        <div className="mp-field">
          <label className="mp-label" htmlFor="planName">
            Plan Name
          </label>
          <input
            id="planName"
            type="text"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="mp-input"
            required
          />
        </div>

        <div className="mp-field">
          <label className="mp-label" htmlFor="durationDays">
            Duration (days)
          </label>
          <input
            id="durationDays"
            type="number"
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            className="mp-input"
            required
          />
        </div>

        <div className="mp-field">
          <label className="mp-label" htmlFor="price">
            Price (₹)
          </label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mp-input"
            required
          />
          <div className="mp-hint">please enter a valid price</div>
        </div>

        <button type="submit" className="mp-submit-btn" disabled={status2 === "saving"}>
          {status2 === "saving" ? "Saving..." : "Save Plan"}
        </button>

        {status2 === "success" && <div className="mp-success-msg">Plan saved successfully.</div>}
        {status2 === "error" && (
          <div className="mp-error-msg">Something went wrong — check the console for details.</div>
        )}
      </form>
    </div>
  );
}