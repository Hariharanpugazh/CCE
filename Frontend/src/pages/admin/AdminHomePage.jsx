import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaListAlt, FaCheck, FaBook, FaTrophy, FaUserPlus, FaFilter } from "react-icons/fa";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";

const AdminHome = () => {
  const [internships, setInternships] = useState([]);
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

          {/* Create Test Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="w-full max-w-md cursor-pointer">
              <div className="flex-col relative overflow-hidden h-auto text-foreground box-border outline-none focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 shadow-medium transition-transform-background motion-reduce:transition-none p-12 bg-transparent border-2 border-dashed rounded-2xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-plus w-12 h-12 bg-transparent rounded-full text-gray-500"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
                <h2 className="m-2 mb-2 text-gray-500">Create Your Job Here...</h2>
              </div>
            </div>

            {/* Test Status Section */}
            <TestStatusCard
              status="Jobs Permanent"
              assigned={4}
              completed={1}
              yetToComplete={3}
              date="02/04/2025"
              time="03:00 PM"
              type="MCQ"
            />
            <TestStatusCard
              status="Jobs Internship"
              assigned={9}
              completed={4}
              yetToComplete={5}
              date="01/29/2025"
              time="11:57 PM"
              type="MCQ"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TestStatusCard = ({ status, assigned, completed, yetToComplete, date, time, type }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{status}</h3>
  </div>
);

export default AdminHome;
