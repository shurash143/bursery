import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function StudentSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const linkClass = (path) =>
    `block px-4 py-2 rounded-lg ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-blue-100"
    }`;

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen p-4 flex flex-col justify-between">
      {/* TOP */}
      <div>
        <h2 className="text-xl font-bold text-blue-600 mb-6">
          Student Panel
        </h2>

        <nav className="space-y-2">
          <Link to="/student" className={linkClass("/student")}>
            Dashboard
          </Link>

          <Link to="/apply" className={linkClass("/apply")}>
            Apply for Bursary
          </Link>

          <Link
            to="/student/my-applications"
            className={linkClass("/my-applications")}
          >
            My Applications
          </Link>
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="space-y-2">
        {!token && (
          <Link
            to="/login"
            className="block text-center px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Login
          </Link>
        )}

        {token && (
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </aside>
  );
}
