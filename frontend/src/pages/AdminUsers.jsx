import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import API, { getApiError } from "../api/Api";

export default function AdminUsers({ navProps }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/admin/users")
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={S.root}>
      <Navbar {...navProps} activePage="Users" />
      <div style={S.page}>
        <div style={S.header}>
          <h1 style={S.heading}>Users</h1>
        </div>
        {error && <div style={S.error}>{error}</div>}
        {loading && <div style={S.empty}>Loading users...</div>}
        {!loading && users.length === 0 && <div style={S.empty}>No users found.</div>}

        {users.map((u) => (
          <div key={u.id} style={S.card}>
            <div style={S.name}>{u.name}</div>
            <div style={S.meta}>{u.email}</div>
            <div style={S.meta}>Role: {u.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const S = {
  root: { fontFamily: "'Space Grotesk',sans-serif", background: "#0a0a14", color: "#e0e0f0", minHeight: "100vh" },
  page: { maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 2rem" },
  header: { marginBottom: "1.5rem" },
  heading: { fontSize: "2rem", fontWeight: 800 },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.18)", borderRadius: "14px", padding: "1.2rem", marginBottom: "0.8rem" },
  name: { fontWeight: 700, fontSize: "1rem" },
  meta: { fontSize: "0.8rem", color: "#8888aa", marginTop: "0.2rem" },
  empty: { color: "#8888aa" },
  error: { background: "rgba(253,121,168,0.12)", border: "1px solid rgba(253,121,168,0.35)", color: "#fd79a8", padding: "0.6rem 0.8rem", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "1rem" },
};
