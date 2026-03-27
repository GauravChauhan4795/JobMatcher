import { useState } from "react";
import API from "../api/Api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return alert("Fill all fields");
    }

    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      navigate("/jobs");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-3">
        
        <h2 className="text-xl font-bold">Login</h2>

        <input
          placeholder="Email"
          className="border p-2 rounded"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          onChange={e => setPassword(e.target.value)}
        />

        <button className="bg-black text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}