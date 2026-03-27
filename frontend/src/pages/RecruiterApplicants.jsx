import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import API, { getApiError } from "../api/Api";

const STATUS_OPTIONS = ["PENDING", "REVIEWING", "ACCEPTED", "REJECTED"];

export default function RecruiterApplicants({ navProps, jobId, onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apps, setApps] = useState([]);

  useEffect(() => {
    if (!jobId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    API.get(`/applications/${jobId}/applicants`)
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setApps(list);
        setError("");
      })
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, [jobId]);

  const updateStatus = async (appId, status) => {
    try {
      const res = await API.patch(`/applications/${appId}/status`, { status });
      setApps((prev) => prev.map((a) => (a.id === appId ? { ...a, status: res.data?.status || status } : a)));
    } catch (err) {
      setError(getApiError(err));
    }
  };

  return (
    <div style={S.root}>
      <Navbar {...navProps} activePage="Applicants" />

      <div style={S.page}>
        <div style={S.header}>
          <h1 style={S.heading}>Applicants</h1>
          <button style={S.btnOutline} onClick={() => onNavigate("Dashboard")}>Back to Dashboard</button>
        </div>

        {!jobId && (
          <div style={S.empty}>Select a job to view applicants.</div>
        )}

        {jobId && loading && <div style={S.empty}>Loading applicants...</div>}
        {jobId && error && <div style={S.error}>{error}</div>}

        {jobId && !loading && !error && apps.length === 0 && (
          <div style={S.empty}>No applicants yet.</div>
        )}

        {jobId && apps.map((app) => (
          <div key={app.id} style={S.card}>
            <div style={S.cardLeft}>
              <div style={S.name}>{app.user?.name || "Applicant"}</div>
              <div style={S.meta}>{app.user?.email || ""}</div>
              <div style={S.meta}>Applied {new Date(app.created_at).toLocaleDateString()}</div>
            </div>
            <div style={S.cardRight}>
              <div style={S.status}>Status: {app.status}</div>
              <div style={S.actions}>
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    style={{ ...S.btnSm, ...(app.status === s ? S.btnActive : {}) }}
                    onClick={() => updateStatus(app.id, s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
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
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" },
  heading: { fontSize: "2rem", fontWeight: 800 },
  btnOutline: { background: "transparent", color: "#e0e0f0", padding: "0.6rem 1.2rem", borderRadius: "10px", border: "1px solid rgba(108,92,231,0.3)", cursor: "pointer", fontWeight: 600 },
  empty: { color: "#8888aa", padding: "2rem 0" },
  error: { background: "rgba(253,121,168,0.12)", border: "1px solid rgba(253,121,168,0.35)", color: "#fd79a8", padding: "0.6rem 0.8rem", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "1rem" },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(108,92,231,0.18)", borderRadius: "14px", padding: "1.2rem", display: "flex", justifyContent: "space-between", gap: "1rem", marginBottom: "0.8rem", flexWrap: "wrap" },
  cardLeft: { minWidth: "220px" },
  name: { fontWeight: 700, fontSize: "1rem" },
  meta: { fontSize: "0.8rem", color: "#8888aa", marginTop: "0.2rem" },
  cardRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.6rem" },
  status: { fontSize: "0.85rem", color: "#a29bfe", fontWeight: 600 },
  actions: { display: "flex", gap: "0.4rem", flexWrap: "wrap" },
  btnSm: { background: "rgba(108,92,231,0.15)", border: "1px solid rgba(108,92,231,0.3)", color: "#a29bfe", padding: "0.35rem 0.6rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.7rem" },
  btnActive: { background: "rgba(0,206,201,0.2)", borderColor: "rgba(0,206,201,0.4)", color: "#00cec9" },
};
