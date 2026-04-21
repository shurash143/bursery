import React from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";

export default function LeaderLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // 🔥 Detect if we are in reports
  const isReportsPage = location.pathname.includes("reports");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 fixed h-full flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8">
            {isReportsPage ? `${user.role} Reports` : `${user.role} Dashboard`}
          </h2>

          {/* 🔥 CONDITIONAL SIDEBAR */}
          {!isReportsPage ? (
            /* DASHBOARD SIDEBAR */
            <nav className="flex flex-col gap-3">
              <NavLink to="/leader-dashboard" end className="p-2 rounded hover:bg-gray-700">
                Dashboard
              </NavLink>

              <NavLink to="/leader-dashboard/applications" className="p-2 rounded hover:bg-gray-700">
                My Applications
              </NavLink>

              {user.role === "MP" && (
                <NavLink to="/leader-dashboard/mp-reports" className="p-2 rounded hover:bg-gray-700">
                  MP Reports
                </NavLink>
              )}

              {user.role === "MCA" && (
                <NavLink to="/leader-dashboard/mca-reports" className="p-2 rounded hover:bg-gray-700">
                  MCA Reports
                </NavLink>
              )}

              {user.role === "WOMEN_REP" && (
                <NavLink to="/leader-dashboard/women-rep-reports" className="p-2 rounded hover:bg-gray-700">
                  Women Rep Reports
                </NavLink>
              )}
            </nav>
          ) : (
            /* REPORTS SIDEBAR */
            <nav className="flex flex-col gap-3">
              <NavLink to="/leader-dashboard/mp-reports" className="p-2 rounded hover:bg-gray-700">
                MP Reports
              </NavLink>

              <NavLink to="/leader-dashboard/mca-reports" className="p-2 rounded hover:bg-gray-700">
                MCA Reports
              </NavLink>


              <NavLink
                to="/leader-dashboard"
                className="mt-6 p-2 rounded bg-gray-700 hover:bg-gray-600"
              >
                ← Back to Dashboard
              </NavLink>
            </nav>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 p-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 ml-64 p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
