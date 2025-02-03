import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AppPages } from "./utils/constants";

import './assets/fonts/BrittiSans/BrittiSans-Regular.otf'
import StudentLogin from "./pages/StudentLogin";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import AdminLogin from "./pages/AdminLogin";
import InternShipDashboard from "./pages/students/InternshipDashboard";
import JobDashboard from "./pages/students/JobDashboard";
import AdminInternShipDashboard from "./pages/admin/adminInternDashboard";
import AdminJobsDashboard from "./pages/admin/adminJobsDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* students */}
        <Route path={"/"} element={<StudentLogin />} />
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/internships" element={<InternShipDashboard />} />
        <Route path="/jobs" element={<JobDashboard />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/internships" element={<AdminInternShipDashboard />} />
        <Route path="/admin/jobs" element={<AdminJobsDashboard />} />


        {/* super admin */}
        <Route path={AppPages.superUserLogin.route} element={<SuperAdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
