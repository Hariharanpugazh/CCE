import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./App.css";
import StudentLogin from "./pages/students/StudentLogin";
import SuperAdminLogin from "./pages/superadmin/SuperAdminLogin";
import AdminLogin from "./pages/admin/AdminLogin";
import InternShipDashboard from "./pages/common/InternshipDashboard";
import JobDashboard from "./pages/common/JobDashboard";
import SuperadminDashboard from "./pages/superadmin/SuperadminDashboard";
import MailPage from "./pages/superadmin/Management";
import JobPostForm from "./pages/admin/JobPostForm";
import AchievementPostForm from "./pages/admin/AchievementPostForm";
import InternshipForm from "./pages/admin/IntershipForm";
import AchievementDashboard from "./pages/students/AchievementDashboard";
import HomeDashboard from "./pages/students/HomeDashboard";
import LandingPage from "./pages/common/Landing";
import ContactForm from "./pages/students/Contact";
import JobPreview from "./pages/students/Jobpreview";
import JobEdit from "./pages/admin/Jobedit";
import InternshipEdit from "./pages/admin/InternshipEdit";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InternshipPreview from "./pages/students/InternshipPreview";
import AdminAchievementDashboard from "./pages/admin/adminAchievementDashboard";
import SuperAchievementDashboard from "./pages/superadmin/superAchievementDashboard";
import ManageJobs from "./pages/admin/ManageJobs";
import InboxPage from "./pages/superadmin/InboxPage";
import AdminHome from "./pages/admin/AdminHomePage";
import AdminSignup from "./pages/superadmin/AdminSignup";
import StudentSignup from "./pages/superadmin/StudentSignup";
import AdminManagement from "./pages/superadmin/AdminManagement";
import AdminDetailPage from "./pages/superadmin/AdminDetailPage";
import AdminMail from "./pages/admin/AdminMail";
import StudentManagement from "./pages/admin/StudentManagement";
import StudentAchievementPostForm from "./pages/students/PostAchievement";
import StudyMaterialForm from "./components/Common/StudyMaterialForm"
import StudyEdit from "./pages/admin/StudyEdit";



// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("jwt"); // Get JWT token from cookies

  if (!token) {
    return <Navigate to="/" replace />; // Redirect to login if no token
  }
  return children; // Render the protected page if token exists
};

function App() {
  return (
    <BrowserRouter>
      {/* Add ToastContainer here */}
      <ToastContainer
        position="top-right"
        autoClose={3000} // Automatically close toasts after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // Optional: Adjust theme as per your design
      />
      <Routes>
        <Route path={"/"} element={<LandingPage />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentLogin />} />

        {/* Protected Student Routes */}
        <Route path="/home" element={<ProtectedRoute> <HomeDashboard /> </ProtectedRoute>} />
        <Route path="/internships" element={<ProtectedRoute> <InternShipDashboard /></ProtectedRoute>} />
        <Route path="/jobs" element={ <ProtectedRoute><JobDashboard /> </ProtectedRoute>} />
        <Route path="/achievements" element={ <ProtectedRoute> <AchievementDashboard /> </ProtectedRoute>} />
        <Route path="/contact" element= {<ProtectedRoute><ContactForm /> </ProtectedRoute>} />
        <Route path="/job-preview/:id" element={<JobPreview />} />
        <Route path="/internship-preview/:id" element={<InternshipPreview />} />
        <Route path="/studentachievement" element= {<ProtectedRoute><StudentAchievementPostForm /> </ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
          
        {/* Protected Admin Routes */}
        <Route path="/admin/home" element={<ProtectedRoute> <AdminHome /> </ProtectedRoute>} />
        <Route path="/admin/mail" element={<ProtectedRoute> <AdminMail /> </ProtectedRoute>} />
        <Route path="/admin/achievements" element={ <ProtectedRoute> <AdminAchievementDashboard /> </ProtectedRoute>} />
        <Route path="/jobpost" element={ <ProtectedRoute> <JobPostForm /> </ProtectedRoute>} />
        <Route path="/achievementpost" element={<ProtectedRoute> <AchievementPostForm /> </ProtectedRoute>} />
        <Route path="/internpost" element={<ProtectedRoute><InternshipForm /> </ProtectedRoute>} />
        <Route path="/job-edit/:id" element= {<ProtectedRoute> <JobEdit /> </ProtectedRoute>}/>
        <Route path="/internship-edit/:id" element= {<ProtectedRoute> <InternshipEdit /> </ProtectedRoute>}/>
        <Route path="//study-edit/:id" element= {<ProtectedRoute> <StudyEdit /> </ProtectedRoute>} />
        <Route path="/manage-jobs" element= {<ProtectedRoute> <ManageJobs /> </ProtectedRoute>}/>
        <Route path="/manage-student" element={<ProtectedRoute> <StudentManagement /> </ProtectedRoute>} />
        <Route path="/studymaterial-post" element={<ProtectedRoute> <StudyMaterialForm /> </ProtectedRoute>} />
      

        {/* Super Admin Login */}
        <Route path={"/superadmin"} element={<SuperAdminLogin />} />
        <Route path={"/admin-signup"} element={<AdminSignup />} />
        <Route path={"/student-signup"} element={<StudentSignup />} />
        <Route path={"/superadmin-dashboard"} element={<ProtectedRoute> <SuperadminDashboard /> </ProtectedRoute>} />
        <Route path={"/Admin-Management"} element={<ProtectedRoute> <AdminManagement /> </ProtectedRoute> } />
        <Route path={"/superadmin/achievements"} element={<ProtectedRoute> <SuperAchievementDashboard /> </ProtectedRoute>} />
        <Route path={"/superadmin-manage-jobs"} element={<ProtectedRoute> <MailPage /> </ProtectedRoute>} />
        <Route path={"/contact-inbox"} element={<ProtectedRoute> <InboxPage /> </ProtectedRoute>} />
        <Route path={"/admin-details/:id"} element={<ProtectedRoute> <AdminDetailPage /> </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
