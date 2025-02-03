import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AppPages } from "./utils/constants";

import './assets/fonts/BrittiSans/BrittiSans-Regular.otf'
import StudentLogin from "./pages/StudentLogin";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import AdminLogin from "./pages/AdminLogin";
import InternShipDashboard from "./pages/students/InternshipDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* students */}
        <Route path={"/"} element={<StudentLogin />} />
        <Route path={AppPages.studentLogin.route} element={<StudentLogin />} />
        <Route path={AppPages.internShipDashboard.route} element={<InternShipDashboard />} />

        {/* admin */}
        <Route path={AppPages.adminLogin.route} element={<AdminLogin />} />

        {/* super admin */}
        <Route path={AppPages.superUserLogin.route} element={<SuperAdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
