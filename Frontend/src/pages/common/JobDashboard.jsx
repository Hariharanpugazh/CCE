import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import PageHeader from "../../components/Common/StudentPageHeader";
import ApplicationCard from "../../components/Students/ApplicationCard";
import { AppPages } from "../../utils/constants";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

export default function JobDashboard() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([])
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("")
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    console.log(filter)
    if (filter === "All") {
      setFilteredJobs(jobs)
      return
    }
    setFilteredJobs(jobs.filter((job) => job.job_data.selectedCategory === filter))
  }, [filter])

  useEffect(() => {
    if (searchPhrase === "") {
      setFilteredJobs(jobs)
    } else {
      setFilteredJobs(jobs.filter((job) => job.job_data.title.includes(searchPhrase)
        ||
        job.job_data.company_name.includes(searchPhrase)
        ||
        job.job_data.job_description.includes(searchPhrase)
        ||
        job.job_data.required_skills.includes(searchPhrase)
        ||
        job.job_data.work_type.includes(searchPhrase)
      ))
    }
  }, [searchPhrase])

  // Fetch published jobs from the backend
  useEffect(() => {
    const fetchPublishedJobs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/published-jobs/");
        const jobsWithType = response.data.jobs.map((job) => ({
          ...job,
          type: "job", // Add type field
        }));
        setJobs(jobsWithType); // Set jobs with type
        setFilteredJobs(jobsWithType); // Update filtered jobs
      } catch (err) {
        console.error("Error fetching published jobs:", err);
        setError("Failed to load jobs.");
      }
    };

    fetchPublishedJobs();
  }, []);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      console.log("Decoded JWT Payload:", payload); // Debugging line
      setUserRole(!payload.student_user ? payload.role : "student"); // Assuming the payload has a 'role' field
    }
  }, []);

  return (
    <div className="flex flex-col">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      {userRole === "student" && <StudentPageNavbar />}
      <PageHeader page={AppPages.jobDashboard} filter={filter} setFilter={setFilter} searchPhrase={searchPhrase} setSearchPhrase={setSearchPhrase} />

      {/* Search bar */}
      <div className="w-[80%] self-center">
        {/* <StudentPageSearchBar /> */}
      </div>

      {/* Job cards */}
      <div className="w-[80%] self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-stretch">
        {error ?
          <p className="text-red-600">{error}</p>
          : jobs.length === 0 ?
            <p className="text-gray-600">No jobs available at the moment.</p>
            :
            filteredJobs.length === 0 ? <p className="alert alert-danger w-full col-span-full text-center">
              !! No Jobs Found !!
            </p>
              :
              filteredJobs.map((job) => (
                <ApplicationCard application={{ ...job, ...job.job_data }} key={job._id} />
              ))
        }
      </div>
    </div>
  );
}
