import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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

      // Normalize role
      const role = (user.role || "")
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s/g, "_");

      console.log("ROLE FINAL:", role);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);

      // Redirect by role
      if (role === "student") {
        navigate("/student", { replace: true });
      } else if (role === "admin") {
        navigate("/admin", { replace: true });
      } else if (
        role === "mp" ||
        role === "mca" ||
        role === "women_rep"
      ) {
        navigate("/leader-dashboard", { replace: true });
      } else {
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
        {/* Back to Home */}
        <div className="mb-4">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="text-white" />
          </div>

          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-gray-500 mt-2">
            Sign in to your Online Bursary System account
          </p>
        </div>

        {/* SUCCESS MESSAGE */}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {successMsg}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg flex justify-center items-center gap-2 transition"
          >
            {loading ? "Logging in..." : "Login"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Forgot Password */}
        <p
          onClick={() => navigate("/forgot-password")}
          className="text-blue-600 text-sm mt-4 text-center cursor-pointer hover:underline"
        >
          Forgot Password?
        </p>

        {/* Register Link */}
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}