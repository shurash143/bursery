import React, { useState } from 'react';
import { UserPlus, X, Search, Mail, Shield, Trash2, Edit3, Loader2 } from 'lucide-react';
import API from "../api/axiosConfig";

export default function LeadersManager({ leaders, refreshData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [selectedLeader, setSelectedLeader] = useState(null);

  const filteredLeaders = leaders.filter(leader => 
    leader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    leader.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setSelectedLeader(null);
    setIsModalOpen(true);
  };

  const openEditModal = (leader) => {
    setSelectedLeader(leader);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    try {
      if (selectedLeader) {
        // Updated to use /admin/leader (Singular)
        await API.put(`/admin/leader/${selectedLeader._id}`, payload);
      } else {
        // Updated to use /admin/leader (Singular)
        await API.post("/admin/leader", { ...payload, password: "Leader@123" });
      }
      
      setIsModalOpen(false);
      refreshData(); 
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this official?")) return;
    
    try {
      // Updated to use /admin/leader (Singular)
      await API.delete(`/admin/leader/${id}`);
      refreshData();
    } catch (err) {
      alert(err.response?.data?.message || "Deletion failed");
    }
  };

  return (
    <div className="p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Leader Registry</h2>
          <p className="text-slate-500 font-medium">Managing {leaders.length} registered officials</p>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 bg-slate-100 rounded-2xl w-64 outline-none focus:ring-2 focus:ring-blue-500 border-none transition-all"
            />
          </div>
          <button 
            onClick={openAddModal} 
            className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-95"
          >
            <UserPlus size={18} /> Add Leader
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <tr>
              <th className="p-6">Official Name</th>
              <th className="p-6">Email Address</th>
              <th className="p-6">Designation</th>
              <th className="p-6 text-right pr-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredLeaders.map((leader) => (
              <tr key={leader._id} className="text-sm hover:bg-slate-50/50 transition-colors group">
                <td className="p-6 font-bold text-slate-900">{leader.name}</td>
                <td className="p-6 text-slate-500">{leader.email}</td>
                <td className="p-6">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl font-black uppercase text-[10px] tracking-widest border border-blue-100">
                    {leader.role}
                  </span>
                </td>
                <td className="p-6 text-right pr-10 space-x-2">
                  <button 
                    onClick={() => openEditModal(leader)}
                    className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    title="Edit Details"
                  >
                    <Edit3 size={18}/>
                  </button>
                  <button 
                    onClick={() => handleDelete(leader._id)}
                    className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    title="Delete Official"
                  >
                    <Trash2 size={18}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLeaders.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center justify-center">
            <Search size={40} className="text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No matching officials found</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {selectedLeader ? "Edit Official" : "Register Leader"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Full Name</label>
                <input 
                  name="name" 
                  defaultValue={selectedLeader?.name || ""} 
                  placeholder="e.g. Hon. John Doe" 
                  required 
                  className="w-full p-4 bg-slate-50 rounded-2xl mt-1 border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-medium" 
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  defaultValue={selectedLeader?.email || ""} 
                  placeholder="leader@government.go.ke" 
                  required 
                  className="w-full p-4 bg-slate-50 rounded-2xl mt-1 border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-medium" 
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Designation</label>
                <select 
                  name="role" 
                  defaultValue={selectedLeader?.role || "Member of Parliament"} 
                  className="w-full p-4 bg-slate-50 rounded-2xl mt-1 font-bold outline-none border border-transparent focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="Member of Parliament">Member of Parliament</option>
                  <option value="Ward Rep">Ward Rep</option>
                  <option value="WOMEN_REP">Women Rep</option>
                  <option value="MCA">MCA</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex justify-center items-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (selectedLeader ? "Save Changes" : "Confirm Registration")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}