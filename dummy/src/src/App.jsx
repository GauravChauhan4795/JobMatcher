// App.jsx — root router for SJ_Map
import { useState } from "react";
import HomePage from "./HomePage";
import HomeLoggedIn from "./HomeLoggedIn";
import LoginPage from "./LoginPage";
import JobsPage from "./JobsPage";
import InstantAnalysisPage from "./InstantAnalysisPage";
import AboutPage from "./AboutPage";
import ProfilePage from "./ProfilePage";

const DEMO_USER = {
  name: "Arjun Kumar",
  email: "arjun.kumar@email.com",
  role: "Full Stack Developer",
  location: "Delhi, India",
  skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
  matchScore: 94,
  applications: 12,
  savedJobs: 7,
  profileStrength: 88,
};

export default function App() {
  const [page, setPage] = useState("Home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData || DEMO_USER);
    setIsLoggedIn(true);
    setPage("HomeLoggedIn");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
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

      {page === "Home" && <HomePage navProps={navProps} onLogin={handleLogin} />}
      {page === "HomeLoggedIn" && <HomeLoggedIn navProps={navProps} user={user} onNavigate={navigate} />}
      {page === "Login" && <LoginPage navProps={navProps} onLogin={handleLogin} onNavigate={navigate} />}
      {page === "Jobs" && <JobsPage navProps={navProps} isLoggedIn={isLoggedIn} onNavigate={navigate} />}
      {page === "Instant Analysis" && <InstantAnalysisPage navProps={navProps} isLoggedIn={isLoggedIn} onNavigate={navigate} />}
      {page === "About" && <AboutPage navProps={navProps} onNavigate={navigate} />}
      {page === "Profile" && isLoggedIn && <ProfilePage navProps={navProps} user={user} onNavigate={navigate} />}
      {page === "Profile" && !isLoggedIn && <LoginPage navProps={navProps} onLogin={handleLogin} onNavigate={navigate} />}
    </>
  );
}
