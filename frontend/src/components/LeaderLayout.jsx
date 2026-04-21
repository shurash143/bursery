import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FileStack, LogOut, LayoutGrid, Heart } from "lucide-react";

export default function LeaderLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Get user and normalize the role string immediately
  const user = JSON.parse(localStorage.getItem("user"));
  const rawRole = user?.role?.toLowerCase() || "";

  // 2. Logic to handle both "MP" and "Member of Parliament"
  const isMP = rawRole.includes("parliament") || rawRole === "mp";
  const isMCA = rawRole.includes("mca") || rawRole.includes("ward") || rawRole.includes("assembly");
  const isWomenRep = rawRole.includes("women");

  const getRoleBranding = () => {
    if (isMP) return { label: "MP Dashboard", color: "bg-emerald-500" };
    if (isMCA) return { label: "MCA Dashboard", color: "bg-blue-500" };
    if (isWomenRep) return { label: "Women Rep", color: "bg-rose-500" };
    return { label: "Leader Portal", color: "bg-slate-500" };
  };

  const branding = getRoleBranding();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white fixed h-full p-6 flex flex-col z-20">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className={`${branding.color} p-2 rounded-lg shadow-lg`}>
            {isWomenRep ? <Heart size={20} /> : <FileStack size={20} />}
          </div>
          <span className="font-bold text-lg tracking-tight">{branding.label}</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarLink 
            icon={<LayoutGrid size={18}/>} 
            label="Overview" 
            active={location.pathname === "/leader-dashboard"}
            onClick={() => navigate("/leader-dashboard")} 
          />
          <SidebarLink 
            icon={<FileStack size={18}/>} 
            label="Official Reports" 
            active={location.pathname.includes("reports")}
            onClick={() => {
                // Fix: Ensure the path matches the role detected
                let reportPath = "women-rep-reports";
                if (isMP) reportPath = "mp-reports";
                else if (isMCA) reportPath = "mca-reports";
                navigate(`/leader-dashboard/${reportPath}`);
            }} 
          />
        </nav>

        <button onClick={handleLogout} className="mt-auto flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-all">
          <LogOut size={18} /> <span className="font-medium">Logout</span>
        </button>
      </aside>

      <main className="flex-1 ml-64 p-10">
        <Outlet /> 
      </main>
    </div>
  );
}

const SidebarLink = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-slate-800'}`}>
    {icon} <span>{label}</span>
  </button>
);