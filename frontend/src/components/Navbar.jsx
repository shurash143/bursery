import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const isDashboard =
    location.pathname.startsWith("/student") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/officer");

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  // 🚫 Hide navbar on dashboards, login and register pages
  if (isDashboard || isAuthPage) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md z-50">
      <Link to="/" className="font-bold text-xl">
        Online Bursary System
      </Link>

      {!token ? (
        <div className="space-x-6">
          <Link to="/" className="hover:text-gray-200">
            Home
          </Link>

          <Link to="/about" className="hover:text-gray-200">
            About
          </Link>

          <Link to="/contact" className="hover:text-gray-200">
            Contact
          </Link>

          <Link to="/login" className="hover:text-gray-200">
            Login
          </Link>

          <Link
            to="/register"
            className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
          >
            Register
          </Link>
        </div>
      ) : (
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      )}
    </nav>
  );
}