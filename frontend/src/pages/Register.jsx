import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import API from "../api/axiosConfig";

export default function ProfessionalRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        role: formData.role.toUpperCase(),
      };

      await API.post("/auth/register", dataToSend);

      navigate("/login", {
        state: {
          message: "Account created successfully! Please login.",
        },
      });
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100">

        {/* Back to Home */}
        <div className="mb-5">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-white" size={24} />
          </div>

          <h2 className="text-3xl font-black text-slate-900">
            Create Account
          </h2>

          <p className="text-slate-500 text-sm">
            Join the Bursary System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="text-xs text-slate-400">
              Full Name
            </label>

            <div className="relative">
              <User
                className="absolute left-3 top-3 text-slate-400"
                size={18}
              />

              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs text-slate-400">
              Email
            </label>

            <div className="relative">
              <Mail
                className="absolute left-3 top-3 text-slate-400"
                size={18}
              />

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-slate-400">
              Password
            </label>

            <div className="relative">
              <Lock
                className="absolute left-3 top-3 text-slate-400"
                size={18}
              />

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-10 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="text-xs text-slate-400">
              Account Type
            </label>

            <div className="relative">
              <UserCheck
                className="absolute left-3 top-3 text-slate-400"
                size={18}
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="STUDENT">Student</option>
                <option value="MP">MP</option>
                <option value="MCA">MCA</option>
                <option value="WOMEN_REP">Women Rep</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-900 text-white p-3 rounded-xl flex justify-center items-center gap-2 transition"
          >
            {loading ? "Creating Account..." : "Create Account"}

            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Login */}
        <p className="text-center mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}