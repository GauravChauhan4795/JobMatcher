import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex justify-between p-4 bg-white shadow">
      <h1 className="font-bold text-xl">JobMatcher</h1>

      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}