import React from "react";
import LeaderDashboard from "../components/LeaderDashboard";

export default function LeaderDashboardPage() {
  // Get the current logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page header */}
      <header className="bg-white shadow p-4">
        <h1 className="text-3xl font-bold text-gray-800">Leader Dashboard</h1>
      </header>

      {/* Main content */}
      <main className="p-6">
        <LeaderDashboard user={user} />
      </main>
    </div>
  );
}
