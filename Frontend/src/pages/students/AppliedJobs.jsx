import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import PageHeader from "../../components/Common/StudentPageHeader";
import ApplicationCard from "../../components/Students/ApplicationCard";
import { AppPages } from "../../utils/constants";
import Cookies from "js-cookie";

export default function AppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const token = Cookies.get("jwt");
        const userId = JSON.parse(atob(token.split(".")[1])).student_user;
        const response = await axios.get(
          `http://localhost:8000/api/applied-jobs/${userId}/`
        );

        // Access the job IDs within the response data
        const jobIds = response.data.jobs;

        // Fetch details for each job ID
        const jobDetailsPromises = jobIds.map(jobId =>
          axios.get(`http://localhost:8000/api/job/${jobId}/`)
        );

        const jobDetails = await Promise.all(jobDetailsPromises);
        const jobsWithDetails = jobDetails.map(job => job.data.job);

        // Log the jobs to inspect their structure
        console.log("Applied Jobs:", jobsWithDetails);

        if (Array.isArray(jobsWithDetails)) {
          setAppliedJobs(jobsWithDetails);
          setFilteredJobs(jobsWithDetails);
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (err) {
        console.error("Error fetching applied jobs:", err);
        setError("Unable to load applied jobs. Please try again later.");
      }
    };

    fetchAppliedJobs();
  }, []);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(!payload.student_user ? payload.role : "student");
    }
  }, []);

  const handleStatusFilterChange = (status) => {
    setFilter(status);
  };

  return (
    <div className="flex flex-col">
      {userRole === "student" && <StudentPageNavbar />}
      <PageHeader
        page={AppPages.jobDashboard}
        filter={filter}
        setFilter={setFilter}
      />

      {/* Status-based filters */}
      <div className="flex text-sm gap-4 w-[80%] self-center mb-2 px-1">
        {["All"].map((status) => (
          <button
            key={status}
            className={`rounded-[10000px] p-1 ${
              filter === status
                ? "text-blue-400 underline"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => handleStatusFilterChange(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Job cards */}
      <div className="w-[80%] self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-stretch">
  {error ? (
    <p className="text-red-600">{error}</p>
  ) : appliedJobs.length === 0 ? (
    <p className="text-gray-600">You haven&apos;t applied for any jobs yet.</p>
  ) : filteredJobs.length === 0 ? (
    <p className="alert alert-danger w-full col-span-full text-center">
      !! No Jobs Found !!
    </p>
  ) : (
    filteredJobs.map((job) => (
      <ApplicationCard
        application={{ ...job, ...job.job_data }} // Ensure correct structure
        key={job._id}
      />
    ))
  )}
</div>
    </div>
  );
}
