import { useEffect, useState } from "react";
import axios from "axios";
import { AppPages } from "../../utils/constants";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import PageHeader from "../../components/Common/StudentPageHeader";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import ApplicationCard from "../../components/Students/ApplicationCard"; 

export default function AdminInternShipDashboard() {
    const [internships, setInternships] = useState([]);
    const [filter, setFilter] = useState("All");
    const [error, setError] = useState("");
    const [filteredInterns, setFilteredInterns] = useState([])
    const [searchPhrase, setSearchPhrase] = useState("")

    // Fetch published internships from the backend
  useEffect(() => {
    const fetchPublishedInternships = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/published-internship/");
            const internshipsWithType = response.data.internships.map((internship) => ({
                ...internship,
                type: "internship", // Add type field
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
      setFilteredInterns(internships)
    } else {
      setFilteredInterns(internships.filter((intern) => intern.title.includes(searchPhrase)
        ||
        intern.company_name.includes(searchPhrase)
        ||
        intern.job_description.includes(searchPhrase)
        ||
        intern.skills_required.includes(searchPhrase)
        ||
        intern.internship_type.includes(searchPhrase)
      ))
    }
  }, [searchPhrase])

    return <div className="flex flex-col">
        <AdminPageNavbar />
        <PageHeader page={AppPages.internShipDashboard} filter={filter} setFilter={setFilter} />

        {/* Internship cards */}
        <div className="w-[80%] self-center mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {error ? (
            <p className="text-red-600">{error}</p>
        ) : internships.length === 0 ? (
            <p className="text-gray-600">No internships available at the moment.</p>
        ) : (
            filteredInterns.length === 0 ? <p className="alert alert-danger w-full col-span-full text-center">
            !! No Internships Found !!
            </p>
            :
            filteredInterns.map((intern) => (
                <ApplicationCard application={{ ...intern }} />
            ))
        )}
        </div>
    </div>
}