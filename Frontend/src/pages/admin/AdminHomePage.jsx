import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaListAlt, FaCheck, FaBook, FaTrophy, FaUserPlus ,FaUsers } from "react-icons/fa";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import Cookies from 'js-cookie';
import ApplicationCard from "../../components/Students/ApplicationCard";
import Pagination from "../../components/Admin/pagination"; // Import Pagination component

const AdminHome = () => {
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [deptFilter, setdeptFilter] = useState("All");
  const [error, setError] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [activeButton, setActiveButton] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [currentJobPage, setCurrentJobPage] = useState(1);
  const [currentInternPage, setCurrentInternPage] = useState(1);
  const itemsPerPage = 3;

  const approvedCount = jobs.filter((job) => job.is_publish === true).length;
  const rejectedCount = jobs.filter((job) => job.is_publish === false).length;
  const pendingCount = jobs.filter((job) => job.is_publish === null).length;

  const cardsData = [
    { title: "Overall", count: jobs.length + internships.length, icon: <FaListAlt /> },
    { title: "Total Job Listings", count: jobs.length, icon: <FaCheck /> },
    { title: "Total Internship Listings", count: internships.length, icon: <FaBook /> },
    { title: "Approved Jobs", count: approvedCount, icon: <FaCheck /> },
    { title: "Rejected Jobs", count: rejectedCount, icon: <FaTrophy /> },
    { title: "Pending Approvals", count: pendingCount, icon: <FaUserPlus /> },
    { title: "Total Students", count: studentCount, icon: <FaUsers /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('jwt');
        if (!token) {
          setError("JWT token missing.");
          return;
        }

        const response = await axios.get("http://localhost:8000/api/get-jobs/", {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        });

        // Separate jobs and internships based on the 'type' field
        const jobsData = response.data.jobs.filter(item => item.type === "job");
        const internshipsData = response.data.jobs.filter(item => item.type === "internship");

        setJobs(jobsData);
        setInternships(internshipsData);
        setFilteredJobs(jobsData);
        setFilteredInterns(internshipsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/students/");
        setStudents(response.data.students);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load student data.");
      }
    };

    fetchData();
    fetchStudents();
  }, []);

  useEffect(() => {
    let filteredJobsData = jobs;
    let filteredInternsData = internships;

    if (filter === "Approved") {
      filteredJobsData = approvedJobs;
      filteredInternsData = approvedInternships;
    } else if (filter === "Rejected") {
      filteredJobsData = rejectedJobs;
      filteredInternsData = rejectedInternships;
    } else if (filter === "Pending Approvals") {
      filteredJobsData = pendingJobs;
      filteredInternsData = pendingInternships;
    }

    setFilteredJobs(filteredJobsData);
    setFilteredInterns(filteredInternsData);
  }, [filter, jobs, internships]);

  useEffect(() => {
    if (searchPhrase === "") {
      setFilteredJobs(jobs);
      setFilteredInterns(internships);
    } else {
      setFilteredJobs(jobs.filter((job) =>
        job.job_data.title.toLowerCase().includes(searchPhrase) ||
        job.job_data.company_name.toLowerCase().includes(searchPhrase) ||
        job.job_data.job_description.toLowerCase().includes(searchPhrase) ||
        job.job_data.required_skills.some(skill => skill.toLowerCase().includes(searchPhrase)) ||
        job.job_data.work_type.toLowerCase().includes(searchPhrase)
      ));

      setFilteredInterns(internships.filter((internship) =>
        internship.internship_data.title.toLowerCase().includes(searchPhrase) ||
        internship.internship_data.company_name.toLowerCase().includes(searchPhrase) ||
        internship.internship_data.job_description.toLowerCase().includes(searchPhrase) ||
        internship.internship_data.required_skills.some(skill => skill.toLowerCase().includes(searchPhrase))
      ));
    }
  }, [searchPhrase, jobs, internships]);

  useEffect(() => {
    function dateDiff(deadline) {
      const deadDate = new Date(deadline);
      const today = Date.now();
      const timeDifference = deadDate.getTime() - today;
      return Math.floor(timeDifference / (1000 * 3600 * 24)); // Returns whole days difference
    }

    if (activeButton === "Active Postings") {
      setFilteredJobs(jobs.filter((job) => dateDiff(job.job_data.application_deadline) >= 0));
      setFilteredInterns(internships.filter((internship) => dateDiff(internship.internship_data.application_deadline) >= 0));
    } else if (activeButton === "Expired Postings") {
      setFilteredJobs(jobs.filter((job) => dateDiff(job.job_data.application_deadline) < 0));
      setFilteredInterns(internships.filter((internship) => dateDiff(internship.internship_data.application_deadline) < 0));
    }
  }, [activeButton, jobs, internships]);

  useEffect(() => {
    if (deptFilter === "All") {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter((job) => job.job_data.selectedCategory === deptFilter));
    }
  }, [deptFilter, jobs]);

  const handleButtonClick = (status) => {
    setActiveButton(status);
    setFilter(status === "All" ? "All" : status);
    setShowFilterOptions(false);
  };

  // Pagination logic for jobs
  const indexOfLastJob = currentJobPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handleJobPageChange = (pageNumber) => {
    setCurrentJobPage(pageNumber);
  };

  // Pagination logic for internships
  const indexOfLastIntern = currentInternPage * itemsPerPage;
  const indexOfFirstIntern = indexOfLastIntern - itemsPerPage;
  const currentInterns = filteredInterns.slice(indexOfFirstIntern, indexOfLastIntern);

  const handleInternPageChange = (pageNumber) => {
    setCurrentInternPage(pageNumber);
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-auto bg-gray-100">
      <AdminPageNavbar />
      <header className="flex flex-col items-center justify-center py-6 container self-center">
        <p className="text-4xl font-bold tracking-[0.8px]">Admin Dashboard</p>
        <p className="text-lg mt-2 text-center text-gray-600">
          Explore all the Postings in all the existing fields around the globe.
        </p>
      </header>
      <div className="w-[80%] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {cardsData.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-normal text-sm text-gray-500">{card.title}</span>
                  <span className="text-2xl font-semibold text-gray-800">{card.count}</span>
                </div>
                <div className="p-2 bg-yellow-500 text-white rounded flex items-center justify-center shadow-sm">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Section with Yellow Navigation */}
        <div className="flex justify-between items-center my-6">
          <div className="flex text-sm gap-4">
            {["All", "Approved", "Rejected", "Pending Approvals"].map((status) => (
              <button
                key={status}
                className={`px-4 rounded-full py-1 ${filter === status ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Render Job Cards */}
        <div className="w-full self-center mt-6">
          <h2 className="text-2xl font-bold mb-4">Job Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-stretch">
            {error ? (
              <p className="text-red-600">{error}</p>
            ) : jobs.length === 0 ? (
              <p className="text-gray-600">No jobs available at the moment.</p>
            ) : currentJobs.length === 0 ? (
              <p className="alert alert-danger w-full col-span-full text-center">!! No Jobs Found !!</p>
            ) : (
              currentJobs.map((job) => (
                <ApplicationCard key={job._id} application={{ ...job, ...job.job_data }} />
              ))
            )}
          </div>
          <Pagination
            currentPage={currentJobPage}
            totalItems={filteredJobs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handleJobPageChange}
          />
        </div>

        {/* Render Internship Cards */}
        <div className="w-full self-center mt-6">
          <h2 className="text-2xl font-bold mb-4">Internship Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-stretch">
            {error ? (
              <p className="text-red-600">{error}</p>
            ) : internships.length === 0 ? (
              <p className="text-gray-600">No internships available at the moment.</p>
            ) : currentInterns.length === 0 ? (
              <p className="alert alert-danger w-full col-span-full text-center">!! No Internships Found !!</p>
            ) : (
              currentInterns.map((internship) => (
                <ApplicationCard key={internship._id} application={{ ...internship, ...internship.internship_data }} />
              ))
            )}
          </div>
          <Pagination
            currentPage={currentInternPage}
            totalItems={filteredInterns.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handleInternPageChange}
          />
        </div>
      </div>
      <style>
        {`
          @keyframes countUp {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .count-up {
            animation: countUp 1s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default AdminHome;