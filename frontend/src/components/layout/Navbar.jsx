import { useState, useEffect, useRef } from "react";

const NAV_BY_ROLE = {
  JOB_SEEKER: ["Dashboard", "Jobs", "Applications", "Resume Analysis", "About"],
  RECRUITER:  ["Dashboard", "Jobs", "Post Job", "About"],
  ADMIN:      ["Dashboard", "Recruiters", "Jobs", "Users"],
  public:     ["Home", "Jobs", "About"],
};

export default function Navbar({ activePage, onNavigate, isLoggedIn, user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const role = user?.role;
  const links = isLoggedIn ? (NAV_BY_ROLE[role] || NAV_BY_ROLE.public) : NAV_BY_ROLE.public;

  const displayName = user?.name || user?.email || "User";
  const initials = displayName.split(/[\s@]+/).filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const roleColor = { JOB_SEEKER: "#00cec9", RECRUITER: "#a29bfe", ADMIN: "#fd79a8" };
  const roleBg = { JOB_SEEKER: "rgba(0,206,201,0.15)", RECRUITER: "rgba(162,155,254,0.15)", ADMIN: "rgba(253,121,168,0.15)" };

  return (
    <nav style={{ ...S.nav, ...(scrolled ? S.navScrolled : {}) }}>
      <div style={S.logo} onClick={() => onNavigate(isLoggedIn ? "Dashboard" : "Home")}>
        <span style={{ color: "#a29bfe" }}>SJ</span>
        <span style={{ color: "#00cec9" }}>_</span>
        <span style={{ color: "#e0e0f0" }}>Map</span>
      </div>

      <div style={S.links}>
        {links.map(link => (
          <button key={link} onClick={() => onNavigate(link)}
            style={{ ...S.link, ...(activePage === link ? S.linkActive : {}) }}>
            {link}
            {activePage === link && <span style={S.dot} />}
          </button>
        ))}
      </div>

      <div style={S.right} ref={dropdownRef}>
        {isLoggedIn && role && (
          <div style={{ ...S.rolePill, background: roleBg[role], color: roleColor[role], border: `1px solid ${roleColor[role]}33` }}>
            {user?.roleDisplay || role.replace("_", " ")}
          </div>
        )}

        {!isLoggedIn && (
          <button style={S.loginBtn} onClick={() => onNavigate("Login")}>Login</button>
        )}

        <div style={{ position: "relative" }}>
          <button onClick={() => setProfileOpen(p => !p)}
            style={{ ...S.circle, background: isLoggedIn ? `linear-gradient(135deg,${roleColor[role] || "#6c5ce7"},#00cec9)` : "rgba(108,92,231,0.2)", border: profileOpen ? "2px solid #a29bfe" : "2px solid rgba(108,92,231,0.4)" }}>
            {isLoggedIn ? <span style={{ fontWeight: 800, fontSize: "0.8rem", color: "#fff" }}>{initials}</span>
              : <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#a29bfe" }}>U</span>}
          </button>
          <div style={{ ...S.ring, opacity: profileOpen ? 1 : 0, transform: profileOpen ? "scale(1.2)" : "scale(1)" }} />

          {profileOpen && (
            <div style={S.dropdown}>
              {isLoggedIn ? (
                <>
                  <div style={S.dropHead}>
                    <div style={{ ...S.dropAvatar, background: `linear-gradient(135deg,${roleColor[role] || "#7c6ff7"},#00cec9)` }}>{initials}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{user?.name || "User"}</div>
                      <div style={{ fontSize: "0.73rem", color: "#8888aa" }}>{user?.email || ""}</div>
                      <div style={{ fontSize: "0.68rem", color: roleColor[role], fontWeight: 600, marginTop: "2px" }}>{user?.roleDisplay || role}</div>
                    </div>
                  </div>
                  <div style={S.divider} />
                  {role === "JOB_SEEKER" && [
                    { label: "My Profile", page: "Profile" },
                    { label: "My Applications", page: "Applications" },
                    { label: "Browse Jobs", page: "Jobs" },
                  ].map(item => (
                    <button key={item.label} style={S.dropItem} onClick={() => { onNavigate(item.page); setProfileOpen(false); }}>{item.label}</button>
                  ))}
                  {role === "RECRUITER" && [
                    { label: "My Profile", page: "Profile" },
                    { label: "Dashboard", page: "Dashboard" },
                    { label: "Post a Job", page: "Post Job" },
                  ].map(item => (
                    <button key={item.label} style={S.dropItem} onClick={() => { onNavigate(item.page); setProfileOpen(false); }}>{item.label}</button>
                  ))}
                  {role === "ADMIN" && [
                    { label: "Dashboard", page: "Dashboard" },
                    { label: "Manage Recruiters", page: "Recruiters" },
                    { label: "Manage Jobs", page: "Jobs" },
                  ].map(item => (
                    <button key={item.label} style={S.dropItem} onClick={() => { onNavigate(item.page); setProfileOpen(false); }}>{item.label}</button>
                  ))}
                  <div style={S.divider} />
                  <button style={{ ...S.dropItem, color: "#fd79a8" }} onClick={() => { onLogout(); setProfileOpen(false); }}>Sign Out</button>
                </>
              ) : (
                <>
                  <div style={{ padding: "0.75rem", fontSize: "0.85rem", color: "#8888aa" }}>Not logged in</div>
                  <div style={S.divider} />
                  <button style={S.dropItem} onClick={() => { onNavigate("Login"); setProfileOpen(false); }}>Login / Sign Up</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const S = {
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 3.5rem", borderBottom: "1px solid rgba(108,92,231,0.2)", background: "rgba(10,10,20,0.9)", backdropFilter: "blur(18px)", position: "sticky", top: 0, zIndex: 300, transition: "box-shadow 0.3s" },
  navScrolled: { boxShadow: "0 4px 40px rgba(108,92,231,0.15)" },
  logo: { fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-1px", fontFamily: "'DM Mono',monospace", cursor: "pointer", userSelect: "none" },
  links: { display: "flex", gap: "0.2rem", alignItems: "center", flexWrap: "wrap" },
  link: { background: "none", border: "none", color: "#8888aa", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", padding: "0.45rem 0.9rem", borderRadius: "8px", transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", fontFamily: "'Space Grotesk',sans-serif" },
  linkActive: { color: "#e0e0f0", background: "rgba(108,92,231,0.12)" },
  dot: { width: "4px", height: "4px", borderRadius: "50%", background: "#a29bfe", display: "block" },
  right: { display: "flex", alignItems: "center", gap: "0.75rem" },
  rolePill: { padding: "0.25rem 0.75rem", borderRadius: "99px", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.3px" },
  loginBtn: { background: "rgba(108,92,231,0.15)", border: "1px solid rgba(108,92,231,0.35)", color: "#a29bfe", padding: "0.5rem 1.2rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", fontFamily: "'Space Grotesk',sans-serif" },
  circle: { width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", outline: "none", transition: "transform 0.25s, border 0.25s", position: "relative", zIndex: 1 },
  ring: { position: "absolute", inset: "-4px", borderRadius: "50%", border: "2px solid rgba(162,155,254,0.5)", transition: "opacity 0.25s, transform 0.25s", pointerEvents: "none" },
  dropdown: { position: "absolute", top: "calc(100% + 12px)", right: 0, background: "#13131f", border: "1px solid rgba(108,92,231,0.3)", borderRadius: "14px", padding: "0.6rem", minWidth: "220px", zIndex: 999, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", animation: "fadeIn 0.15s ease" },
  dropHead: { display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0.5rem" },
  dropAvatar: { width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", color: "#fff", flexShrink: 0 },
  divider: { height: "1px", background: "rgba(108,92,231,0.2)", margin: "0.4rem 0" },
  dropItem: { display: "block", width: "100%", textAlign: "left", background: "none", border: "none", color: "#c0c0d8", padding: "0.55rem 0.75rem", borderRadius: "8px", fontSize: "0.85rem", cursor: "pointer", fontWeight: 500, fontFamily: "'Space Grotesk',sans-serif", transition: "background 0.15s" },
};