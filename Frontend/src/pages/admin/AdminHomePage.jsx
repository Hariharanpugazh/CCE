import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaListAlt, FaCheck, FaBook, FaTrophy, FaUserPlus, FaUsers } from "react-icons/fa";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import Cookies from 'js-cookie';
import InternCard from "../../components/Admin/InternCard"; // Import InternCard
import { AppPages, Departments } from "../../utils/constants";
import { FiSearch } from "react-icons/fi";
import ApplicationCard from "../../components/Students/ApplicationCard";

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

  const approvedJobs = jobs.filter((job) => job.is_publish === true);
  const rejectedJobs = jobs.filter((job) => job.is_publish === false);
  const pendingJobs = jobs.filter((job) => job.is_publish === null);

  const approvedInternships = internships.filter((internship) => internship.is_publish === true);
  const rejectedInternships = internships.filter((internship) => internship.is_publish === false);
  const pendingInternships = internships.filter((internship) => internship.is_publish === null);

  const approvedCount = approvedJobs.length;
  const rejectedCount = rejectedJobs.length;
  const pendingCount = pendingJobs.length + pendingInternships.length;
  const studentCount = students.length;

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
    let filtered = jobs;

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

    setFilteredJobs(filtered);
  }, [filter, jobs]);


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

  return (
    <div className="flex flex-col w-full h-screen overflow-auto bg-gray-0">
      <AdminPageNavbar />
      <header className="flex flex-col items-center justify-center py-14 container self-center">
        <p className="text-6xl tracking-[0.8px]">Admin Dashboard</p>
        <p className="text-lg mt-2 text-center">
          Explore all the Postings in all the existing fields around the globe.
        </p>
      </header>
      <div className="w-[80%] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {cardsData.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm">
              <div className="p-4 flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-normal text-sm text-[#a0aec0] font-sans">{card.title}</span>
                  <span className="text-md text-[#2d3748] font-sans text-4xl">{card.count}</span>
                </div>
                <div className="p-2 bg-[#FFC800] text-sm text-white rounded flex items-center justify-center shadow-sm">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Section with Yellow Navigation */}
        <div className="flex justify-between items-center my-14">
          <div className="flex text-sm gap-4">
            {["All", "Approved", "Rejected", "Pending Approvals"].map((status) => (
              <button
                key={status}
                className={`px-4 rounded-[10000px] py-1 ${filter === status ? "text-blue-400 underline" : "text-gray-600 hover:text-gray-900"
                  }`}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-stretch">
          {filteredJobs.map((job) => (
            <ApplicationCard application={{ ...job, ...job.job_data }} key={job._id} handleCardClick={() => { setSelectedJob(job); }} isSaved={undefined} />
          ))}
        </div>
        <div className="w-full self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-stretch">
          {filteredInterns.map((internship) => (
            <ApplicationCard application={{ ...internship }} key={internship._id} handleCardClick={() => { setSelectedJob(internship); }} isSaved={undefined} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
