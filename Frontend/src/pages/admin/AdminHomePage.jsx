import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaListAlt, FaCheck, FaBook, FaTrophy, FaUserPlus, FaUsers, FaArrowRight, FaCircle, FaUser, FaUserAlt } from "react-icons/fa";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import Cookies from "js-cookie";
import ApplicationCard from "../../components/Students/ApplicationCard";
import Pagination from "../../components/Admin/pagination"; // Import Pagination
import { Link } from "react-router-dom";

const AdminHome = () => {
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

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
    { title: "Total Job Listings", count: jobs.length, icon: <FaCheck />, Link: "/" },
    { title: "Total Internship Listings", count: internships.length, icon: <FaBook />, Link: "/" },
    { title: "Rejected Jobs", count: rejectedCount, icon: <FaTrophy />, Link: "/" },
    { title: "Pending Approvals", count: pendingCount, icon: <FaUserPlus />, Link: "/" },
  ];

  const [activeListing, setActiveListing] = useState("Jobs")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("jwt");
        if (!token) {
          setError("JWT token missing.");
          return;
        }

        const response = await axios.get("http://localhost:8000/api/get-jobs/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const jobsData = response.data.jobs.filter((item) => item.type === "job").map((job) => ({
          ...job,
          total_views: job.total_views, // Ensure total_views is included
        }));

        const internshipsData = response.data.jobs.filter((item) => item.type === "internship").map((internship) => ({
          ...internship,
          total_views: internship.total_views, // Ensure total_views is included
        }));

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

    if (filter === "Jobs") {
      filteredInternsData = [];
    } else if (filter === "Internships") {
      filteredJobsData = [];
    }

    setFilteredJobs(filteredJobsData);
    setFilteredInterns(filteredInternsData);
  }, [filter, jobs, internships]);

  useEffect(() => {
    if (searchPhrase === "") {
      setFilteredJobs(jobs);
      setFilteredInterns(internships);
    } else {
      setFilteredJobs(
        jobs.filter((job) =>
          job.job_data.title.toLowerCase().includes(searchPhrase) ||
          job.job_data.company_name.toLowerCase().includes(searchPhrase) ||
          job.job_data.job_description.toLowerCase().includes(searchPhrase) ||
          job.job_data.required_skills.some((skill) =>
            skill.toLowerCase().includes(searchPhrase)
          ) ||
          job.job_data.work_type.toLowerCase().includes(searchPhrase)
        )
      );

      setFilteredInterns(
        internships.filter((internship) =>
          internship.internship_data.title.toLowerCase().includes(searchPhrase) ||
          internship.internship_data.company_name.toLowerCase().includes(searchPhrase) ||
          internship.internship_data.job_description.toLowerCase().includes(searchPhrase) ||
          internship.internship_data.required_skills.some((skill) =>
            skill.toLowerCase().includes(searchPhrase)
          )
        )
      );
    }
  }, [searchPhrase, jobs, internships]);

  // Get paginated data
  const getPaginatedData = (data) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return data.slice(indexOfFirstItem, indexOfLastItem);
  };

  return (
    <div className="flex w-full h-screen bg-gray-100 overflow-hidden"> {/* Prevents overflow */}
      <AdminPageNavbar />

      <div className="flex flex-col space-y-4 p-4 flex-1 h-full"> {/* h-full to prevent double height issues */}
        {/* Heading */}
        <div>
          <p className="text-3xl"> Welcome Back Admin! </p>
          <p className="text-lg"> Here is your dashboard analytics. </p>
        </div>

        {/* Upload counts and recent requests */}
        <div className="flex space-x-4 flex-1">
          {/* Counts */}
          <div className="grid grid-cols-2 gap-4">
            {cardsData.map((category, key) => (
              <div key={key} className="bg-white rounded-xl p-4 flex flex-col justify-between space-y-2">
                <div className="flex space-x-2 items-center">
                  <div className="p-2 border rounded"> {category.icon} </div>
                  <p> {category.title} </p>
                </div>
                <p className="text-5xl pb-4 border-b border-gray-300"> {category.count} </p>
                <button className="flex items-center text-yellow-400 text-xs space-x-1"
                  onClick={() => window.location.href = category.Link}>
                  <p className="text-sm"> View All </p> <FaArrowRight />
                </button>
              </div>
            ))}
          </div>

          {/* Approval Requests Table */}
          <div className="flex flex-col rounded-lg bg-white flex-1">
            <div className="flex justify-between p-3 py-2">
              <p className="font-semibold">Recent Approval Requests</p>
              <p className="text-yellow-400 cursor-pointer">View All</p>
            </div>

            {/* Scrollable Table */}
            <div className="overflow-y-auto max-h-[250px]"> {/* Restrict height */}
              <table className="w-full rounded-lg">
                <thead>
                  <tr className="text-left border border-gray-400">
                    <th className="px-3 py-2 font-normal text-sm"><input type="checkbox" /></th>
                    <th className="px-3 py-2 font-normal text-sm">Title</th>
                    <th className="px-3 py-2 font-normal text-sm">Company</th>
                    <th className="px-3 py-2 font-normal text-sm">Staff Name</th>
                    <th className="px-3 py-2 font-normal text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...jobs, ...internships].map((item, index) => (
                    <tr key={index} className="text-left border-b border-gray-200 cursor-pointer" onClick={() => item.internship_data ? window.location.href = `/internship-preview/${item._id}` : window.location.href = `/job-preview/${item._id}`}>
                      <td className="px-3 py-2 font-normal text-sm"><input type="checkbox" /></td>
                      <td className="px-3 py-2 font-normal text-sm">{item.internship_data?.title ?? item.job_data?.title}</td>
                      <td className="px-3 py-2 font-normal text-sm">{item.internship_data?.company_name ?? item.job_data?.company_name}</td>
                      <td className="px-3 py-2 font-normal text-sm">{item.internship_data?.title ?? item.job_data?.title}</td>
                      <td className="px-3 py-2 font-normal text-sm">{item.internship_data?.title ?? item.job_data?.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Listings and Inbox */}
        <div className="flex space-x-4 flex-1 overflow-hidden"> {/* Prevents overflow */}
          {/* Listings */}
          <div className="flex-1 p-3 bg-white rounded-lg flex flex-col space-y-3 h-full overflow-hidden">
            <div className="flex justify-between text-lg pb-2 border-b border-gray-300 px-1 items-center">
              <p> All Listings </p>
              <p className="text-sm text-yellow-400"> View All </p>
            </div>

            <div className="flex space-x-3">
              {["Jobs", "Internships", "Achievements"].map(type => (
                <button key={type}
                  className={`px-3 py-1 rounded-lg cursor-pointer border ${activeListing === type ? "bg-yellow-200 border border-yellow-400" : "border-transparent"}`}
                  onClick={() => setActiveListing(type)}>
                  {type}
                </button>
              ))}
            </div>

            <div className="flex flex-col space-y-3 justify-between h-full overflow-y-auto max-h-[300px]"> {/* Scroll Fix */}
              {
                {
                  Jobs: [...jobs],
                  Internships: [...internships],
                  Achievements: [...jobs]
                }[activeListing].slice(0, 6).map((listing, key) => (
                  <div key={key} className="flex space-x-2 items-stretch">
                    <div className="flex items-center justify-between flex-1 border border-gray-400 rounded p-3 py-2">
                      {/* Left Section */}
                      <div className="flex items-center flex-1 space-x-2 min-w-0">
                        <FaCircle color="#009946" size={6} />

                        {/* Title */}
                        <p className="font-semibold flex-1 text-center truncate min-w-0">
                          {listing.internship_data?.title ?? listing.job_data?.title}
                        </p>

                        {/* Company Name */}
                        <p className="text-sm text-gray-400 flex-1 truncate min-w-0">
                          {listing.internship_data?.company_name ?? listing.job_data?.company_name}
                        </p>
                      </div>

                      {/* Right Section */}
                      <p className="text-xs text-right w-1/4 min-w-fit">Updated 2 days ago</p>
                    </div>
                    <button className="px-6 p-1 border rounded cursor-pointer border-gray-400 text-sm" onClick={() => listing.internship_data ? window.location.href = `/internship-edit/${listing._id}` : window.location.href = `/job-edit/${listing._id}`}>Edit</button>
                    <button className="px-3 p-1 bg-yellow-400 rounded cursor-pointer text-sm" onClick={() => listing.internship_data ? window.location.href = `/internship-preview/${listing._id}` : window.location.href = `/job-preview/${listing._id}`}>View details</button>
                  </div>
                ))
              }
              <p className="text-yellow-400 text-center cursor-pointer"> Show all listings </p>
            </div>
          </div>

          {/* Inbox */}
          <div className="w-1/3 bg-white rounded-lg h-full p-3 overflow-y-auto space-y-4"> {/* Fixed height issue */}
            <div className="flex justify-between  items-centertext-lg pb-2 border-b border-gray-300 px-1">
              <p> Inbox </p>
              <p className="text-sm text-yellow-400"> View All </p>
            </div>

            <div className="flex flex-col space-y-3">
              {
                [...jobs, ...internships].slice(0, 6).map((listing, key) =>
                  (listing.is_publish !== null) && (
                    <div key={key} className="border border-gray-300 rounded flex space-x-3 p-2 py-3 items-center">
                      <span className="p-2"> <FaUserAlt /></span>
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-3 text-lg">
                          <p>Super Admin</p>
                          <FaCircle color={listing.is_publish ? "#009946" : "#EF3826"} size={6} />
                        </div>
                        <p className="text-xs">
                          Your {listing.internship_data ? "Internship" : "Job"} listing <span className="font-semibold">{listing.internship_data?.title ?? listing.job_data?.title}</span> has been {listing.is_publish ? "Approved" : "Rejected"}.
                        </p>
                      </div>
                    </div>
                  )
                )
              }
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
