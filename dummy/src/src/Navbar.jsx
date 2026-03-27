// Navbar.jsx — shared nav for SJ_Map
import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Home", "Jobs", "Instant Analysis", "About"];

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
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <nav style={{ ...S.nav, ...(scrolled ? S.navScrolled : {}) }}>
      {/* LOGO */}
      <div style={S.logo} onClick={() => onNavigate("Home")}>
        <span style={{ color: "#a29bfe" }}>SJ</span>
        <span style={{ color: "#00cec9" }}>_</span>
        <span style={{ color: "#e0e0f0" }}>Map</span>
      </div>

      {/* LINKS */}
      <div style={S.links}>
        {NAV_LINKS.map((link) => (
          <button
            key={link}
            onClick={() => onNavigate(link)}
            style={{ ...S.link, ...(activePage === link ? S.linkActive : {}) }}
          >
            {link}
            {activePage === link && <span style={S.dot} />}
          </button>
        ))}
      </div>

      {/* RIGHT */}
      <div style={S.right} ref={dropdownRef}>
        {!isLoggedIn ? (
          <button style={S.loginBtn} onClick={() => onNavigate("Login")}>
            Login
          </button>
        ) : null}

        {/* Profile Circle */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setProfileOpen((p) => !p)}
            style={{
              ...S.circle,
              background: isLoggedIn
                ? "linear-gradient(135deg, #6c5ce7, #00cec9)"
                : "rgba(108,92,231,0.2)",
              border: profileOpen
                ? "2px solid #a29bfe"
                : "2px solid rgba(108,92,231,0.4)",
            }}
            title="Profile"
          >
            {isLoggedIn ? (
              <span style={{ fontWeight: 800, fontSize: "0.8rem", color: "#fff" }}>{initials}</span>
            ) : (
              <span style={{ fontSize: "1rem" }}>👤</span>
            )}
          </button>

          {/* Hover ring */}
          <div style={{
            ...S.ring,
            opacity: profileOpen ? 1 : 0,
            transform: profileOpen ? "scale(1.2)" : "scale(1)",
          }} />

          {profileOpen && (
            <div style={S.dropdown}>
              {isLoggedIn ? (
                <>
                  <div style={S.dropHead}>
                    <div style={S.dropAvatar}>{initials}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{user.name}</div>
                      <div style={{ fontSize: "0.73rem", color: "#8888aa" }}>{user.email}</div>
                    </div>
                  </div>
                  <div style={S.divider} />
                  {[
                    { label: "My Profile", page: "Profile" },
                    { label: "Saved Jobs", page: "Jobs" },
                    { label: "Applications", page: "Jobs" },
                    { label: "Settings", page: "Settings" },
                  ].map((item) => (
                    <button key={item.label} style={S.dropItem}
                      onClick={() => { onNavigate(item.page); setProfileOpen(false); }}>
                      {item.label}
                    </button>
                  ))}
                  <div style={S.divider} />
                  <button style={{ ...S.dropItem, color: "#fd79a8" }}
                    onClick={() => { onLogout(); setProfileOpen(false); }}>
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <div style={{ padding: "0.75rem", fontSize: "0.85rem", color: "#8888aa" }}>
                    Not logged in
                  </div>
                  <div style={S.divider} />
                  <button style={S.dropItem} onClick={() => { onNavigate("Login"); setProfileOpen(false); }}>
                    Login / Sign Up
                  </button>
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
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "1rem 3.5rem",
    borderBottom: "1px solid rgba(108,92,231,0.2)",
    background: "rgba(10,10,20,0.85)",
    backdropFilter: "blur(18px)",
    position: "sticky", top: 0, zIndex: 300,
    transition: "box-shadow 0.3s",
  },
  navScrolled: { boxShadow: "0 4px 40px rgba(108,92,231,0.15)" },
  logo: {
    fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-1px",
    fontFamily: "'DM Mono', monospace", cursor: "pointer",
    userSelect: "none",
  },
  links: { display: "flex", gap: "0.2rem", alignItems: "center" },
  link: {
    background: "none", border: "none", color: "#8888aa",
    fontSize: "0.88rem", fontWeight: 600, cursor: "pointer",
    padding: "0.5rem 1rem", borderRadius: "8px",
    transition: "all 0.2s",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  linkActive: { color: "#e0e0f0", background: "rgba(108,92,231,0.12)" },
  dot: {
    width: "4px", height: "4px", borderRadius: "50%",
    background: "#a29bfe", display: "block",
  },
  right: { display: "flex", alignItems: "center", gap: "0.75rem" },
  loginBtn: {
    background: "rgba(108,92,231,0.15)",
    border: "1px solid rgba(108,92,231,0.35)",
    color: "#a29bfe", padding: "0.5rem 1.2rem", borderRadius: "8px",
    cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  circle: {
    width: "40px", height: "40px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", outline: "none",
    transition: "transform 0.25s, box-shadow 0.25s, border 0.25s",
    position: "relative", zIndex: 1,
  },
  ring: {
    position: "absolute", inset: "-4px",
    borderRadius: "50%",
    border: "2px solid rgba(162,155,254,0.5)",
    transition: "opacity 0.25s, transform 0.25s",
    pointerEvents: "none",
  },
  dropdown: {
    position: "absolute", top: "calc(100% + 12px)", right: 0,
    background: "#13131f",
    border: "1px solid rgba(108,92,231,0.3)",
    borderRadius: "14px", padding: "0.6rem",
    minWidth: "210px", zIndex: 999,
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    animation: "fadeIn 0.15s ease",
  },
  dropHead: { display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0.4rem 0.5rem 0.5rem" },
  dropAvatar: {
    width: "36px", height: "36px", borderRadius: "50%",
    background: "linear-gradient(135deg, #7c6ff7, #00cec9)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: "0.8rem", color: "#fff", flexShrink: 0,
  },
  divider: { height: "1px", background: "rgba(108,92,231,0.2)", margin: "0.4rem 0" },
  dropItem: {
    display: "block", width: "100%", textAlign: "left",
    background: "none", border: "none", color: "#c0c0d8",
    padding: "0.55rem 0.75rem", borderRadius: "8px",
    fontSize: "0.85rem", cursor: "pointer", fontWeight: 500,
    fontFamily: "'Space Grotesk', sans-serif",
    transition: "background 0.15s",
  },
};
