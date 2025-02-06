import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { AppPages } from "../../utils/constants";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import PageHeader from "../../components/Common/StudentPageHeader";
import { FiMail } from "react-icons/fi"; // Import react-icons for mail icon
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

export default function SuperadminDashboard() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="flex flex-col">
      <SuperAdminPageNavbar />
      <PageHeader
        page={AppPages.internShipDashboard}
        filter={filter}
        setFilter={setFilter}
      />
    </div>
  );
}
