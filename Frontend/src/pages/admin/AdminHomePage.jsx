import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaListAlt, FaCheck, FaBook, FaTrophy, FaUserPlus, FaFilter } from "react-icons/fa";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import Cookies from 'js-cookie';
import ApplicationCard from "../../components/Students/ApplicationCard";

const AdminHome = () => {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [activeButton, setActiveButton] = useState(null);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const cardsData = [
    { title: "OverAll", count: 2, icon: <FaListAlt /> },
    { title: "Total Job Listings", count: 5, icon: <FaCheck /> },
    { title: "Approved", count: 0, icon: <FaBook /> },
    { title: "Rejected Jobs", count: 2, icon: <FaTrophy /> },
    { title: "Pending Approvals", count: 0, icon: <FaUserPlus /> },
  ];

  useEffect(() => {
    const fetchJobs = async () => {
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
        setJobs(response.data.jobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs.");
      }
    };
    fetchJobs();
  }, []);

  const handleButtonClick = (status) => {
    setActiveButton(status);
    setFilter(status === "All" ? "All" : status);
  };

  return (
    <div>
      <AdminPageNavbar />
      <div className="w-full h-screen overflow-auto p-8 bg-gray-0">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-gray-800 text-center">Admin Dashboard</h2>

          {/* Stats Cards Section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {cardsData.map((card, index) => (
              <div key={index} className="w-60 h-23 bg-white rounded-[19px] shadow-md">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="font-normal text-sm text-[#a0aec0] font-sans">{card.title}</span>
                    <span className="font-bold text-md text-[#2d3748] font-sans leading-[20px]">{card.count}</span>
                  </div>
                  <div className="w-[36px] h-[36px] bg-amber-400 text-lg text-white rounded-xl flex items-center justify-center shadow-[0px_3.5px_5.5px_#00000005]">
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex text-sm gap-4 ml-20">
              {['All', 'Approved', 'Rejected', 'Pending Approvals'].map((status) => (
                <button
                  key={status}
                  className={`px-4 rounded-[10000px] py-1 ${filter === status ? "bg-[#000975] text-white" : "text-gray-600 hover:text-gray-900"}`}
                  onClick={() => handleButtonClick(status)}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Search and Filter Icon */}
            <div className="flex items-center gap-4 mr-16">
              <div className="relative">
                <FaFilter
                  size={24}
                  className="cursor-pointer text-gray-600 hover:text-gray-900"
                  onClick={() => setShowFilterOptions(!showFilterOptions)}
                />
                {showFilterOptions && (
                  <div className="absolute top-8 right-0 bg-white shadow-md rounded-md w-40 p-2">
                    {['Active Jobs', 'Expired Jobs'].map((option) => (
                      <button
                        key={option}
                        className={`w-full text-left px-4 py-2 ${filter === option ? "bg-[#000975] text-white" : "text-gray-600 hover:text-gray-900"}`}
                        onClick={() => handleButtonClick(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Render Job Cards */}
          <div className="w-[80%] self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-stretch">
            {jobs.map((job) => (
              <ApplicationCard key={job._id} application={job.job_data} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

