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

  // 🚫 No navbar on dashboards
  if (isDashboard) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // 🔁 Navigation logic
    if (location.pathname === "/register") {
      navigate("/");          // Register → Home
    } else {
      navigate("/register"); // Anywhere else → Register
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md z-50">
      <Link to="/" className="font-bold text-xl">
        Online Bursary System
      </Link>

      {/* LOGIN / REGISTER PAGES → LOGOUT ONLY */}
      {isAuthPage ? (
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      ) : (
        <>
          {/* BEFORE LOGIN */}
          {!token && (
            <div className="space-x-6">
              <Link to="/" className="hover:blue">Home</Link>
              <Link to="/about" className="hover:slate-900">About</Link>
              <Link to="/contact" className="hover:blue">Contact</Link>
              <Link to="/login" className="hover:blue">Login</Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
              >
                Register
              </Link>
            </div>
          )}

          {/* AFTER LOGIN */}
          {token && (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </>
      )}
    </nav>
  );
}
