import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../components/StudentLayout";
import {
  FileText, Bell, CheckCircle, Clock,
  ExternalLink, AlertCircle, GraduationCap
} from "lucide-react";
import API from "../api/axiosConfig";

export default function ProfessionalStudentDashboard() {
  const [apps, setApps] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [bursaries, setBursaries] = useState([]); // ✅ ADDED
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);

      const [appRes, notifRes, bursaryRes] = await Promise.allSettled([
        API.get("/applications/my"),
        API.get("/notifications"),
        API.get("/bursaries") // ✅ IMPORTANT
      ]);

      if (appRes.status === "fulfilled") setApps(appRes.value.data);
      if (notifRes.status === "fulfilled") setNotifications(notifRes.value.data);
      if (bursaryRes.status === "fulfilled") setBursaries(bursaryRes.value.data);

    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-8">

        {/* HEADER */}
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black">Student Portal</h1>
            <p className="text-slate-500">Track applications and bursaries</p>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl">
            <GraduationCap size={20} />
            Active Academic Year
          </div>
        </header>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-10">

            {/* APPLICATIONS */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText /> My Applications
              </h2>

              {loading ? (
                <p>Loading...</p>
              ) : apps.length === 0 ? (
                <div className="border p-6 rounded-xl">
                  <p>No applications yet</p>
                  <button
                    onClick={() => navigate("/apply")}
                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Apply Now
                  </button>
                </div>
              ) : (
                apps.map(app => (
                  <div key={app._id} className="border p-4 rounded-xl mb-3">
                    <h3>{app.schoolName}</h3>
                    <p>Status: {app.status}</p>
                  </div>
                ))
              )}
            </div>

            {/* ⭐ BURSARIES SECTION (THIS IS WHAT YOU WANTED) */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-green-700">
                Available Bursaries
              </h2>

              {bursaries.length === 0 ? (
                <p>No bursaries available</p>
              ) : (
                bursaries.map(b => (
                  <div key={b._id} className="border p-4 rounded-xl mb-3 bg-white">
                    <h3 className="font-bold text-lg">{b.title}</h3>
                    <p className="text-slate-600">{b.description}</p>
                    <p className="font-bold mt-2">KES {b.amount}</p>
                    <p className="text-sm text-slate-400">
                      Deadline: {new Date(b.deadline).toDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div>

            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Bell /> Notifications
            </h2>

            <div className="border rounded-xl p-3">
              {notifications.length === 0 ? (
                <p>No notifications</p>
              ) : (
                notifications.map(n => (
                  <div key={n._id} className="border-b py-2 text-sm">
                    {n.message}
                  </div>
                ))
              )}
            </div>

          </div>

        </div>
      </div>
    </StudentLayout>
  );
}