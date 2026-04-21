import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Components & Pages
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Student pages
import StudentDashboardPage from "./pages/StudentDashboard";
import ApplyPage from "./pages/ApplyPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import UploadForm from "./components/UploadForm";

// Leader pages
import LeaderLayout from "./components/LeaderLayout";
import LeaderReportsLayout from "./components/LeaderReportsLayout";
import LeaderDashboard from "./pages/LeaderDashboard";
import MPReports from "./pages/MPReports";
import MCAReports from "./pages/MCAReports";
import WomenRepReports from "./pages/WomenRepReports";

// Admin page
import AdminDashboardPage from "./pages/AdminDashboardPage";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About"
import Contact from  "./pages/Contact"
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // Paths where Navbar should be hidden
  const noNavbarPaths = [
    "/student",
    "/apply",
    "/upload-documents",
    "/admin",
    "/leader-dashboard"
  ];
  const hideNavbar = noNavbarPaths.some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!hideNavbar && <Navbar />}

      <div className="p-6">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Student protected routes */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student" element={<StudentDashboardPage />} />
            <Route path="/apply" element={<ApplyPage />} />
            <Route path="/student/my-applications" element={<MyApplicationsPage />} />
            <Route path="/upload-documents" element={<UploadForm />} />
          </Route>

          {/* Leader protected routes */}
      <Route element={<ProtectedRoute allowedRoles={["mp", "mca", "women_rep"]} />}>
  <Route path="/leader-dashboard" element={<LeaderLayout user={user} />}>
    <Route index element={<LeaderDashboard user={user} />} />
    <Route path="applications" element={<LeaderDashboard user={user} />} />

            
              <Route path="mp-reports" element={<MPReports />} />
              <Route path="mca-reports" element={<MCAReports />} />
              <Route path="women-rep-reports" element={<WomenRepReports />} />
            </Route>
          </Route>
          

          {/* Admin protected routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
