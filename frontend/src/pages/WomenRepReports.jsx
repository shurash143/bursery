import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  BarChart, FileText, Trash2, Edit, Save, 
  Plus, Search, LogOut, Layout, ClipboardCheck, Loader2, X 
} from "lucide-react";
import API from "../api/axiosConfig";

export default function WomenRepReports() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [leaderProfile, setLeaderProfile] = useState(null);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentReportId, setCurrentReportId] = useState(null);
  const [formData, setFormData] = useState({ title: "", status: "Pending" });

  // 1. Fetch Reports (using your query logic)
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      setLeaderProfile(user);

      const params = new URLSearchParams({
        role: user.role,
        ward: user.ward || "",
        constituency: user.constituency || ""
      });

      const res = await API.get(`/reports?${params.toString()}`);
      setReports(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  // 2. Create or Update Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // UPDATE
        await API.put(`/reports/${currentReportId}`, formData);
      } else {
        // CREATE - Automatically add leader location info to body
        const body = {
          ...formData,
          ward: leaderProfile.ward,
          constituency: leaderProfile.constituency,
          county: leaderProfile.county
        };
        await API.post("/reports", body);
      }
      setIsModalOpen(false);
      setFormData({ title: "", status: "Pending" });
      fetchReports(); // Refresh table
    } catch (err) {
      alert("Operation failed. Check backend console.");
    }
  };

  // 3. Delete Logic
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await API.delete(`/reports/${id}`);
        setReports(reports.filter(r => r._id !== id));
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  // 4. Open Edit Modal
  const openEditModal = (report) => {
    setIsEditing(true);
    setCurrentReportId(report._id);
    setFormData({ title: report.title, status: report.status });
    setIsModalOpen(true);
  };

  // Stats
  const stats = {
    total: reports.length,
    active: reports.filter(r => r.status !== "Completed").length,
    success: reports.filter(r => r.status === "Completed").length,
  };

  return (
    <div className="flex min-h-screen bg-[#fffafa]">
    
      {/* Main Content */}
      <main className="flex-1 ml-64 p-12">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">County Reports</h1>
              <p className="text-slate-500 font-medium">Jurisdiction: {leaderProfile?.county}</p>
            </div>
            <button 
              onClick={() => { setIsEditing(false); setFormData({title:"", status:"Pending"}); setIsModalOpen(true); }}
              className="bg-rose-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-rose-700 shadow-xl shadow-rose-200 transition-all"
            >
              <Plus size={20} /> New Initiative
            </button>
          </header>

          <div className="grid grid-cols-3 gap-8 mb-12">
            <ImpactCard label="Total" value={stats.total} icon={<FileText className="text-rose-500"/>} />
            <ImpactCard label="Ongoing" value={stats.active} icon={<ClipboardCheck className="text-blue-500"/>} />
            <ImpactCard label="Completed" value={stats.success} icon={<BarChart className="text-emerald-500"/>} />
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-10 py-5">Initiative Title</th>
                  <th className="px-10 py-5">Status</th>
                  <th className="px-10 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reports.map((report) => (
                  <tr key={report._id} className="group hover:bg-rose-50/20 transition-all">
                    <td className="px-10 py-6">
                      <div className="font-bold text-slate-800 text-lg">{report.title}</div>
                    </td>
                    <td className="px-10 py-6">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(report)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 rounded-xl">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(report._id)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-red-600 rounded-xl">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {isEditing ? "Update Initiative" : "Add New Initiative"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors"><X/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Initiative Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-rose-500/20 transition-all font-bold"
                  placeholder="e.g. County Health Outreach"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Current Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-rose-500/20 transition-all font-bold"
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all">
                {isEditing ? "Save Changes" : "Confirm & Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components (ImpactCard, StatusBadge) remain same as previous response...
const ImpactCard = ({ label, value, icon }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
    <div className="p-4 bg-slate-50 rounded-2xl">{icon}</div>
    <div>
      <div className="text-4xl font-black text-slate-900 tracking-tighter">{value}</div>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = { Pending: "bg-rose-50 text-rose-600 border-rose-100", "In Progress": "bg-blue-50 text-blue-600 border-blue-100", Completed: "bg-emerald-50 text-emerald-600 border-emerald-100" };
  return <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${styles[status] || styles.Pending}`}>{status}</span>;
};