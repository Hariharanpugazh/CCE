import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import PageHeader from "../../components/Common/StudentPageHeader";
import ApplicationCard from "../../components/Students/ApplicationCard";
import { AppPages } from "../../utils/constants";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import {
  FaCaretDown,
  FaCaretUp,
  FaCircle,
  FaWindowClose,
} from "react-icons/fa";
import { FiBookmark, FiCircle, FiSearch, FiX } from "react-icons/fi";
import Footer from "../../components/Common/Footer";
import { useNavigate } from "react-router-dom";
import SidePreview from "../../components/Common/SidePreview";
import Pagination from "../../components/Admin/pagination";

export default function JobDashboard() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [error, setError] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [selectedJob, setSelectedJob] = useState();
  const [isSalaryOpen, setIsSalaryOpen] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [isEmployTypeOpen, setIsEmployTypeOpen] = useState(false);
  const [isWorkModeOpen, setIsWorkModeOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [salaryRangeIndex, setSalaryRangeIndex] = useState(0);
  const [filters, setFilters] = useState({
    salaryRange: { min: 10000, max: 1000000 },
    experience: { value: 0, category: "under" },
    employmentType: { onSite: false, remote: false, hybrid: false },
    workingMode: { online: false, offline: false, hybrid: false },
    sortBy: "Relevance",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const navigate = useNavigate();

  useEffect(() => {
    setFilteredJobs(jobs);
  }, [jobs]);

  useEffect(() => {
    if (searchPhrase === "") {
      clearFilters();
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(
        jobs.filter((job) => {
          const skills = job.job_data.required_skills;
          const isArray = Array.isArray(skills);
  
          return (
            job.job_data.title.toLowerCase().includes(searchPhrase) ||
            job.job_data.company_name.toLowerCase().includes(searchPhrase) ||
            job.job_data.job_description.toLowerCase().includes(searchPhrase) ||
            (isArray && skills.some((skill) => skill.toLowerCase().includes(searchPhrase))) ||
            job.job_data.work_type.toLowerCase().includes(searchPhrase)
          );
        })
      );
    }
    setCurrentPage(1);
  }, [searchPhrase, jobs]);
  

  useEffect(() => {
    const fetchPublishedJobs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/published-jobs/"
        );
        const jobsWithType = response.data.jobs.map((job) => ({
          ...job,
          type: "job",
          status: job.status,
          updated_at: job.updated_at,
        }));
        setJobs(jobsWithType);
        setFilteredJobs(jobsWithType);
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
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(!payload.student_user ? payload.role : "student");
    }
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;
      const response = await axios.get(
        `http://localhost:8000/api/saved-jobs/${userId}/`
      );
      setSavedJobs(response.data.jobs.map((job) => job._id));
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const clearFilters = () => {
    setFilters({
      salaryRange: { min: 10000, max: 1000000 },
      experience: { value: 0, category: "under" },
      employmentType: { onSite: false, remote: false, hybrid: false },
      workingMode: { online: false, offline: false, hybrid: false },
      sortBy: "Relevance",
    });
  };

  const borderColor = "border-gray-300";

  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      {userRole === "student" && <StudentPageNavbar />}

      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="flex flex-col items-center justify-center py-8 px-4 sm:py-14 container mx-auto text-center">
          <p className="text-3xl sm:text-6xl tracking-[0.8px]">Jobs</p>
          <p className="text-base sm:text-lg mt-2">
            Explore all the job opportunities in all the existing fields <br />
            around the globe.
          </p>
        </header>

        {/* Search Bar */}
        <div className="sticky top-0 z-10 bg-white px-4 sm:px-10 mb-5">
          <div className="flex flex-col sm:flex-row border border-gray-300">
            <input
              type="text"
              value={searchPhrase}
              onChange={(e) => setSearchPhrase(e.target.value.toLowerCase())}
              placeholder="Search Jobs"
              className="w-full text-base sm:text-lg p-2 px-4 bg-white hover:border-gray-400 outline-none border-b sm:border-b-0 border-gray-300"
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 p-2 sm:border-l border-gray-300">
              <select
                name="salaryRange"
                onChange={handleFilterChange}
                className="p-2 w-full sm:w-auto border-b sm:border-b-0 border-gray-300"
              >
                <option value="">Salary</option>
                <option value="10000-50000">10k-50k</option>
                <option value="50000-100000">50k-100k</option>
              </select>
              <select
                name="experience"
                onChange={handleFilterChange}
                className="p-2 w-full sm:w-auto border-b sm:border-b-0 border-gray-300"
              >
                <option value="">Experience</option>
                <option value="0year-2year">0-2 years</option>
                <option value="2year-5year">2-5 years</option>
              </select>
              <select
                name="employmentType"
                onChange={handleFilterChange}
                className="p-2 w-full sm:w-auto border-b sm:border-b-0 border-gray-300"
              >
                <option value="">Employment Type</option>
                <option value="Full-time">Full-Time</option>
                <option value="Part-time">Part-Time</option>
              </select>
              <button className="px-4 py-2 bg-yellow-400 rounded sm:rounded-tr sm:rounded-br border border-gray-300 mt-2 sm:mt-0">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col sm:flex-row px-4 sm:px-10 space-y-5 sm:space-y-0 sm:space-x-5">
          {/* Job Cards */}
          <div className="flex-1 flex flex-col space-y-3">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {error ? (
                <p className="text-red-600">{error}</p>
              ) : jobs.length === 0 ? (
                <p className="text-gray-600">No jobs available at the moment.</p>
              ) : currentJobs.length === 0 ? (
                <p className="alert alert-danger w-full col-span-full text-center">
                  !! No Jobs Found !!
                </p>
              ) : (
                currentJobs.map((job) => (
                  <ApplicationCard
                    application={{ ...job, ...job.job_data }}
                    key={job._id}
                    handleCardClick={() => setSelectedJob(job)}
                    isSaved={
                      userRole === "superadmin" || userRole === "admin"
                        ? undefined
                        : savedJobs.includes(job._id)
                    }
                  />
                ))
              )}
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={filteredJobs.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>

          {/* Side Preview (Hidden on Mobile) */}
          {/* <div className="hidden sm:block">
            <SidePreview
              selectedItem={selectedJob}
              handleViewItem={() => navigate(`/job-preview/${selectedJob._id}`)}
              setSelectedItem={setSelectedJob}
              isSaved={
                userRole === "superadmin" || userRole === "admin"
                  ? undefined
                  : savedJobs.includes(selectedJob?._id)
              }
              fetchSavedJobs={fetchSavedJobs}
            />
          </div> */}

          {/* Mobile Job Preview Modal */}
          {/* {selectedJob && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center sm:hidden">
              <div className="bg-white w-full max-w-md p-4 rounded-lg relative">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="absolute top-2 right-2 text-gray-600"
                >
                  <FiX size={24} />
                </button>
                <SidePreview
                  selectedItem={selectedJob}
                  handleViewItem={() =>
                    navigate(`/job-preview/${selectedJob._id}`)
                  }
                  setSelectedItem={setSelectedJob}
                  isSaved={
                    userRole === "superadmin" || userRole === "admin"
                      ? undefined
                      : savedJobs.includes(selectedJob?._id)
                  }
                  fetchSavedJobs={fetchSavedJobs}
                />
              </div>
            </div> */}
          
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}