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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReport, setNewReport] = useState({ title: "", status: "Pending" });
  const [editForm, setEditForm] = useState({ title: "", status: "" });

  // SAFE FETCH
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);

      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        console.warn("No user found in localStorage");
        setReports([]);
        return;
      }

      setUser(storedUser);

      const res = await API.get("/reports", {
        params: {
          role: storedUser?.role,
          ward: storedUser?.ward,
          constituency: storedUser?.constituency
        }
      });

      setReports(res.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // CREATE
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      const payload = {
        ...newReport,
        ward: storedUser?.ward,
        constituency: storedUser?.constituency,
        role: "MCA"
      };

      const res = await API.post("/reports", payload);

      setReports((prev) => [res.data, ...prev]);
      setIsModalOpen(false);
      setNewReport({ title: "", status: "Pending" });

    } catch (err) {
      console.error(err);
      alert("Failed to create entry.");
    }
  };

  // UPDATE
  const handleUpdate = async (id) => {
    try {
      await API.put(`/reports/${id}`, editForm);

      setReports((prev) =>
        prev.map((r) => (r._id === id ? { ...r, ...editForm } : r))
      );

      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this log?")) return;

    try {
      await API.delete(`/reports/${id}`);

      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  const startEditing = (report) => {
    setEditingId(report._id);
    setEditForm({
      title: report.title,
      status: report.status
    });
  };

  return (
    <div className="p-4 md:p-8 bg-[#fdfdfd] min-h-screen">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase">
          Ward Activity Logs
        </h1>

        <p className="text-slate-400 text-xs font-bold uppercase">
          Ward: <span className="text-blue-600">{user?.ward || "Loading..."}</span>
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border">

        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin mx-auto" />
          </div>
        ) : (
          <div className="p-6">
            {reports.length === 0 ? (
              <p className="text-center text-slate-400">No reports found</p>
            ) : (
              reports.map((r) => (
                <div key={r._id} className="p-4 border-b flex justify-between">

                  <div>
                    {editingId === r._id ? (
                      <input
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                      />
                    ) : (
                      <p className="font-bold">{r.title}</p>
                    )}
                  </div>

                  <div className="flex gap-2">

                    {editingId === r._id ? (
                      <button onClick={() => handleUpdate(r._id)}>
                        <Save />
                      </button>
                    ) : (
                      <button onClick={() => startEditing(r)}>
                        <Edit3 />
                      </button>
                    )}

                    <button onClick={() => handleDelete(r._id)}>
                      <Trash2 />
                    </button>

                  </div>

                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}