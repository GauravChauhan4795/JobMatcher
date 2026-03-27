import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import API, { getApiError } from "../api/Api";

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED"];

export default function AdminRecruiters({ navProps }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/admin/recruiters")
      .then((res) => setItems(Array.isArray(res.data) ? res.data : []))
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await API.patch(`/admin/recruiters/${id}/status`, { status });
      setItems((prev) => prev.map((r) => (r.id === id ? { ...r, recruiterStatus: res.data?.recruiterStatus || status } : r)));
    } catch (err) {
      setError(getApiError(err));
    }
  };

  return (
    <div style={S.root}>
      <Navbar {...navProps} activePage="Recruiters" />
      <div style={S.page}>
        <div style={S.header}>
          <h1 style={S.heading}>Recruiters</h1>
        </div>
        {error && <div style={S.error}>{error}</div>}
        {loading && <div style={S.empty}>Loading recruiters...</div>}
        {!loading && items.length === 0 && <div style={S.empty}>No recruiters found.</div>}

        {items.map((r) => (
          <div key={r.id} style={S.card}>
            <div>
              <div style={S.name}>{r.name}</div>
              <div style={S.meta}>{r.email}</div>
              <div style={S.meta}>Status: {r.recruiterStatus}</div>
            </div>
            <div style={S.actions}>
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  style={{ ...S.btnSm, ...(r.recruiterStatus === s ? S.btnActive : {}) }}
                  onClick={() => updateStatus(r.id, s)}
                >
                  {s}
                </button>
              ))}
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
  actions: { display: "flex", gap: "0.4rem", flexWrap: "wrap" },
  btnSm: { background: "rgba(108,92,231,0.15)", border: "1px solid rgba(108,92,231,0.3)", color: "#a29bfe", padding: "0.35rem 0.6rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.7rem" },
  btnActive: { background: "rgba(0,206,201,0.2)", borderColor: "rgba(0,206,201,0.4)", color: "#00cec9" },
  empty: { color: "#8888aa" },
  error: { background: "rgba(253,121,168,0.12)", border: "1px solid rgba(253,121,168,0.35)", color: "#fd79a8", padding: "0.6rem 0.8rem", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "1rem" },
};
