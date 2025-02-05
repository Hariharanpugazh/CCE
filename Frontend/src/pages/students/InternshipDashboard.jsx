import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import StudentPageSearchBar from "../../components/Students/StudentPageSearchBar";
import PageHeader from "../../components/Common/StudentPageHeader";
import { AppPages } from "../../utils/constants";
import ApplicationCard from "../../components/Students/ApplicationCard";

export default function InternshipDashboard() {
  const [internships, setInternships] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  // Fetch published internships from the backend
  useEffect(() => {
    const fetchPublishedInternships = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/published-internship/");
        setInternships(response.data.internships);
      } catch (err) {
        console.error("Error fetching published internships:", err);
        setError("Failed to load internships.");
      }
    };

    fetchPublishedInternships();
  }, []);

  return (
    <div className="flex flex-col">
      <StudentPageNavbar />
      <PageHeader page={AppPages.internShipDashboard} filter={filter} setFilter={setFilter} />

      {/* Search bar */}
      <div className="w-[80%] self-center">
        <StudentPageSearchBar />
      </div>

      {/* Internship cards */}
      <div className="w-[80%] self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : internships.length === 0 ? (
          <p className="text-gray-600">No internships available at the moment.</p>
        ) : (
          internships.map((internship) => (
            <ApplicationCard application={internship} />
          ))
        )}
      </div>
    </div>
  );
}
