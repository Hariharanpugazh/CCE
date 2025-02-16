import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import Filters from "../../components/Common/Filters";
import SidePreview from "../../components/Common/SidePreview";
import Pagination from "../../components/Admin/pagination";
import ApplicationCard from "../../components/Students/ApplicationCard";
import Cookies from "js-cookie";

export default function StudentInternshipDashboard() {
  const [internships, setInternships] = useState([]);
  const [error, setError] = useState("");
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [selectedIntern, setSelectedIntern] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const borderColor = "border-gray-300";

  const [isSalaryOpen, setIsSalaryOpen] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [isEmployTypeOpen, setIsEmployTypeOpen] = useState(false);
  const [isWorkModeOpen, setIsWorkModeOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [savedInterns, setSavedInterns] = useState([]);

  const [salaryRangeIndex, setSalaryRangeIndex] = useState(0);

  const [filters, setFilters] = useState({
    salaryRange: { min: 10000, max: 1000000 },
    experience: { value: 0, category: "under" },
    employmentType: {
      onSite: false,
      remote: false,
      hybrid: false
    },
    workingMode: {
      online: false,
      offline: false,
      hybrid: false
    },
    sortBy: "Relevance",
  });

  const clearFilters = () => {
    setFilters({
      salaryRange: { min: 10000, max: 1000000 },
      experience: { value: 0, category: "under" },
      employmentType: {
        onSite: false,
        remote: false,
        hybrid: false
      },
      workingMode: {
        online: false,
        offline: false,
        hybrid: false
      },
      sortBy: "Relevance",
    });
  };

  const filterArgs = {
    searchPhrase,
    clearFilters,
    isSalaryOpen,
    setIsSalaryOpen,
    salaryRangeIndex,
    setSalaryRangeIndex,
    filters,
    setFilters,
    isExperienceOpen,
    setIsExperienceOpen,
    isEmployTypeOpen,
    setIsEmployTypeOpen,
    isWorkModeOpen,
    setIsWorkModeOpen,
    isSortOpen,
    setIsSortOpen,
  };

  useEffect(() => {
    const fetchPublishedInternships = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/published-internship/");

        const internshipsWithType = response.data.internships.map((internship) => ({
          ...internship.internship_data,
          id: internship._id,
          type: "internship",
          status: internship.status,
          updated_at: internship.updated_at
        }));
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
    if (searchPhrase === "") {
      setFilteredInterns(internships);
    } else {
      setFilteredInterns(
        internships.filter(
          (intern) =>
            intern.title.toLowerCase().includes(searchPhrase) ||
            intern.company_name.toLowerCase().includes(searchPhrase) ||
            intern.job_description.toLowerCase().includes(searchPhrase) ||
            intern.required_skills.includes(searchPhrase) ||
            intern.internship_type.toLowerCase().includes(searchPhrase)
        )
      );
    }
  }, [searchPhrase, internships]);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      fetchSavedInternships();
    }
  }, []);

  const fetchSavedInternships = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;
      const response = await axios.get(`http://localhost:8000/api/saved-internships/${userId}/`);
      setSavedInterns(response.data.internships.map(internship => internship._id));
    } catch (err) {
      console.error("Error fetching saved internships:", err);
    }
  };

  const indexOfLastIntern = currentPage * itemsPerPage;
  const indexOfFirstIntern = indexOfLastIntern - itemsPerPage;
  const currentInterns = filteredInterns.slice(indexOfFirstIntern, indexOfLastIntern);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <StudentPageNavbar currentPage="jobs" />
      <header className="flex flex-col items-center justify-center py-14 container self-center w-full">
        <p className="text-6xl tracking-[0.8px]">
          Internships
        </p>
        <p className="text-lg mt-2 text-center">
          Explore all the internship opportunities
          in all the existing fields <br />around the globe.
        </p>
      </header>

      <div className="flex px-10 space-x-5 items-start w-full justify-center">
        {/* <Filters args={filterArgs} /> */}
        <div className="flex-1 max-w-[80%] flex flex-col space-y-3">
          <div className="flex items-stretch">
            <input type="text" value={searchPhrase} onChange={(e) => setSearchPhrase(e.target.value.toLocaleLowerCase())} placeholder={`Search Internships`} className={`w-full text-lg p-2 px-4 rounded-tl rounded-bl bg-white border border-r-[0px] hover:border-gray-400 outline-none ${borderColor}`} />
            <button className={`px-5 bg-yellow-400 rounded-tr rounded-br ${borderColor} border`}> Search </button>
          </div>

          <div className="w-full self-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
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
                <ApplicationCard key={intern.id} application={{ ...intern }} handleCardClick={() => { setSelectedIntern(intern); }} isSaved={savedInterns.includes(intern.id)} />
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

        <SidePreview selectedItem={selectedIntern}
          handleViewItem={() => { window.location.href = `/internship-preview/${selectedIntern.id}`; }}
          isSaved={savedInterns.includes(selectedIntern?.id)}
          fetchSavedJobs={fetchSavedInternships}
          setSelectedItem={setSelectedIntern} />
      </div>
    </div>
  );
}
