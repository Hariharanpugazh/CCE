import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FiFilter, FiSearch, FiSettings, FiMoreHorizontal } from "react-icons/fi";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import { LoaderContext } from "../../components/Common/Loader";
import bgimage from "../../assets/icons/Group 1.svg";

export default function AchievementDashboard() {
  const [achievements, setAchievements] = useState([]);
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [error, setError] = useState("");
  const { isLoading, setIsLoading } = useContext(LoaderContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  useEffect(() => {
    const fetchPublishedAchievements = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/api/published-achievement/");
        setAchievements(response.data.achievements);
        setFilteredAchievements(response.data.achievements);
      } catch (err) {
        console.error("Error fetching published achievements:", err);
        setError("Failed to load achievements.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishedAchievements();
  }, [setIsLoading]);

  const filters = ["Internship", "Job"];
  const companies = ["SNS Innovation Hub", "iHub", "EY"];

  useEffect(() => {
    let filtered = achievements;

    if (selectedFilter) {
      filtered = filtered.filter((achievement) => achievement.achievement_type === selectedFilter);
    }
    if (selectedCompany) {
      filtered = filtered.filter((achievement) => companies.includes(achievement.company_name));
    }
    if (searchQuery) {
      filtered = filtered.filter((achievement) =>
        achievement.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAchievements(filtered);
  }, [selectedFilter, selectedCompany, searchQuery, achievements]);

  return (
    <div className="flex flex-col  ml-0">
      <StudentPageNavbar />
      {/* Header Section */}
      <div className="text-center my-6 py-4">
        <h1 className="text-6xl tracking-[0.8px]">Achievement</h1>
        <p className="text-lg mt-2 text-center">Explore all the opportunities in all the existing fields around the globe.</p>
      </div>
      
      {/* Filters & Search Bar */}
      <div className="w-[25%] self-auto  mt-6 ml-35 flex justify-between items-center  p-2 rounded-xl">
        <div className="flex gap-3">
          {/* Job & Internship Filter */}
          <select
            className="px-2 py-2 text-sm bg-white rounded-full shadow-sm border border-gray-300 hover:bg-gray-200 transition"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="">Job Type</option>
            {filters.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          

        </div>
        
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search Student"
            className="pl-4 pr-10 py-2 text-sm bg-white rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="absolute right-3 top-3 text-gray-500" />
        </div>
      </div>
      
      {/* Achievements Grid */}
      <div className="w-[80%] self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : filteredAchievements.length === 0 ? (
          <p className="text-gray-600">No achievements available at the moment.</p>
        ) : (
          filteredAchievements.map((achievement) => (
            <div
              key={achievement._id}
              className="relative p-6 border-gray-300 rounded-xl shadow-lg bg-white flex flex-col items-center transition-transform duration-300 hover:scale-100 hover:shadow-xl"
            >
              
                {/* Background Image */}
                <img 
                  src={bgimage}
                  alt="Background" 
                  className="absolute top-0 left-0 w-full h-full object-contain "
                />
              {/* Background Image */}
              <img 
                src={bgimage}
                alt="Background" 
                className="absolute top-0 left-0 w-full h-full object-contain opacity-20"
              />
              
              {achievement.photo && (
                <img
                  src={`data:image/jpeg;base64,${achievement.photo}`}
                  alt="Achievement"
                  className="relative z-10 w-20 h-20 object-cover rounded-full border-4 border-gray-300 shadow-md"
                />
              )}
              <h2 className="text-lg font-semibold text-gray-900 mt-3 relative z-10">{achievement.name}</h2>
              <p className="text-gray-600 text-xs relative z-10">{achievement.achievement_type}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2 relative z-10">
                <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">{achievement.company_name}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
