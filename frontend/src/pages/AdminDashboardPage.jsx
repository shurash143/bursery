import React, { useState, useEffect, useCallback } from "react";
import { Users, LayoutDashboard, BadgeDollarSign, LogOut, Loader2, ArrowUpRight, MessageSquare } from "lucide-react";
import API from "../api/axiosConfig"; 
import LeadersManager from "./LeadersManager";
import DisbursementsManager from "./DisbursementsManager"; 
import ContactsManager from "./ContactsManager"; 

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [leaders, setLeaders] = useState([]);
  const [disbursements, setDisbursements] = useState([]);
  const [contacts, setContacts] = useState([]); 
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [appRes, leaderRes, contactRes] = await Promise.all([
        // FIXED: Changed from "/admin/applications" to "/applications/all"
        // This matches the "getAllApplications" logic in your controller
        API.get("/applications/all"), 
        
        // Ensure this matches your admin router prefix
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

  useEffect(() => { fetchData(); }, [fetchData]);

  const stats = {
    totalApps: disbursements.length,
    totalDisbursed: disbursements
      .filter(d => d.status === "approved" || d.status === "disbursed")
      .reduce((acc, curr) => acc + (Number(curr.financials?.awardedAmount) || 0), 0),
    pending: disbursements.filter(d => d.status === "pending" || !d.status).length,
    leadersCount: leaders.length,
    inquiryCount: contacts.length
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <aside className="w-72 bg-[#0f172a] text-slate-300 flex flex-col fixed h-full z-20">
        <div className="p-8 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white"><LayoutDashboard size={20} /></div>
          <span className="font-bold text-xl text-white tracking-tight">Admin Hub</span>
        </div>
        
        <nav className="p-6 space-y-2 flex-1">
          <NavBtn label="Overview" icon={<LayoutDashboard size={18}/>} active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
          <NavBtn label="Leaders" icon={<Users size={18}/>} active={activeTab === "leaders"} onClick={() => setActiveTab("leaders")} />
          <NavBtn label="Disbursements" icon={<BadgeDollarSign size={18}/>} active={activeTab === "disbursements"} onClick={() => setActiveTab("disbursements")} />
          <NavBtn 
            label="Inquiries" 
            icon={<MessageSquare size={18}/>} 
            active={activeTab === "contacts"} 
            onClick={() => setActiveTab("contacts")} 
            count={stats.inquiryCount}
          />
        </nav>

        <div className="p-8">
          <button 
            onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-slate-800 hover:bg-rose-500 transition-all font-bold text-sm text-white"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="ml-72 flex-1 p-8">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[85vh] overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Updating Dashboard...</p>
            </div>
          ) : (
            <>
              {activeTab === "overview" && <OverviewPanel stats={stats} />}
              {activeTab === "leaders" && <LeadersManager leaders={leaders} refreshData={fetchData} />}
              {/* IMPORTANT: Passing fetchData as refreshData so table updates after changes */}
              {activeTab === "disbursements" && <DisbursementsManager data={disbursements} refreshData={fetchData} />}
              {activeTab === "contacts" && <ContactsManager messages={contacts} refreshData={fetchData} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---
const NavBtn = ({ label, icon, active, onClick, count }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
      active 
      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
      : "hover:bg-slate-800 hover:text-white text-slate-400"
    }`}
  >
    <div className="flex items-center gap-3">
      {icon} {label}
    </div>
    {count > 0 && (
      <span className={`text-[10px] px-2 py-0.5 rounded-full ${active ? 'bg-blue-400' : 'bg-slate-700'}`}>
        {count}
      </span>
    )}
  </button>
);

const OverviewPanel = ({ stats }) => (
  <div className="p-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div className="mb-10">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h2>
      <p className="text-slate-500 font-medium">Real-time status of the bursary management system.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Total Apps" value={stats.totalApps} color="blue" />
      <StatCard label="Disbursed (KES)" value={stats.totalDisbursed.toLocaleString()} color="emerald" />
      <StatCard label="Active Leaders" value={stats.leadersCount} color="indigo" />
      <StatCard label="Inquiries" value={stats.inquiryCount} color="amber" />
    </div>
  </div>
);

const StatCard = ({ label, value, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100"
  };

  return (
    <div className={`p-6 rounded-[2rem] border ${colors[color]} transition-transform hover:scale-[1.02]`}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-black uppercase tracking-[0.15em] opacity-80">{label}</p>
        <ArrowUpRight size={14} className="opacity-50" />
      </div>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
};