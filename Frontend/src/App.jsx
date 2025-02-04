import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Cookies from "js-cookie";  // Import js-cookie
import "./App.css";
import { AppPages } from "./utils/constants";

// Import Pages
import StudentLogin from "./pages/StudentLogin";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import AdminLogin from "./pages/AdminLogin";
import InternShipDashboard from "./pages/students/InternshipDashboard";
import JobDashboard from "./pages/students/JobDashboard";
import AdminInternShipDashboard from "./pages/admin/adminInternDashboard";
import AdminJobsDashboard from "./pages/admin/adminJobsDashboard";
import SuperadminDashboard from "./pages/superadmin/SuperadminDashboard"
import MailPage from "./pages/superadmin/MailPage";
import JobPostForm from "./pages/admin/JobPostForm";
import AchievementPostForm from "./pages/admin/AchievementPostForm";
import InternshipForm from "./pages/admin/IntershipForm";

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
        {/* Student Routes */}
        <Route path={"/"} element={<StudentLogin />} />
        <Route path="/login" element={<StudentLogin />} />

        {/* Protected Student Routes */}
        <Route path="/internships" element={<ProtectedRoute> <InternShipDashboard /></ProtectedRoute>}/>
        <Route path="/jobs" element={ <ProtectedRoute><JobDashboard /> </ProtectedRoute>}/>

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
        <Route path="/mail" element={<MailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
