import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import API from "../api/axiosConfig";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const successMsg = location.state?.message;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", formData);

      const user = res.data?.user;
      const token = res.data?.token;

      if (!user) {
        setError("Login failed: user not returned");
        return;
      }

      // 🔥 FINAL FIX: normalize EVERYTHING
      const role = (user.role || "")
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s/g, "_");

      console.log("ROLE FINAL:", role);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);

      // 🔥 ROUTING (CLEAN + SAFE)
      if (role === "student") {
        navigate("/student", { replace: true });
      } 
      else if (role === "admin") {
        navigate("/admin", { replace: true });
      } 
      else if (
        role === "mp" ||
        role === "mca" ||
        role === "women_rep"
      ) {
        navigate("/leader-dashboard", { replace: true });
      } 
      else {
        setError("Unknown role: " + role);
      }

    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="text-white" />
          </div>
          <h2 className="text-2xl font-bold">Welcome Back</h2>
        </div>

        {/* SUCCESS */}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {successMsg}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex gap-2 items-center">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded flex justify-center items-center gap-2"
          >
            {loading ? "Logging in..." : "Login"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* FORGOT PASSWORD */}
        <p
          onClick={() => navigate("/forgot-password")}
          className="text-blue-600 text-sm mt-4 text-center cursor-pointer"
        >
          Forgot Password?
        </p>

      </div>
    </div>
  );
}