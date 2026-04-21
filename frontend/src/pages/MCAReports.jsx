import React, { useState, useEffect, useCallback } from "react";
import { 
  Edit3, Trash2, Save, Plus, AlertCircle, CheckCircle2, Clock, X, Loader2 
} from "lucide-react";
import API from "../api/axiosConfig";

export default function MCAReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [user, setUser] = useState(null);
  
  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReport, setNewReport] = useState({ title: "", status: "Pending" });
  
  // Edit State
  const [editForm, setEditForm] = useState({ title: "", status: "" });

  // 1. Fetch Reports (using ward-specific filtering)
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);

      // Matches your backend logic: if (role === 'MCA') filter = { ward }
      const res = await API.get("/reports", {
        params: {
          role: storedUser.role,
          ward: storedUser.ward, // Adjusting based on common schema structure
          constituency: storedUser.constituency
        }
      }); 
      setReports(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  // 2. Handle Create
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newReport,
        ward: user?.ward,
        constituency: user?.constituency,
        role: "MCA"
      };

      const res = await API.post("/reports", payload);
      setReports([res.data, ...reports]);
      setIsModalOpen(false);
      setNewReport({ title: "", status: "Pending" });
    } catch (err) {
      alert("Failed to create entry.");
    }
  };

  // 3. Handle Update
  const handleUpdate = async (id) => {
    try {
      await API.put(`/reports/${id}`, editForm);
      setReports(prev => prev.map(r => r._id === id ? { ...r, ...editForm } : r));
      setEditingId(null);
    } catch (err) {
      alert("Update failed.");
    }
  };

  // 4. Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Permanent Action: Delete this log?")) {
      try {
        await API.delete(`/reports/${id}`);
        setReports(prev => prev.filter(r => r._id !== id));
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  const startEditing = (report) => {
    setEditingId(report._id);
    setEditForm({ title: report.title, status: report.status });
  };

  return (
    <div className="p-4 md:p-8 bg-[#fdfdfd] min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">
            Ward Activity Logs
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
            Jurisdiction: <span className="text-blue-600">{user?.ward || "Regional Ward"}</span>
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1"
        >
          <Plus size={18} /> New Entry
        </button>
      </header>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black text-slate-900 uppercase">New Activity</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Title</label>
                <input required className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-blue-500 font-bold"
                  value={newReport.title} onChange={(e) => setNewReport({...newReport, title: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Status</label>
                <select className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-black text-xs uppercase cursor-pointer"
                  value={newReport.status} onChange={(e) => setNewReport({...newReport, status: e.target.value})}>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 shadow-lg">
                Save Activity
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TABLE AREA */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-32 text-center">
            <Loader2 className="animate-spin mx-auto text-blue-500 mb-4" size={40} />
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Syncing Ward Records...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-10 py-6 text-center">Icon</th>
                <th className="px-10 py-6">Activity Details</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reports.map((report) => (
                <tr key={report._id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-10 py-6 text-center">
                     <StatusIcon status={report.status} />
                  </td>
                  <td className="px-10 py-6">
                    {editingId === report._id ? (
                      <input className="w-full border-2 border-blue-100 p-2 rounded-xl font-bold bg-white outline-none focus:border-blue-500"
                        value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} />
                    ) : (
                      <div className="font-bold text-slate-900 text-lg tracking-tight">{report.title}</div>
                    )}
                    <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase">ID: {report._id.slice(-6)}</div>
                  </td>
                  <td className="px-10 py-6">
                    {editingId === report._id ? (
                      <select className="border-2 border-blue-100 p-2 rounded-xl font-black text-[10px] uppercase bg-white"
                        value={editForm.status} onChange={(e) => setEditForm({...editForm, status: e.target.value})}>
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>
                    ) : (
                      <StatusBadge status={report.status} />
                    )}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      {editingId === report._id ? (
                        <button onClick={() => handleUpdate(report._id)} className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-100"><Save size={18}/></button>
                      ) : (
                        <button onClick={() => startEditing(report)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-xl transition-all"><Edit3 size={18}/></button>
                      )}
                      <button onClick={() => handleDelete(report._id)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-rose-500 rounded-xl transition-all"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && reports.length === 0 && (
          <div className="p-20 text-center text-slate-400 italic font-bold">No activity logs found for {user?.ward}.</div>
        )}
      </div>
    </div>
  );
}

/* --- UI HELPERS --- */
const StatusIcon = ({ status }) => {
  if (status === "Completed") return <CheckCircle2 className="text-emerald-500 mx-auto" size={24} />;
  if (status === "In Progress") return <Clock className="text-blue-500 animate-pulse mx-auto" size={24} />;
  return <AlertCircle className="text-amber-500 mx-auto" size={24} />;
};

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    "In Progress": "bg-blue-50 text-blue-600 border-blue-100",
    Completed: "bg-emerald-50 text-emerald-600 border-emerald-100"
  };
  return (
    <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};