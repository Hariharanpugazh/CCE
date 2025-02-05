import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import StudentPageSearchBar from "../../components/Students/StudentPageSearchBar";
import PageHeader from "../../components/Common/StudentPageHeader";

export default function JobDashboard() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  // Fetch published jobs from the backend
  useEffect(() => {
    const fetchPublishedJobs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/published-jobs/");
        setJobs(response.data.jobs); // Assuming backend response contains `jobs`
      } catch (err) {
        console.error("Error fetching published jobs:", err);
        setError("Failed to load jobs.");
      }
    };

    fetchPublishedJobs();
  }, []);

  return (
    <div className="flex flex-col">
      <StudentPageNavbar />
      <PageHeader page="Job Dashboard" filter={filter} setFilter={setFilter} />

      {/* Search bar */}
      <div className="w-[80%] self-center">
        <StudentPageSearchBar />
      </div>

      {/* Job cards */}
      <div className="w-[80%] self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-600">No jobs available at the moment.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="p-4 border rounded-lg shadow-md bg-white flex flex-col justify-between"
            >
              <h2 className="text-xl font-bold text-gray-800">{job.job_data.title}</h2>
              <p className="text-gray-600 mt-2">{job.job_data.company_name}</p>
              <p className="text-gray-500 mt-2">{job.job_data.job_location}</p>
              <a
                href={job.job_data.company_website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 mt-4"
              >
                Visit Company Website
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
