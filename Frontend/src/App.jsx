import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AppPages } from "./utils/constants";

import './assets/fonts/BrittiSans/BrittiSans-Regular.otf'
import StudentLogin from "./pages/StudentLogin";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<StudentLogin />} />
        <Route path={"/login"} element={<StudentLogin />} />
        <Route path={"/superadmin"} element={<SuperAdminLogin />} />
        <Route path={"/admin"} element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
