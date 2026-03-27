import { useEffect, useState } from "react";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Jobs from "../pages/Jobs";
import About from "../pages/About";

import SeekerDashboard from "../pages/SeekerDashboard";
import SeekerProfile from "../pages/SeekerProfile";
import SeekerApplications from "../pages/SeekerApplications";
import ResumeAnalysis from "../pages/ResumeAnalysis";

import RecruiterDashboard from "../pages/RecruiterDashboard";
import RecruiterProfile from "../pages/RecruiterProfile";
import RecruiterJobForm from "../pages/RecruiterJobForm";
import RecruiterApplicants from "../pages/RecruiterApplicants";

import AdminDashboard from "../pages/AdminDashboard";
import AdminRecruiters from "../pages/AdminRecruiters";
import AdminJobs from "../pages/AdminJobs";
import AdminUsers from "../pages/AdminUsers";

const isValidRole = (role) => ["JOB_SEEKER", "RECRUITER", "ADMIN"].includes(role);

const toDisplayRole = (role) => {
  if (role === "JOB_SEEKER") return "Job Seeker";
  if (role === "RECRUITER") return "Recruiter";
  if (role === "ADMIN") return "Admin";
  return role || "";
};

const normalizeUser = (user) => {
  if (!user) return null;
  if (!isValidRole(user.role)) return null;
  return { ...user, roleDisplay: toDisplayRole(user.role) };
};

const loadStoredUser = () => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try { return normalizeUser(JSON.parse(raw)); } catch { return null; }
};

export default function App() {
  const initialUser = loadStoredUser();
  const hasToken = Boolean(localStorage.getItem("token"));

  const [user, setUser] = useState(() => initialUser);
  const [isLoggedIn, setIsLoggedIn] = useState(() => hasToken && Boolean(initialUser));
  const [page, setPage] = useState(() => (hasToken && initialUser) ? "Dashboard" : "Home");
  const [jobIdContext, setJobIdContext] = useState(null);

  const role = user?.role;

  useEffect(() => {
    if (isLoggedIn && user) localStorage.setItem("user", JSON.stringify(user));
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (!user && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setPage("Home");
    }

    if (user && !isValidRole(user.role)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsLoggedIn(false);
      setPage("Home");
    }
  }, [user]);

  const handleLogin = (userData, token) => {
    if (token) localStorage.setItem("token", token);
    const normalized = normalizeUser(userData);
    setUser(normalized);
    setIsLoggedIn(true);
    setPage("Dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setPage("Home");
  };

  const navigate = (target, ctx) => {
    if (ctx?.jobId) setJobIdContext(ctx.jobId);
    setPage(target);
  };

  const navProps = { activePage: page, onNavigate: navigate, isLoggedIn, user, onLogout: handleLogout };

  if (isLoggedIn && role === "JOB_SEEKER") {
    if (page === "Dashboard") return <SeekerDashboard navProps={navProps} user={user} onNavigate={navigate} />;
    if (page === "Applications") return <SeekerApplications navProps={navProps} user={user} onNavigate={navigate} />;
    if (page === "Profile") return <SeekerProfile navProps={navProps} user={user} onNavigate={navigate} onUserUpdate={u => setUser(p => ({ ...p, ...u }))} />;
    if (page === "Resume Analysis") return <ResumeAnalysis navProps={navProps} isLoggedIn={isLoggedIn} onNavigate={navigate} />;
  }

  if (isLoggedIn && role === "RECRUITER") {
    if (page === "Dashboard") return <RecruiterDashboard navProps={navProps} user={user} onNavigate={navigate} />;
    if (page === "Post Job") return <RecruiterJobForm navProps={navProps} user={user} onNavigate={navigate} />;
    if (page === "Profile") return <RecruiterProfile navProps={navProps} user={user} onNavigate={navigate} />;
    if (page === "Applicants") return <RecruiterApplicants navProps={navProps} user={user} onNavigate={navigate} jobId={jobIdContext} />;
  }

  if (isLoggedIn && role === "ADMIN") {
    if (page === "Dashboard") return <AdminDashboard navProps={navProps} user={user} onNavigate={navigate} />;
    if (page === "Recruiters") return <AdminRecruiters navProps={navProps} user={user} onNavigate={navigate} />;
    if (page === "Jobs") return <AdminJobs navProps={navProps} user={user} onNavigate={navigate} />;
    if (page === "Users") return <AdminUsers navProps={navProps} user={user} onNavigate={navigate} />;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#0a0a14; font-family:'Space Grotesk',sans-serif; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        button { font-family:'Space Grotesk',sans-serif; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#0a0a14; }
        ::-webkit-scrollbar-thumb { background:#3a3a5c; border-radius:99px; }
      `}</style>

      {page === "Home" && <Home navProps={navProps} onNavigate={navigate} />}
      {page === "Login" && <Login navProps={navProps} onLogin={handleLogin} onNavigate={navigate} />}
      {page === "Jobs" && <Jobs navProps={navProps} isLoggedIn={isLoggedIn} onNavigate={navigate} user={user} />}
      {page === "About" && <About navProps={navProps} onNavigate={navigate} />}
      {page === "Dashboard" && !isLoggedIn && <Login navProps={navProps} onLogin={handleLogin} onNavigate={navigate} />}
      {page === "Resume Analysis" && !isLoggedIn && <Login navProps={navProps} onLogin={handleLogin} onNavigate={navigate} />}
      {!isLoggedIn && page !== "Home" && page !== "Login" && page !== "Jobs" && page !== "About" && (
        <Home navProps={navProps} onNavigate={navigate} />
      )}
    </>
  );
}
