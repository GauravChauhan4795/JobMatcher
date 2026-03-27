import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import API, { getApiError } from "../api/Api";

export default function AdminJobs({ navProps }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/admin/jobs")
      .then((res) => setJobs(Array.isArray(res.data) ? res.data : []))
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={S.root}>
      <Navbar {...navProps} activePage="Jobs" />
      <div style={S.page}>
        <div style={S.header}>
          <h1 style={S.heading}>Jobs</h1>
        </div>
        {error && <div style={S.error}>{error}</div>}
        {loading && <div style={S.empty}>Loading jobs...</div>}
        {!loading && jobs.length === 0 && <div style={S.empty}>No jobs found.</div>}

        {jobs.map((job) => (
          <div key={job.id} style={S.card}>
            <div>
              <div style={S.name}>{job.title}</div>
              <div style={S.meta}>{job.company_name}</div>
              {job.recruiter && (
                <div style={S.meta}>Recruiter: {job.recruiter.name} ({job.recruiter.email})</div>
              )}
            </div>
            <div style={S.actions}>
              <div style={S.appCount}>Applicants: {job._count?.applications || 0}</div>
              <div style={S.date}>{new Date(job.created_at).toLocaleDateString()}</div>
            </div>
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
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.18)", borderRadius: "14px", padding: "1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "0.8rem", flexWrap: "wrap" },
  name: { fontWeight: 700, fontSize: "1rem" },
  meta: { fontSize: "0.8rem", color: "#8888aa", marginTop: "0.2rem" },
  actions: { display: "flex", flexDirection: "column", gap: "0.4rem", alignItems: "flex-end" },
  appCount: { fontSize: "0.85rem", color: "#a29bfe", fontWeight: 600 },
  date: { fontSize: "0.8rem", color: "#8888aa" },
  empty: { color: "#8888aa" },
  error: { background: "rgba(253,121,168,0.12)", border: "1px solid rgba(253,121,168,0.35)", color: "#fd79a8", padding: "0.6rem 0.8rem", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "1rem" },
};
