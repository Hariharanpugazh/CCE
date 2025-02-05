import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Cookies from "js-cookie";  // Import js-cookie
import "./App.css";
import { AppPages } from "./utils/constants";
import StudentLogin from "./pages/students/StudentLogin";
import SuperAdminLogin from "./pages/superadmin/SuperAdminLogin";
import AdminLogin from "./pages/admin/AdminLogin";
import InternShipDashboard from "./pages/students/InternshipDashboard";
import JobDashboard from "./pages/students/JobDashboard";
import AdminInternShipDashboard from "./pages/admin/adminInternDashboard";
import AdminJobsDashboard from "./pages/admin/adminJobsDashboard";
import SuperadminDashboard from "./pages/superadmin/SuperadminDashboard"
import MailPage from "./pages/superadmin/MailPage";
import JobPostForm from "./pages/admin/JobPostForm";
import AchievementPostForm from "./pages/admin/AchievementPostForm";
import InternshipForm from "./pages/admin/IntershipForm";
import AchievementDashboard from "./pages/students/AchievementDashboard";
import HomeDashboard from "./pages/students/HomeDashboard";
import LandingPage from "./pages/common/Landing";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("jwt"); // Get JWT token from cookies

  if (!token) {
    return <Navigate to="/login" replace />; // Redirect to login if no token
  }

  return children; // Render the protected page if token exists
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path={"/"} element={<LandingPage />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentLogin />} />

        {/* Protected Student Routes */}
        <Route path="/home" element={<ProtectedRoute> <HomeDashboard /> </ProtectedRoute>}/>
        <Route path="/internships" element={<ProtectedRoute> <InternShipDashboard /></ProtectedRoute>}/>
        <Route path="/jobs" element={ <ProtectedRoute><JobDashboard /> </ProtectedRoute>}/>
        <Route path="/achievements" element={ <ProtectedRoute> <AchievementDashboard /> </ProtectedRoute>}/>
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin/internships" element={ <ProtectedRoute> <AdminInternShipDashboard /> </ProtectedRoute>}/>
        <Route path="/admin/jobs" element={ <ProtectedRoute> <AdminJobsDashboard /> </ProtectedRoute>} />
        <Route path="/jobpost" element={ <ProtectedRoute> <JobPostForm /> </ProtectedRoute>} />
        <Route path="/achievementpost" element={<ProtectedRoute> <AchievementPostForm /> </ProtectedRoute>} />
        <Route path="/internpost" element={<ProtectedRoute><InternshipForm /> </ProtectedRoute>} />

        {/* Super Admin Login */}
        <Route path={"/superadmin"} element={<SuperAdminLogin />} />
        <Route path={"/superadmin-dashboard"} element={<ProtectedRoute> <SuperadminDashboard /> </ProtectedRoute>}/>
        <Route path={"/mail"} element={<ProtectedRoute> <MailPage /> </ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
