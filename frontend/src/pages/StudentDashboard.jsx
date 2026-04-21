import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import StudentLayout from "../components/StudentLayout";
import { 
  FileText, Bell, CheckCircle, Clock, 
  ExternalLink, AlertCircle, GraduationCap 
} from "lucide-react";
import API from "../api/axiosConfig";

export default function ProfessionalStudentDashboard() {
  const [apps, setApps] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate(); // 2. Initialize navigate

  const fetchData = async () => {
    try {
      setLoading(true);
      // Note: If /api/notifications still gives a 404, 
      // this try/catch will prevent the whole page from breaking.
      const [appRes, notifRes] = await Promise.allSettled([
        API.get("/applications/my"),
        API.get("/notifications")
      ]);
      
      if (appRes.status === "fulfilled") setApps(appRes.value.data);
      if (notifRes.status === "fulfilled") setNotifications(notifRes.value.data);
      
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto p-4 md:p-8 font-sans">
        {/* Header Section */}
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Portal</h1>
            <p className="text-slate-500 font-medium">Manage your bursary applications and track progress.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl border border-blue-100">
            <GraduationCap size={20} />
            <span className="font-bold text-sm uppercase">Active Academic Year</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content: Applications */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <FileText size={22} className="text-blue-500" />
              My Submissions
            </h2>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2].map(n => <div key={n} className="h-40 bg-slate-100 rounded-3xl" />)}
              </div>
            ) : apps.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-slate-300" size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-700">No applications yet</h3>
                <p className="text-slate-400 mb-6">Start your journey by submitting your first application.</p>
                
                {/* 3. Added navigate to the button click */}
                <button 
                  onClick={() => navigate("/apply")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Apply for Bursary
                </button>
              </div>
            ) : (
              apps.map(app => (
                <ApplicationCard key={app._id} app={app} />
              ))
            )}
          </div>

          {/* Sidebar: Notifications */}
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <Bell size={22} className="text-indigo-500" />
              Live Updates
            </h2>
            
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              {notifications.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-slate-400 text-sm font-medium">All caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {notifications.map(n => (
                    <div key={n._id} className={`p-4 hover:bg-slate-50 transition-colors flex gap-3 ${!n.read ? 'bg-blue-50/30' : ''}`}>
                      <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-slate-200'}`} />
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </StudentLayout>
  );
}

/* --- UI COMPONENTS --- */

const ApplicationCard = ({ app }) => {
  const statusStyles = {
    approved: { color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: <CheckCircle size={16}/> },
    rejected: { color: "text-rose-600 bg-rose-50 border-rose-100", icon: <AlertCircle size={16}/> },
    pending: { color: "text-amber-600 bg-amber-50 border-amber-100", icon: <Clock size={16}/> }
  };

  const style = statusStyles[app.status] || statusStyles.pending;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{app.schoolName}</h3>
          {/* 4. Safe ID Slicing added here to prevent crash */}
          <p className="text-slate-400 text-sm font-medium">Ref: #{String(app._id || "").slice(-6).toUpperCase() || "N/A"}</p>
        </div>
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${style.color}`}>
          {style.icon} {app.status}
        </span>
      </div>

      {app.status === "approved" && app.awardedAmount && (
        <div className="mb-6 p-4 bg-slate-900 text-white rounded-2xl flex justify-between items-center">
          <span className="text-slate-400 text-xs font-bold uppercase">Awarded Amount</span>
          <span className="text-xl font-black text-emerald-400">KES {app.awardedAmount.toLocaleString()}</span>
        </div>
      )}

      {/* Verification Path Diagram */}
      <div className="mb-6">
        <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
            <span>Submission</span>
            <span>Review</span>
            <span>Final</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full flex overflow-hidden">
            <div className="w-1/3 bg-blue-500"></div>
            <div className={`w-1/3 ${app.status !== 'pending' ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
            <div className={`w-1/3 ${app.status === 'approved' ? 'bg-emerald-500' : app.status === 'rejected' ? 'bg-rose-500' : 'bg-slate-200'}`}></div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-50 flex gap-4">
        <DocLink label="ID Copy" url={app.documents?.idCopy} />
        <DocLink label="Admission" url={app.documents?.admissionLetter} />
        <DocLink label="Fees" url={app.documents?.feeStructure} />
      </div>
    </div>
  );
};

const DocLink = ({ label, url }) => {
  if (!url) return null;
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noreferrer"
      className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-blue-600 transition-colors bg-slate-50 px-2 py-1 rounded-md"
    >
      <ExternalLink size={12} /> {label}
    </a>
  );a
};