import { useEffect, useState } from "react";
import API from "../api/Api";

export default function Dashboard() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    API.get("/applications/me").then((res) => setApps(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">My Applications</h1>

      {apps.map((a) => (
        <div key={a.id} className="p-3 border mb-2">
          {a.job.title}
        </div>
      ))}
    </div>
  );
}