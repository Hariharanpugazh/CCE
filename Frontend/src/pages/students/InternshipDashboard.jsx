import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import StudentPageSearchBar from "../../components/Students/StudentPageSearchBar";
import PageHeader from "../../components/Common/StudentPageHeader";

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
      <PageHeader page="Internship Dashboard" filter={filter} setFilter={setFilter} />

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
            <div
              key={internship._id}
              className="p-4 border rounded-lg shadow-md bg-white flex flex-col justify-between"
            >
              <h2 className="text-xl font-bold text-gray-800">{internship.title}</h2>
              <p className="text-gray-600 mt-2">{internship.company_name}</p>
              <p className="text-gray-500 mt-2">{internship.location}</p>
              <p className="text-gray-500 mt-2">Stipend: {internship.stipend}</p>
              <p className="text-gray-500 mt-2">Duration: {internship.duration}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
