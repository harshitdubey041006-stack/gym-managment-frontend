// import { useState } from "react";
// import { memberApi, ownerApi, setMemberAccessToken as setAccessToken } from "../api";
// import { useNavigate,useLocation } from "react-router-dom";
// import "../styles/membershipPlan.css";
// import { QRCodeCanvas } from 'qrcode.react';
// import useBlockBackNavigation from "./BlockBackNavigation";

// export default function Membership({ isOwner}){
//     useBlockBackNavigation('/');
//     console.log("isOwner is : ",isOwner);
//     const api = isOwner ? ownerApi : memberApi;
    
//     const navigate = useNavigate();
//     const location = useLocation();

//     const [mobNo, setMobNo] = useState(location.state?.mobNo ?? "");
//     const{userOrMem,price} = location.state ?? {};
//     const [memberId, setMemberId] = useState(location.state?.memberId ?? "");
//      console.log("the state mob 3 is: " ,mobNo)
//      console.log("userOrMem" , userOrMem);
//      console.log("price" , price);

//     const [planName,setPlanName]= useState(location.state?.planName ?? "");
//     const [error, setError] = useState("");
//     const [step, setStep] = useState("form");

//     const [membershipId, setMembershipId] = useState(null);
//     const [paymentNote, setPaymentNote] = useState(null);
//     const [planPrice, setPlanPrice] = useState(price ?? null);

//     const PLAN_OPTIONS = ["1 Month", "2 Months", "3 Months", "6 Months", "12 Months","Basic","Moderate","Premium","Elite"];

//     const upiId = "8839548803-1@nyes";
//     const gymName = "GymNEX";
    
//     console.log("planPrice:", planPrice, "paymentNote:", paymentNote);
//     const upiString = paymentNote
//         ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(gymName)}&am=${planPrice}&cu=INR&tn=${paymentNote}`
//         : "";
//     console.log("UPI String:", upiString);
//     const handleSubmit = async (e) =>{
//         e.preventDefault();
//         setError("");

//         if (!planName) {
//             setError("Please select a plan");
//             return;
//         }

//         const payload = {
//             mobNo: Number(mobNo),
//             planName,
//         };

//         try{
//             const res = await api.post("/membership",payload);
//             const { membership, plan_price } = res.data;

//             setMembershipId(membership.membership_id);
//             setPaymentNote(membership.payment_note);
//             setPlanPrice(plan_price);
//             setStep("qr");
//         }catch(err){
//             console.error("Error saving membership:", err.response?.data || err.message);
//             setError(err.response?.data?.error || "Failed to create membership");
//         }
//     }

//     const handleConfirmPayment = async () => {
//         setError("");
//         try {
//             await api.patch(`/membership/${membershipId}/confirm`);
//             if(isOwner){
//                 navigate("/main");
//                 return;
//             }
//             navigate("/memberStatus");
//         } catch (err) {
//             console.error("Error confirming payment:", err.response?.data || err.message);
//             setError(err.response?.data?.error || "Failed to confirm payment");
//         }
//     }
//     console.log("step is : ",step);
//     if(step === "qr") {
//         return (
//             <div className="mp-page">
//                 <div className="mp-card">
//                     <h1 className="mp-heading">Scan to Pay</h1>
//                     <p className="mp-sub">₹{planPrice} — {planName}</p>

//             <QRCodeCanvas value={upiString} size={220} />
//             <p>Scan to pay ₹{planPrice}</p>

//             {error && <p style={{ color: "red" }}>{error}</p>}

//             {isOwner ? (
//             <button type="button" className="mp-submit-btn" onClick={handleConfirmPayment}>
//                 Mark as Paid
//             </button>
//             ) : (
//             <p>Waiting for gym staff to confirm your payment.</p>
//             )}
//             </div>
//         </div>
//         )}
//     console.log("step is : ",step);
//     return(
//         <div className="mp-page">
//             <form action="" className="mp-card">
//                 <h1 className="mp-heading">Confirm Membership</h1>
//                 <p className="mp-sub">Review the details and confirm payment status.</p>

//                 <div className="mp-field">
//                     <label className="mp-label" htmlFor="mobNo">Mobile Number</label>
//                     <input id="mobNo" className="mp-input" type="number" value={mobNo} onChange = {(e) => setMobNo(e.target.value)}/>
//                 </div>

//                 <div className="mp-field">
//                     <label className="mp-label" htmlFor="planName">Plan Name</label>
//                     <select id="planName" className="mp-input" value={planName} onChange={(e) => setPlanName(e.target.value)}>
//                         <option value="">-- Select a plan --</option>
//                         {PLAN_OPTIONS.map((plan) => (
//                             <option key={plan} value={plan}>{plan}</option>
//                         ))}
//                     </select>
//                 </div>

//                 <div className="mp-field">
//                     <label className="mp-label" htmlFor="price">Amount to Pay</label>
//                     <input id="price" className="mp-input" value={planPrice ?? ""} disabled />
//                 </div>

//                 {error && <p style={{ color: "red" }}>{error}</p>}

//                 <button type="button" className="mp-submit-btn" onClick={handleSubmit}>Submit</button>
//             </form>
//         </div>
//     )
// }
import { useState } from "react";
import { memberApi, ownerApi, setMemberAccessToken as setAccessToken } from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/membershipPlan.css";
import { QRCodeCanvas } from 'qrcode.react';
import useBlockBackNavigation from "./BlockBackNavigation";

export default function Membership({ isOwner }) {
    useBlockBackNavigation('/');
    const api = isOwner ? ownerApi : memberApi;

    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Now receiving full member details (not just mobNo) from the chain
    const [mobNo, setMobNo] = useState(location.state?.mobNo ?? "");
    const { userOrMem, price, mName, gender, photoUrl, status } = location.state ?? {};
    const [memberId, setMemberId] = useState(location.state?.memberId ?? "");

    const [planName, setPlanName] = useState(location.state?.planName ?? "");
    const [error, setError] = useState("");
    const [step, setStep] = useState("form");

    const [membershipId, setMembershipId] = useState(null);
    const [paymentNote, setPaymentNote] = useState(null);
    const [planPrice, setPlanPrice] = useState(price ?? null);
    const [startDate, setStartDate] = useState("");

    const PLAN_OPTIONS = ["1 Month", "2 Months", "3 Months", "6 Months", "12 Months", "Basic", "Moderate", "Premium", "Elite"];

    const upiId = "8839548803-1@nyes";
    const gymName = "GymNEX";

    const upiString = paymentNote
        ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(gymName)}&am=${planPrice}&cu=INR&tn=${paymentNote}`
        : "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!planName) {
            setError("Please select a plan");
            return;
        }
        if (!mName || !gender || !photoUrl || !status) {
            setError("Missing member details — please go back and fill the member form again.");
            return;
        }

        // ✅ CHANGED: now posts full member details + plan together to the
        // NEW /membership/register endpoint, which creates (or finds) the
        // member AND the pending membership row in ONE DB transaction.
        // This is the actual fix — previously "/members" wrote the member
        // row on a different page, before payment; now nothing is written
        // to the DB until this single step, right before the QR is shown.
        const payload = {
            mname: mName,
            gender,
            mob_no: Number(mobNo),
            photo_url: photoUrl,
            status,
            planName,
            startDate
        };

        try {
            const res = await api.post("/membership/register", payload);
            const { pending, plan_price } = res.data;

            setMembershipId(pending.pending_id);
            setPaymentNote(pending.payment_note);
            setPlanPrice(plan_price);
            setStep("qr");
        } catch (err) {
            console.error("Error saving membership:", err.response?.data || err.message);
            setError(err.response?.data?.error || "Failed to create membership");
        }
    };

    const handleConfirmPayment = async () => {
        setError("");
        try {
            await api.patch(`/membership/${membershipId}/confirm`);
            if (isOwner) {
                navigate("/main");
                return;
            }
            navigate("/memberStatus");
        } catch (err) {
            console.error("Error confirming payment:", err.response?.data || err.message);
            setError(err.response?.data?.error || "Failed to confirm payment");
        }
    };

    if (step === "qr") {
        return (
            <div className="mp-page">
                <div className="mp-card">
                    <h1 className="mp-heading">Scan to Pay</h1>
                    <p className="mp-sub">₹{planPrice} — {planName}</p>

                    <a href={upiString} className="mp-qr-link">
                        <QRCodeCanvas value={upiString} size={220} />
                    </a>
                    <p>Scan to pay ₹{planPrice}</p>

                    {error && <p style={{ color: "red" }}>{error}</p>}

                    {isOwner ? (
                        <button type="button" className="mp-submit-btn" onClick={handleConfirmPayment}>
                            Mark as Paid
                        </button>
                    ) : (
                        <p>Waiting for gym staff to confirm your payment.</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="mp-page">
            <form action="" className="mp-card">
                <h1 className="mp-heading">Confirm Membership</h1>
                <p className="mp-sub">Review the details and confirm payment status.</p>

                <div className="mp-field">
                    <label className="mp-label" htmlFor="mobNo">Mobile Number</label>
                    <input id="mobNo" className="mp-input" type="tel" value={mobNo} onChange={(e) => setMobNo(e.target.value)} disabled />
                </div>

                <div className="mp-field">
                    <label className="mp-label" htmlFor="planName">Plan Name</label>
                    <select id="planName" className="mp-input" value={planName} onChange={(e) => setPlanName(e.target.value)} disabled>
                        <option value="" >-- Select a plan --</option>
                        {PLAN_OPTIONS.map((plan) => (
                            <option key={plan} value={plan}>{plan}</option>
                        ))}
                    </select>
                </div>

                <div className="mp-field">
                    <label className="mp-label" htmlFor="price">Amount to Pay</label>
                    <input id="price" className="mp-input" value={planPrice ?? ""} disabled />
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="button" className="mp-submit-btn" onClick={handleSubmit}>Submit</button>
            </form>
        </div>
    );
}