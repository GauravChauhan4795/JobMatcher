// App.jsx - root router for SJ_Map
import { useEffect, useState } from "react";
import Home from "../pages/Home";
import HomeLoggedIn from "../pages/HomeLoggedIn";
import Login from "../pages/Login";
import Jobs from "../pages/Jobs";
import InstantAnalysis from "../pages/InstantAnalysis";
import About from "../pages/About";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import RecruiterDashboard from "../pages/RecruiterDashboard";
import RecruiterProfile from "../pages/RecruiterProfile";
import API from "../api/Api";

const toDisplayRole = (role) => {
  if (role === "JOB_SEEKER") return "Job Seeker";
  if (role === "RECRUITER") return "Recruiter";
  return role || "";
};

const normalizeUser = (user) => {
  if (!user) return null;
  const safe = { ...user };
  if (safe.role) safe.role = toDisplayRole(safe.role);
  return safe;
};

const loadStoredUser = () => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return normalizeUser(JSON.parse(raw));
  } catch {
    return null;
  }
};

export default function App() {
  const [page, setPage] = useState(() => (localStorage.getItem("token") ? "Dashboard" : "Home"));
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem("token")));
  const [user, setUser] = useState(() => loadStoredUser());
  const isRecruiter = user?.role?.toLowerCase() === "recruiter";

  useEffect(() => {
    if (isLoggedIn && user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (!isLoggedIn || !user) return;
    API.get("/applications/me")
      .then((res) => {
        const count = Array.isArray(res.data) ? res.data.length : 0;
        setUser((prev) => (prev ? { ...prev, applications: count } : prev));
      })
      .catch(() => {});
  }, [isLoggedIn, user]);

  const handleLogin = (userData, token) => {
    if (token) localStorage.setItem("token", token);
    if (userData?.email) localStorage.setItem("lastEmail", userData.email);
    setUser(normalizeUser(userData));
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

  const navigate = (target) => setPage(target);

  const navProps = { activePage: page, onNavigate: navigate, isLoggedIn, user, onLogout: handleLogout };

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
        @keyframes shimmer { 0%{opacity:0.4} 50%{opacity:1} 100%{opacity:0.4} }
        button { font-family:'Space Grotesk',sans-serif; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#0a0a14; }
        ::-webkit-scrollbar-thumb { background:#3a3a5c; border-radius:99px; }
      `}</style>

      {page === "Home" && !isLoggedIn && <Home navProps={navProps} />}
      {page === "Home" && isLoggedIn && user && (
        <HomeLoggedIn navProps={navProps} user={user} onNavigate={navigate} />
      )}
      {page === "Home" && isLoggedIn && !user && (
        <Home navProps={navProps} />
      )}
      {page === "Login" && (
        <Login navProps={navProps} onLogin={handleLogin} onNavigate={navigate} />
      )}
      {page === "Jobs" && (
        <Jobs navProps={navProps} isLoggedIn={isLoggedIn} onNavigate={navigate} />
      )}
      {page === "Resume Analysis" && (
        <InstantAnalysis
          navProps={navProps}
          isLoggedIn={isLoggedIn}
          onNavigate={navigate}
          onUserUpdate={(partial) =>
            setUser((prev) => (prev ? { ...prev, ...partial } : prev))
          }
        />
      )}
      {page === "About" && <About navProps={navProps} onNavigate={navigate} />}

      {page === "Dashboard" && !isLoggedIn && (
        <Login navProps={navProps} onLogin={handleLogin} onNavigate={navigate} />
      )}
      {page === "Dashboard" && isLoggedIn && (
        isRecruiter ? (
          <RecruiterDashboard navProps={navProps} user={user} onNavigate={navigate} />
        ) : (
          <Dashboard navProps={navProps} user={user} onNavigate={navigate} />
        )
      )}

      {page === "Profile" && !isLoggedIn && (
        <Login navProps={navProps} onLogin={handleLogin} onNavigate={navigate} />
      )}
      {page === "Profile" && isLoggedIn && user && (
        isRecruiter ? (
          <RecruiterProfile navProps={navProps} user={user} onNavigate={navigate} />
        ) : (
          <Profile navProps={navProps} user={user} onNavigate={navigate} />
        )
      )}
    </>
  );
}









