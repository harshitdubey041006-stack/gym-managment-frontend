import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { memberApi, ownerApi, setMemberAccessToken as setAccessToken } from "../api";
import "../styles/memberForm.css";
import useBlockBackNavigation from "./BlockBackNavigation";

export default function Members({ isOwner }) {
    useBlockBackNavigation('/');
    const api = isOwner ? ownerApi : memberApi; // kept — still used elsewhere/later if needed

    const navigate = useNavigate();
    const [mName, setmName] = useState("");
    const [gender, setGender] = useState("boy");
    const [mobNo, setMobNo] = useState("");
    const [photoFile, setPhotoFile] = useState(null);
    const [status, setStatus] = useState("active");
    const [submitStatus, setSubmitStatus] = useState("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const GENDER = [{ label: "boy", gender: "boy" }, { label: "girl", gender: "girl" }];
    const STATUS = [{ label: "active", status: "active" }, { label: "notActive", status: "Not Active" }];

    const location = useLocation();
    const { userOrMem } = location.state ?? {};
    const { planName, price, durationDays } = location.state ?? {};

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "gym_members_unsigned");

        const res = await axios.post(
            "https://api.cloudinary.com/v1_1/p3cwcqp0/image/upload",
            formData
        );

        return res.data.secure_url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (!mName || !gender || !mobNo || !photoFile || !status) {
            setErrorMsg("Please fill all fields before submitting.");
            return;
        }
        if (!/^\d{10}$/.test(mobNo)) {
            setErrorMsg("Mobile number must be exactly 10 digits.");
            return;
        }

        setSubmitStatus("saving");
        try {
            // Cloudinary upload is fine here — it's a third-party file host,
            // not our DB, so no member/membership row is created by this step.
            const photoUrl = photoFile ? await uploadImage(photoFile) : null;

            // ❌ REMOVED: api.post("/members", payload) — this used to write
            // the member to the DB immediately, before any plan/payment step.
            // That's the exact bug we fixed: pressing back after this point
            // used to leave a permanent unpaid member row in the DB.

            // ✅ Instead, just carry all the collected details forward in
            // React Router state. Nothing touches the backend yet.
            setSubmitStatus("success");
            navigate("/plans", {
                state: {
                    mName,
                    gender,
                    mobNo: Number(mobNo),
                    photoUrl,
                    status,
                    userOrMem,
                    planName,
                    price,
                    durationDays,
                },
            });
        } catch (err) {
            setSubmitStatus("error");
            setErrorMsg("Something went wrong uploading your photo. Please try again.");
        }
    };

    return (
        <div className="member-form-page">
            <div className="member-form-card">
                <div className="member-form-logo">Gym<span>NeX</span></div>
                <h1>Add Member</h1>
                <p className="member-form-subtext">Enter the member's details below</p>

                <form action="" className="member-form">
                    <div className="mf-input-group">
                        <label htmlFor="mName">Member Name</label>
                        <input id="mName" type="text" placeholder="Full name" required onChange={(e) => setmName(e.target.value)} />
                    </div>

                    <div className="mf-input-group">
                        <label htmlFor="gender">Gender</label>
                        <select name="gender" id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                            {GENDER.map((G) => (
                                <option key={G.label} value={G.gender}>{G.gender}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mf-input-group">
                        <label htmlFor="mobNo">Mobile Number</label>
                        <input id="mobNo" type="number" placeholder="10-digit number" required onChange={(e) => setMobNo(e.target.value)} />
                    </div>

                    <div className="mf-input-group">
                        <label htmlFor="status">Status of Member</label>
                        <select name="status" id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                            {STATUS.map((S) => (
                                <option key={S.label} value={S.status}>{S.status}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mf-input-group">
                        <label htmlFor="photo">Photo</label>
                        <input id="photo" className="mf-file-input" type="file" accept="image/*" required onChange={(e) => setPhotoFile(e.target.files[0])} />
                    </div>

                    {errorMsg && <p className="mf-error">{errorMsg}</p>}

                    <button type="button" className="mf-btn" onClick={handleSubmit} disabled={submitStatus === "saving"}>
                        {submitStatus === "saving" ? "Uploading..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    );
}