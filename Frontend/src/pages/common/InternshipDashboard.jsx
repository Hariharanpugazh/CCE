import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import PageHeader from "../../components/Common/StudentPageHeader";
import ApplicationCard from "../../components/Students/ApplicationCard";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { FiMenu, FiX } from "react-icons/fi";
import Footer from "../../components/Common/Footer";
import { useNavigate } from "react-router-dom";
import SidePreview from "../../components/Common/SidePreview";
import Pagination from "../../components/Admin/pagination";

export default function InternshipDashboard() {
  const [internships, setInternships] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [error, setError] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [selectedIntern, setSelectedIntern] = useState();
  const [savedInterns, setSavedInterns] = useState([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [stipendRange, setStipendRange] = useState("");

  const navigate = useNavigate();
  const borderColor = "border-gray-300";

  useEffect(() => {
    setFilteredInterns(internships);
  }, [internships]);

  useEffect(() => {
    const fetchPublishedInternships = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/published-internship/"
        );
        const internshipsWithType = response.data.internships.map(
          (internship) => ({
            ...internship.internship_data,
            id: internship._id,
            type: "internship",
            status: internship.status,
            updated_at: internship.updated_at,
            total_views: internship.total_views,
          })
        );
        setInternships(internshipsWithType);
        setFilteredInterns(internshipsWithType);
      } catch (err) {
        console.error("Error fetching published internships:", err);
        setError("Failed to load internships.");
      }
    };
    fetchPublishedInternships();
  }, []);

  useEffect(() => {
    if (searchPhrase === "" && location === "" && duration === "" && stipendRange === "") {
      setFilteredInterns(internships);
    } else {
      setFilteredInterns(
        internships.filter((intern) => {
          const [minStipend, maxStipend] = stipendRange.split("-").map(Number) || [0, Infinity];
          return (
            (intern.title.toLowerCase().includes(searchPhrase) ||
              intern.company_name.toLowerCase().includes(searchPhrase) ||
              intern.job_description.toLowerCase().includes(searchPhrase) ||
              (Array.isArray(intern.required_skills) && 
                intern.required_skills.some(skill => skill.toLowerCase().includes(searchPhrase))) ||
              intern.internship_type.toLowerCase().includes(searchPhrase)) &&
            (location === "" || intern.location.toLowerCase().includes(location)) &&
            (duration === "" || intern.duration.toLowerCase().includes(duration)) &&
            (stipendRange === "" || 
              (intern.stipend >= minStipend && intern.stipend <= maxStipend))
          );
        })
      );
    }
    setCurrentPage(1);
  }, [searchPhrase, location, duration, stipendRange, internships]);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(!payload.student_user ? payload.role : "student");
    }
  }, []);

  const fetchSavedInternships = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;
      const response = await axios.get(
        `http://localhost:8000/api/saved-internships/${userId}/`
      );
      setSavedInterns(response.data.internships.map((internship) => internship._id));
    } catch (err) {
      console.error("Error fetching saved internships:", err);
    }
  };

  useEffect(() => {
    if (userRole === "student") fetchSavedInternships();
  }, [userRole]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "location") setLocation(value);
    else if (name === "duration") setDuration(value);
    else if (name === "stipendRange") setStipendRange(value);
  };

  const clearFilters = () => {
    setSearchPhrase("");
    setLocation("");
    setDuration("");
    setStipendRange("");
  };

  const indexOfLastIntern = currentPage * itemsPerPage;
  const indexOfFirstIntern = indexOfLastIntern - itemsPerPage;
  const currentInterns = filteredInterns.slice(indexOfFirstIntern, indexOfLastIntern);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="sm:flex">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      <div className="flex flex-col flex-1">
        {userRole === "student" && <StudentPageNavbar />}

        <div className="flex flex-col flex-1">
          {/* Header */}
          <header className="flex flex-col items-center justify-center py-8 px-4 sm:py-14 container mx-auto text-center">
            <p className="text-3xl sm:text-6xl tracking-[0.8px]">Internships</p>
            <p className="text-base sm:text-lg mt-2">
              Explore all the internship opportunities in all the existing fields <br />
              around the globe.
            </p>
          </header>

          {/* Search Bar */}
          <div className="sticky top-0 z-10 bg-white px-4 sm:px-10 mb-5">
            <div className="flex flex-col sm:flex-row border border-gray-300">
              <div className="flex items-center w-full">
                <input
                  type="text"
                  value={searchPhrase}
                  onChange={(e) => setSearchPhrase(e.target.value.toLowerCase())}
                  placeholder="Search Internships"
                  className="w-full text-base sm:text-lg p-2 px-4 bg-white hover:border-gray-400 outline-none border-b sm:border-b-0 border-gray-300"
                />
                {/* Hamburger Button - Visible only on mobile */}
                <button 
                  className="sm:hidden p-2"
                  onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                >
                  {isMobileFiltersOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
              </div>
              
              {/* Filters - Original desktop layout preserved */}
              <div className={`
                ${isMobileFiltersOpen ? 'block' : 'hidden'} 
                sm:flex sm:flex-row sm:items-center sm:space-x-4 
                p-2 sm:border-l border-gray-300
              `}>
                <select
                  name="location"
                  onChange={handleFilterChange}
                  className="p-2 w-full sm:w-auto border-b sm:border-b-0 border-gray-300"
                >
                  <option value="">All Locations</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Mumbai">Mumbai</option>
                </select>
                <select
                  name="duration"
                  onChange={handleFilterChange}
                  className="p-2 w-full sm:w-auto border-b sm:border-b-0 border-gray-300"
                >
                  <option value="">Duration</option>
                  <option value="1 month">1 Month</option>
                  <option value="3 months">3 Months</option>
                  <option value="6 months">6 Months</option>
                </select>
                <select
                  name="stipendRange"
                  onChange={handleFilterChange}
                  className="p-2 w-full sm:w-auto border-b sm:border-b-0 border-gray-300"
                >
                  <option value="">Stipend Range</option>
                  <option value="3000-5000">3000-5000</option>
                  <option value="5000-8000">5000-8000</option>
                  <option value="8000-10000">8000-10000</option>
                  <option value="10000-15000">10000-15000</option>
                </select>
                <button className="px-8 py-2 bg-yellow-400 rounded sm:rounded-tr sm:rounded-br border border-gray-300 mt-2 sm:mt-0">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col sm:flex-row px-4 sm:px-10 space-y-5 sm:space-y-0 sm:space-x-5">
            {/* Internship Cards */}
            <div className="flex-1 flex flex-col space-y-3">
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {error ? (
                  <p className="text-red-600">{error}</p>
                ) : internships.length === 0 ? (
                  <p className="text-gray-600">No internships available at the moment.</p>
                ) : currentInterns.length === 0 ? (
                  <p className="alert alert-danger w-full col-span-full text-center">
                    !! No Internships Found !!
                  </p>
                ) : (
                  currentInterns.map((intern) => (
                    <ApplicationCard
                      application={intern}
                      key={intern.id}
                      handleCardClick={() => setSelectedIntern(intern)}
                      isSaved={
                        userRole === "superadmin" || userRole === "admin"
                          ? undefined
                          : savedInterns.includes(intern.id)
                      }
                    />
                  ))
                )}
              </div>
              <Pagination
                currentPage={currentPage}
                totalItems={filteredInterns.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </div>

            {/* Side Preview (Hidden on Mobile) */}
            {/* <div className="hidden sm:block">
              {selectedIntern && (
                <SidePreview
                  selectedItem={selectedIntern}
                  handleViewItem={() => navigate(`/internship-preview/${selectedIntern.id}`)}
                  setSelectedItem={setSelectedIntern}
                  isSaved={
                    userRole === "superadmin" || userRole === "admin"
                      ? undefined
                      : savedInterns.includes(selectedIntern?.id)
                  }
                  fetchSavedJobs={fetchSavedInternships}
                />
              )}
            </div>
          </div> */}

          {/* Mobile Internship Preview Modal */}
          {/* {selectedIntern && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center sm:hidden">
              <div className="bg-white w-full max-w-md p-4 rounded-lg relative">
                <button
                  onClick={() => setSelectedIntern(null)}
                  className="absolute top-2 right-2 text-gray-600"
                >
                  <FiX size={24} />
                </button>
                <SidePreview
                  selectedItem={selectedIntern}
                  handleViewItem={() => navigate(`/internship-preview/${selectedIntern.id}`)}
                  setSelectedItem={setSelectedIntern}
                  isSaved={
                    userRole === "superadmin" || userRole === "admin"
                      ? undefined
                      : savedInterns.includes(selectedIntern?.id)
                  }
                  fetchSavedJobs={fetchSavedInternships}
                />
              </div>
            </div>
          )} */}

          </div>
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}