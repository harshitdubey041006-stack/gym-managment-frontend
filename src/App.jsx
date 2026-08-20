import Home from "./components/Home.jsx"
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import FrontPage from "./components/frontPage.jsx";
import Register from "./components/register.jsx";
import Login from "./components/Login.jsx";
import MembershipPlanForm from "./components/Membership_plain.jsx";
import Membership from "./components/membership.jsx";
import Members from "./components/members.jsx";
import AllMembers from "./components/allMembers.jsx";
import { ownerApi, setOwnerAccessToken, memberApi, setMemberAccessToken } from "./api.js";
import {useEffect,useState} from "react"
import { Navigate } from "react-router-dom";
import MemberRegistration from "./components/memberRegistration.jsx";
import MemberLogin from "./components/MemberLogin.jsx";
import MemberFP from "./components/memberFP.jsx";
import MemberStatus from "./components/memberStatus.jsx"

// Nav pages
import About from "./components/About.jsx";
import Plans from "./components/Plans.jsx";
import Contact from "./components/contactUs.jsx";

import PendingPayments from "./components/PendingPayment.jsx";


function App() {
  const [checkingOwnerAuth, setCheckingOwnerAuth] = useState(true);
const [checkingMemberAuth, setCheckingMemberAuth] = useState(true);
  // const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

   useEffect(() => {
  ownerApi.post("/auth/refresh")
    .then(({ data }) => {
      setOwnerAccessToken(data.accessToken);
      setIsLoggedIn(true);
    })
    .catch(() => setIsLoggedIn(false))
    .finally(() => setCheckingOwnerAuth(false));
}, []);

useEffect(() => {
  memberApi.post("/memberRegistration/refresh")
    .then(({ data }) => {
      setMemberAccessToken(data.memberAccessToken);
      setIsUserLoggedIn(true);
    })
    .catch(() => setIsUserLoggedIn(false))
    .finally(() => setCheckingMemberAuth(false));
}, []);

 

  // if (checkingOwnerAuth || checkingMemberAuth) return <div>Loading...</div>;

  return(
    
    <Routes>
        <Route path="/" element={<FrontPage isUserLoggedIn={isUserLoggedIn} isLoggedIn={isLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
        {/* <Route path="/plans" element={<MembershipPlanForm />} /> */}
        <Route path="/plans" element={(isUserLoggedIn || isLoggedIn) ? <MembershipPlanForm isOwner={isLoggedIn} /> : <Navigate to="/memberLogin" />} />
        <Route path="/membership" element={(isUserLoggedIn || isLoggedIn) ? <Membership isOwner={isLoggedIn} /> : <MemberLogin onLogin={() => setIsUserLoggedIn(true)} />} />
        {/* <Route path="/members" element={isUserLoggedIn ? <Members /> : <Navigate to="/memberLogin" />} /> */}
        <Route path="/members" element={(isUserLoggedIn || isLoggedIn) ? <Members isOwner={isLoggedIn} /> : <Navigate to="/memberLogin" />} />
       <Route
          path="/main"
          element={isLoggedIn ? <AllMembers /> : <Navigate to="/login" />}
        />
        <Route path="/memberRegistration" element={<MemberRegistration onLogin={() => setIsUserLoggedIn(true)}/>} />
        <Route path="/memberLogin" element={<MemberLogin onLogin={() => setIsUserLoggedIn(true)} />} />
        <Route path="/memberFP" element={<MemberFP isLogin={isLoggedIn} />} />
        <Route path="/memberStatus" element={isUserLoggedIn? <MemberStatus /> :<Navigate to="/memberLogin" />} />

        <Route path="/about" element={<About />} />
        <Route path="/plansDetail" element={<Plans isUserLoggedIn={isUserLoggedIn} />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/pendingPayments" element={isLoggedIn ? <PendingPayments /> : <Navigate to="/login" />} />
    </Routes>
  )
}
export default App
