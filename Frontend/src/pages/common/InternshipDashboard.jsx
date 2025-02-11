import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import PageHeader from "../../components/Common/StudentPageHeader";
import { AppPages } from "../../utils/constants";
import ApplicationCard from "../../components/Students/ApplicationCard";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import Filters from "../../components/Common/Filters";
import SidePreview from "../../components/Common/SidePreview";

export default function InternshipDashboard() {
  const [internships, setInternships] = useState([]);
  const [error, setError] = useState("");
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [selectedJob, setSelectedJob] = useState()

  const borderColor = "border-gray-300"

  const [isSalaryOpen, setIsSalaryOpen] = useState(false)
  const [isExperienceOpen, setIsExperienceOpen] = useState(false)
  const [isEmployTypeOpen, setIsEmployTypeOpen] = useState(false)
  const [isWorkModeOpen, setIsWorkModeOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  const [salaryRangeIndex, setSalaryRangeIndex] = useState(0)

  const handleViewJob = () => {
    if (selectedJob._id) {
      if (selectedJob.type === "internship") {
        navigate(`/internship-preview/${selectedJob._id}`);
      } else if (selectedJob.type === "job") {
        navigate(`/job-preview/${selectedJob._id}`);
      } else {
        console.error("Unknown application type:", selectedJob.type);
      }
    } else {
      console.error("ObjectId is missing in the application:", selectedJob);
    }
  };

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
    })
  }

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
  }
  // Fetch published internships from the backend
  useEffect(() => {
    const fetchPublishedInternships = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/published-internship/");
        const internshipsWithType = response.data.internships.map((internship) => ({
          ...internship.internship_data, // Extract internship_data
          id: internship._id, // Add id field
          type: "internship",
          updated_at: internship.updated_at // Add type field
        }));
        setInternships(internshipsWithType); // Set internships with type
        setFilteredInterns(internshipsWithType); // Update filtered internships
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
            intern.title.includes(searchPhrase) ||
            intern.company_name.includes(searchPhrase) ||
            intern.job_description.includes(searchPhrase) ||
            intern.required_skills.includes(searchPhrase) ||
            intern.internship_type.includes(searchPhrase)
        )
      );
    }
  }, [searchPhrase, internships]);

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
      <header className="flex flex-col items-center justify-center py-14 container self-center">
        <p className="text-6xl tracking-[0.8px]">
          Internships
        </p>
        <p className="text-lg mt-2 text-center">
          Explore all the internship opportunities
          in all the existing fields <br />around the globe.
        </p>
      </header>

      <div className="flex px-10 space-x-5 items-start">
        {/* filters */}
        <Filters args={filterArgs} />

        {/* Job cards */}
        <div className="flex-1 max-w-[80%] flex flex-col space-y-3">
          {/* search */}
          <div className="flex items-stretch">
            <input type="text" value={searchPhrase} onChange={(e) => setSearchPhrase(e.target.value.toLocaleLowerCase())} placeholder={`Search Jobs`} className={`w-full text-lg p-2 px-4 rounded-tl rounded-bl bg-white border border-r-[0px] hover:border-gray-400 outline-none ${borderColor}`} />
            <button className={`px-5 bg-yellow-400 rounded-tr rounded-br ${borderColor} border`}> Search </button>
          </div>

          {/* jobs */}
          <div className="w-full self-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
            {error ? (
              <p className="text-red-600">{error}</p>
            ) : internships.length === 0 ? (
              <p className="text-gray-600">No internships available at the moment.</p>
            ) : filteredInterns.length === 0 ? (
              <p className="alert alert-danger w-full col-span-full text-center">
                !! No Internships Found !!
              </p>
            ) : (
              filteredInterns.map((intern) => (
                <ApplicationCard key={intern.id} application={{ ...intern }} handleCardClick={() => { setSelectedJob(intern); console.log(intern) }} />
              ))
            )}
          </div>
        </div>

        {/* job preview */}
        <SidePreview selectedItem={selectedJob} handleViewJob={handleViewJob} setSelectedItem={setSelectedJob} />
      </div>
    </div>
  );
}
