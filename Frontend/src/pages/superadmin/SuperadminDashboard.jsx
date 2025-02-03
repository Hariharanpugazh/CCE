import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { AppPages } from "../../utils/constants";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import PageHeader from "../../components/Common/StudentPageHeader";
import { FiMail } from "react-icons/fi"; // Import react-icons for mail icon

export default function SuperadminDashboard() {
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate(); // Initialize navigation

  const navigateToMailPage = () => {
    navigate("/mail"); // Navigate to the mail page
  };

  return (
    <div className="flex flex-col">
      <StudentPageNavbar />
      <PageHeader
        page={AppPages.internShipDashboard}
        filter={filter}
        setFilter={setFilter}
      />
      {/* Add mail icon in header */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <FiMail
          className="text-2xl text-gray-700 cursor-pointer hover:text-blue-500"
          title="Mail"
          onClick={navigateToMailPage}
        />
      </div>
    </div>
  );
}
