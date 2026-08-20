import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/plans.css";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Plans", to: "/plansDetail" },
  { label: "Contact Us", to: "/contact" },
];

const plans = [
  {
    name: "special6",
    price: "1000/month",
    details: "Gym access, Cardio & Weight Area",
  },
  {
    name: "Standard",
    price: "1200/month",
    details: "Basic + Group Classes",
    popular: true,
  },
  {
    name: "Premium",
    price: "5000/month",
    details: "All Access + Personal Trainer",
  },
];

const Plans = (isUserLoggedIn) => {
  const navigate = useNavigate();

  function handleChoosePlan(e, planName, price, durationDays) {
    navigate({
      pathname: isUserLoggedIn ? "/memberStatus" : "/memberLogin",
      state: { planName, price, durationDays },
    });
  }

  return (
    <div className="plans">
      <nav className="navbar">
        <div className="logo">GymNeX</div>
        {navLinks.map((link) => (
          <Link key={link.to} className="navbar-link" to={link.to}>
            {link.label}
          </Link>
        ))}
      </nav>

      <main className="plans-main">
        <h1>Membership Plans</h1>

        <div className="plans-container">
          {plans.map((plan) => (
            <div className={`plan-card ${plan.popular ? "popular" : ""}`} key={plan.name}>
              {plan.popular && <span className="popular-tag">Most Popular</span>}
              <h2>{plan.name}</h2>
              <h3>{plan.price}</h3>
              <p>{plan.details}</p>
              <button
                className="plan-btn"
                onClick={(e) => handleChoosePlan(e, plan.name, plan.price, plan.durationDays)}
              >
                Join Now
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Plans;