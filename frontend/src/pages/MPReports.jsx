import React, { useState, useEffect, useCallback } from "react";
import { 
  FileStack, Edit3, Trash2, Save, X, 
  BarChart3, Plus, Search, Loader2, AlertCircle, CheckCircle2 
} from "lucide-react";
import API from "../api/axiosConfig";

export default function MPReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ title: "", status: "Pending" });

  /**
   * ✅ HIGH-COMPATIBILITY FETCH
   * Standardizes the constituency search to work with messy Atlas data.
   */
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);

      // Check both possible locations for constituency data
      const constituencyName = storedUser?.constituency || storedUser?.location?.constituency;

      const res = await API.get("/reports", {
        params: {
          role: "MP", 
          constituency: constituencyName
        }
      }); 
      setReports(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...formData, 
        constituency: user?.constituency || user?.location?.constituency,
        role: "MP" 
      };

      if (isEditing) {
        await API.put(`/reports/${currentId}`, payload);
      } else {
        await API.post("/reports", payload);
      }
      
      setIsModalOpen(false);
      setFormData({ title: "", status: "Pending" });
      fetchReports();
    } catch (err) {
      alert("Error processing report.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record permanently?")) {
      try {
        await API.delete(`/reports/${id}`);
        setReports(prev => prev.filter(r => r._id !== id));
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  const openEditModal = (report) => {
    setIsEditing(true);
    setCurrentId(report._id);
    setFormData({ title: report.title, status: report.status });
    setIsModalOpen(true);
  };

  const stats = {
    total: reports.length,
    completed: reports.filter(r => r.status === "Completed").length,
    pending: reports.filter(r => r.status !== "Completed").length
  };

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">
              MP Registry
            </h1>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">
              Office: <span className="text-emerald-600">{user?.constituency || "National Registry"}</span>
            </p>
          </div>
          <button 
            onClick={() => { setIsEditing(false); setFormData({title: "", status: "Pending"}); setIsModalOpen(true); }}
            className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-xl hover:-translate-y-1"
          >
            <Plus size={18} /> New Report
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Submissions" value={stats.total} icon={<FileStack size={20} className="text-blue-500"/>} />
          <StatCard label="Fully Executed" value={stats.completed} icon={<CheckCircle2 size={20} className="text-emerald-500"/>} />
          <StatCard label="Ongoing" value={stats.pending} icon={<BarChart3 size={20} className="text-amber-500"/>} />
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
            <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Activity Log</h3>
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-12 pr-6 py-3 w-64 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="p-24 text-center">
              <Loader2 className="animate-spin mx-auto text-emerald-500 mb-4" size={40} />
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Fetching regional data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                    <th className="px-10 py-5">Ref Code</th>
                    <th className="px-10 py-5">Initiative</th>
                    <th className="px-10 py-5">Status</th>
                    <th className="px-10 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredReports.map((report) => (
                    <tr key={report._id} className="hover:bg-emerald-50/20 transition-all group">
                      <td className="px-10 py-6 text-[10px] font-bold text-slate-300">
                        #{report._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-10 py-6">
                        <div className="font-black text-slate-800 text-lg tracking-tight uppercase italic">
                          {report.title}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                          Location: {report.constituency}
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <StatusBadge status={report.status} />
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => openEditModal(report)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 rounded-xl transition-all">
                            <Edit3 size={18} />
                          </button>
                          <button onClick={() => handleDelete(report._id)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-red-500 rounded-xl transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {!loading && filteredReports.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                <AlertCircle size={24} className="text-slate-200" />
              </div>
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest italic">No matching reports found.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-900 uppercase">
                {isEditing ? "Update Report" : "New Entry"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-emerald-500/50 font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none font-black text-xs uppercase"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 transition-all shadow-xl">
                {isEditing ? "Update Registry" : "Save Entry"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- UI COMPONENTS --- */

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
    <div className="p-4 bg-slate-50 rounded-2xl">{icon}</div>
    <div>
      <div className="text-2xl font-black text-slate-900 tracking-tighter">{value}</div>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    "In Progress": "bg-blue-50 text-blue-600 border-blue-100",
    Completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  return (
    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black border uppercase tracking-widest ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};