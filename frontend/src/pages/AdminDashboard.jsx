import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import API, { getApiError } from "../api/Api";

export default function AdminDashboard({ navProps }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => setError(getApiError(err)));
  }, []);

  return (
    <div style={S.root}>
      <Navbar {...navProps} activePage="Dashboard" />
      <div style={S.page}>
        <div style={S.header}>
          <h1 style={S.heading}>Admin Dashboard</h1>
        </div>
        {error && <div style={S.error}>{error}</div>}
        {!stats && !error && <div style={S.empty}>Loading stats...</div>}
        {stats && (
          <div style={S.grid}>
            {[
              { label: "Total Users", value: stats.totalUsers },
              { label: "Total Jobs", value: stats.totalJobs },
              { label: "Total Applications", value: stats.totalApps },
              { label: "Pending Recruiters", value: stats.pendingRecruiters },
              { label: "Pending Jobs", value: stats.pendingJobs },
              { label: "Active Jobs", value: stats.activeJobs },
            ].map((item) => (
              <div key={item.label} style={S.card}>
                <div style={S.cardLabel}>{item.label}</div>
                <div style={S.cardValue}>{item.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  root: { fontFamily: "'Space Grotesk',sans-serif", background: "#0a0a14", color: "#e0e0f0", minHeight: "100vh" },
  page: { maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 2rem" },
  header: { marginBottom: "1.5rem" },
  heading: { fontSize: "2rem", fontWeight: 800 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.18)", borderRadius: "14px", padding: "1.2rem" },
  cardLabel: { fontSize: "0.8rem", color: "#8888aa" },
  cardValue: { fontSize: "1.8rem", fontWeight: 800, marginTop: "0.4rem", color: "#a29bfe" },
  empty: { color: "#8888aa" },
  error: { background: "rgba(253,121,168,0.12)", border: "1px solid rgba(253,121,168,0.35)", color: "#fd79a8", padding: "0.6rem 0.8rem", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "1rem" },
};
