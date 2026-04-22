import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  LayoutDashboard,
  BadgeDollarSign,
  LogOut,
  Loader2,
  ArrowUpRight,
  MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";

import LeadersManager from "./LeadersManager";
import DisbursementsManager from "./DisbursementsManager";
import ContactsManager from "./ContactsManager";

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [leaders, setLeaders] = useState([]);
  const [disbursements, setDisbursements] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [appRes, leaderRes, contactRes] = await Promise.all([
        API.get("/applications/all"),
        API.get("/admin/leader"),
        API.get("/contacts")
      ]);

      setDisbursements(appRes.data || []);
      setLeaders(leaderRes.data || []);
      setContacts(contactRes.data || []);
    } catch (err) {
      console.error("Admin Sync Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = {
    totalApps: disbursements?.length || 0,
    totalDisbursed: (disbursements || [])
      .filter(d => d.status === "approved" || d.status === "disbursed")
      .reduce((acc, curr) => acc + (Number(curr?.financials?.awardedAmount) || 0), 0),
    pending: (disbursements || []).filter(d => d.status === "pending" || !d.status).length,
    leadersCount: leaders?.length || 0,
    inquiryCount: contacts?.length || 0
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#0f172a] text-slate-300 flex flex-col fixed h-full z-20">

        <div className="p-8 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <LayoutDashboard size={20} />
          </div>
          <span className="font-bold text-xl text-white">Admin Hub</span>
        </div>

        <nav className="p-6 space-y-2 flex-1">
          <NavBtn label="Overview" icon={<LayoutDashboard size={18} />} active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
          <NavBtn label="Leaders" icon={<Users size={18} />} active={activeTab === "leaders"} onClick={() => setActiveTab("leaders")} />
          <NavBtn label="Disbursements" icon={<BadgeDollarSign size={18} />} active={activeTab === "disbursements"} onClick={() => setActiveTab("disbursements")} />
          <NavBtn label="Inquiries" icon={<MessageSquare size={18} />} active={activeTab === "contacts"} onClick={() => setActiveTab("contacts")} count={stats.inquiryCount} />
        </nav>

        <div className="p-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-slate-800 hover:bg-rose-500 transition font-bold text-sm text-white"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

      </aside>

      {/* MAIN */}
      <main className="ml-72 flex-1 p-8">

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[85vh] overflow-hidden">

          {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
              <p className="text-slate-400 font-bold">Loading Dashboard...</p>
            </div>
          ) : (
            <>
              {activeTab === "overview" && <OverviewPanel stats={stats} />}
              {activeTab === "leaders" && <LeadersManager leaders={leaders} refreshData={fetchData} />}
              {activeTab === "disbursements" && <DisbursementsManager data={disbursements} refreshData={fetchData} />}
              {activeTab === "contacts" && <ContactsManager messages={contacts} refreshData={fetchData} />}
            </>
          )}

        </div>

      </main>
    </div>
  );
}

/* NAV BUTTON */
const NavBtn = ({ label, icon, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition font-semibold text-sm ${
      active ? "bg-blue-600 text-white" : "hover:bg-slate-800 text-slate-400"
    }`}
  >
    <div className="flex items-center gap-3">
      {icon} {label}
    </div>
    {count > 0 && (
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700">
        {count}
      </span>
    )}
  </button>
);

/* OVERVIEW */
const OverviewPanel = ({ stats }) => (
  <div className="p-10">
    <h2 className="text-3xl font-black mb-8">System Overview</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      <StatCard label="Total Apps" value={stats.totalApps} icon={Users} color="blue" />
      <StatCard label="Disbursed (KES)" value={stats.totalDisbursed.toLocaleString()} icon={BadgeDollarSign} color="emerald" />
      <StatCard label="Leaders" value={stats.leadersCount} icon={ArrowUpRight} color="indigo" />
      <StatCard label="Inquiries" value={stats.inquiryCount} icon={MessageSquare} color="amber" />

    </div>
  </div>
);

/* STAT CARD (IMPROVED) */
const StatCard = ({ label, value, color = "blue", icon: Icon }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs font-bold uppercase text-slate-400">
            {label}
          </p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {value}
          </p>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${colors[color]}`}>
            <Icon size={20} />
          </div>
        )}

      </div>

      <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-blue-500 rounded-full" />
      </div>

    </div>
  );
};