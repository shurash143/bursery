import React, { useEffect, useState, useCallback } from "react";
import { MapPin, Loader2, AlertCircle, Trash2, CheckCircle, RotateCcw } from "lucide-react";
import API from "../api/axiosConfig";

export default function LeaderDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leader, setLeader] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      setLeader(user);
      const res = await API.get("/applications/leader"); 
      setApplications(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Connection error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // --- NEW HANDLERS ---

  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "approved" ? "pending" : "approved";
    try {
      // Optimistic UI update
      setApplications(prev => 
        prev.map(app => app._id === id ? { ...app, status: newStatus } : app)
      );
      
      await API.patch(`/applications/${id}`, { status: newStatus });
    } catch (err) {
      alert("Failed to update status");
      loadData(); // Revert on failure
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    
    try {
      await API.delete(`/applications/${id}`);
      setApplications(prev => prev.filter(app => app._id !== id));
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || "Server error"));
    }
  };

  // --- RENDER LOGIC ---

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase italic">Leader Console</h1>
          <div className="flex items-center gap-2 text-slate-500 font-bold">
            <MapPin size={18} />
            <span>{leader?.constituency || leader?.ward || leader?.county} Jurisdiction</span>
          </div>
        </div>
        <button onClick={loadData} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <RotateCcw size={20} className="text-slate-600" />
        </button>
      </header>

      {error ? (
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-red-600 flex items-center gap-3">
          <AlertCircle /> {error}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-200">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white text-[10px] uppercase tracking-widest">
              <tr>
                <th className="p-6">Applicant</th>
                <th className="p-6">School</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-6 font-bold">{app.student?.name || "N/A"}</td>
                  <td className="p-6 text-slate-600">{app.schoolName}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      app.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Update Button */}
                      <button 
                        onClick={() => handleUpdateStatus(app._id, app.status)}
                        className={`p-2 rounded-lg border transition-all ${
                          app.status === 'approved' 
                          ? 'border-amber-200 text-amber-600 hover:bg-amber-50' 
                          : 'border-green-200 text-green-600 hover:bg-green-50'
                        }`}
                        title="Toggle Status"
                      >
                        <CheckCircle size={18} />
                      </button>

                      {/* Delete Button */}
                      <button 
                        onClick={() => handleDelete(app._id)}
                        className="p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-all"
                        title="Delete Application"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {applications.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-bold uppercase italic">
              No applications found for this jurisdiction
            </div>
          )}
        </div>
      )}
    </div>
  );
}