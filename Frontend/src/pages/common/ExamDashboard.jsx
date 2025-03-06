import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import ApplicationCard from "../../components/Students/ApplicationCard"; // Assuming this is reusable
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Footer from "../../components/Common/Footer";
import Pagination from "../../components/Admin/pagination"; // Reusing Pagination component
import SidePreview from "../../components/Common/SidePreview"; // Assuming this is reusable

export default function ExamDashboard() {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [error, setError] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");
  const [userRole, setUserRole] = useState(null);

  const [selectedExam, setSelectedExam] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const navigate = useNavigate();

  // Fetch published exams from the backend
  useEffect(() => {
    const fetchPublishedExams = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/published-exams/" // Adjust this endpoint as per your backend
        );
        const examsWithType = response.data.exams.map((exam) => ({
          ...exam,
          type: "exam",
          status: exam.status,
          updated_at: exam.updated_at,
        }));
        setExams(examsWithType);
        setFilteredExams(examsWithType);
      } catch (err) {
        console.error("Error fetching published exams:", err);
        setError("Failed to load exams.");
      }
    };

    fetchPublishedExams();
  }, []);

  // Set user role from JWT
  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Decoded JWT Payload:", payload);
      setUserRole(!payload.student_user ? payload.role : "student");
    }
  }, []);

  // Filter exams based on search phrase
  useEffect(() => {
    if (searchPhrase === "") {
      setFilteredExams(exams);
    } else {
      setFilteredExams(
        exams.filter(
          (exam) =>
            exam.exam_data.exam_title.toLowerCase().includes(searchPhrase) ||
            exam.exam_data.about_exam.toLowerCase().includes(searchPhrase) ||
            exam.exam_data.eligibility_criteria.toLowerCase().includes(searchPhrase) ||
            exam.exam_data.application_process.toLowerCase().includes(searchPhrase)
        )
      );
    }
    setCurrentPage(1);
  }, [searchPhrase, exams]);

  // Pagination logic
  const indexOfLastExam = currentPage * itemsPerPage;
  const indexOfFirstExam = indexOfLastExam - itemsPerPage;
  const currentExams = filteredExams.slice(indexOfFirstExam, indexOfLastExam);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      <div className="flex flex-col flex-1">
        {userRole === "student" && <StudentPageNavbar />}
        <header className="flex flex-col items-center justify-center py-14 container self-center">
          <p className="text-6xl tracking-[0.8px]">Exams</p>
          <p className="text-lg mt-2 text-center">
            Explore all the upcoming exams and opportunities <br />
            to advance your career.
          </p>
        </header>

        {/* Search Bar */}
        <div className="sticky ml-10 top-0 z-10 bg-white flex border border-gray-300 mr-11 mb-5">
          <input
            type="text"
            value={searchPhrase}
            onChange={(e) => setSearchPhrase(e.target.value.toLowerCase())}
            placeholder="Search Exams"
            className="w-full text-lg p-2 px-4 bg-white hover:border-gray-400 outline-none border-gray-300"
          />
          <div className="flex mr-5 justify-center items-center space-x-4">
            <select
              name="examType"
              className="p-2 border-l border-gray-300"
              onChange={(e) => {
                // Add filtering logic here if needed
                const value = e.target.value;
                if (value) {
                  setFilteredExams(exams.filter((exam) => exam.exam_data.exam_title.includes(value)));
                } else {
                  setFilteredExams(exams);
                }
              }}
            >
              <option value="">Exam Type</option>
              <option value="Entrance">Entrance</option>
              <option value="Competitive">Competitive</option>
            </select>
            <select
              name="eligibility"
              className="p-2 border-l border-gray-300"
              onChange={(e) => {
                const value = e.target.value;
                if (value) {
                  setFilteredExams(exams.filter((exam) =>
                    exam.exam_data.eligibility_criteria.toLowerCase().includes(value.toLowerCase())
                  ));
                } else {
                  setFilteredExams(exams);
                }
              }}
            >
              <option value="">Eligibility</option>
              <option value="Bachelor">Bachelor’s Degree</option>
              <option value="Master">Master’s Degree</option>
            </select>
          </div>
          <button className="px-13 bg-yellow-400 rounded-tr rounded-br border border-gray-300">
            Search
          </button>
        </div>

        <div className="flex px-10 space-x-5 items-start">
          {/* Exam Cards */}
          <div className="flex-1 flex flex-col space-y-3">
            <div className="w-full self-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {error ? (
                <p className="text-red-600">{error}</p>
              ) : exams.length === 0 ? (
                <p className="text-gray-600">No exams available at the moment.</p>
              ) : currentExams.length === 0 ? (
                <p className="alert alert-danger w-full col-span-full text-center">
                  !! No Exams Found !!
                </p>
              ) : (
                currentExams.map((exam) => (
                  <ApplicationCard
                    application={{ ...exam, ...exam.exam_data }}
                    key={exam._id}
                    handleCardClick={() => setSelectedExam(exam)}
                    isSaved={false} // Adjust if you implement saved exams functionality
                  />
                ))
              )}
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={filteredExams.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
            <Footer />
          </div>

          {/* Exam Preview */}
          <SidePreview
            selectedItem={selectedExam}
            handleViewItem={() => navigate(`/exam-preview/${selectedExam?._id}`)}
            setSelectedItem={setSelectedExam}
            isSaved={false} // Adjust if you implement saved exams functionality
            fetchSavedJobs={() => {}} // Replace with fetchSavedExams if implemented
          />
        </div>
      </div>
    </div>
  );
}