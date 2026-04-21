import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FilePlus, 
  ClipboardList, 
  LogOut, 
  ExternalLink, 
  Search,
  AlertCircle
} from "lucide-react";
import API from "../api/axiosConfig";

/* --- PROFESSIONAL SIDEBAR --- */
function StudentSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/student", icon: <LayoutDashboard size={20} /> },
    { name: "Apply for Bursary", path: "/apply", icon: <FilePlus size={20} /> },
    { name: "My Applications", path: "/my-applications", icon: <ClipboardList size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <aside className="w-72 bg-slate-900 shadow-2xl min-h-screen p-0 flex flex-col fixed text-slate-300 z-50">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ClipboardList className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Student Hub</h2>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-red-500 hover:text-white transition-all duration-300 font-semibold"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}

/* --- MAIN PAGE COMPONENT --- */
export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/applications/my")
      .then((res) => {
        // Ensure res.data is actually an array before setting state
        setApplications(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Applications Error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
      <StudentSidebar />

      <main className="ml-72 flex-1 p-12">
        <header className="flex justify-between items-end mb-10">
          <div>
            <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-2">Management</p>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Applications</h1>
          </div>
          <div className="text-right">
             <p className="text-slate-500 text-sm font-medium">Total Submissions</p>
             <p className="text-2xl font-bold text-slate-900">{applications.length}</p>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-20 text-center border border-slate-100 shadow-sm">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="text-slate-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Applications Found</h3>
            <p className="text-slate-500 mb-8">You haven't submitted any bursary requests yet.</p>
            <Link to="/apply" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
              Start New Application
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
              >
                <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                      {app.schoolName || "Unknown Institution"}
                    </h2>
                    {/* FIX: String conversion prevents .slice() crash if ID is a number */}
                    <p className="text-slate-400 font-medium text-sm tracking-wide uppercase">
                      Ref: #B-{String(app.id || "").slice(-6) || "N/A"}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                <div className="grid md:grid-cols-4 gap-8 mb-8">
                  <DataPoint label="Admission No." value={app.admissionNumber} />
                  <DataPoint label="Family Income" value={app.familyIncome ? `KES ${app.familyIncome}` : "N/A"} />
                  <DataPoint label="Reason for Aid" value={app.reason} isLongText />
                  <DataPoint label="Submission Date" value={new Date(app.createdAt || Date.now()).toLocaleDateString()} />
                </div>

                <div className="pt-8 border-t border-slate-50">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Supporting Documentation</p>
                  <div className="flex flex-wrap gap-4">
                    {/* Using Optional Chaining to prevent crashes if files object is missing */}
                    <FileLink label="ID Copy" url={app.files?.idCopy} />
                    <FileLink label="Admission Letter" url={app.files?.admissionLetter} />
                    <FileLink label="Fee Structure" url={app.files?.feeStructure} />
                    {(!app.files?.idCopy && !app.files?.admissionLetter && !app.files?.feeStructure) && (
                      <p className="text-sm text-slate-400 italic">No documents uploaded.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/* --- PROFESSIONAL UI SUB-COMPONENTS --- */

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    Approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Rejected: "bg-rose-50 text-rose-600 border-rose-100",
    Default: "bg-blue-50 text-blue-600 border-blue-100"
  };

  const currentStyle = styles[status] || styles.Default;

  return (
    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${currentStyle}`}>
      {status || "Pending"}
    </span>
  );
};

const DataPoint = ({ label, value, isLongText }) => (
  <div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-slate-700 font-semibold ${isLongText ? "text-sm italic line-clamp-2" : "text-base"}`}>
      {value || "Not Provided"}
    </p>
  </div>
);

const FileLink = ({ label, url }) => {
  if (!url) return null;
  return (
    <button
      onClick={() => window.open(url, "_blank")}
      className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all text-slate-600 text-sm font-bold"
    >
      <ExternalLink size={14} /> {label}
    </button>
  );
};