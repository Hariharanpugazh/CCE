import React, { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import {
  Mail,
  Bell,
  Briefcase,
  GraduationCap,
  BookOpen,
  Trophy,
  Search,
  X,
  Send,
  Eye, // Import Eye icon
  CheckCircle, // Import CheckCircle icon for Approved
  XCircle, // Import XCircle icon for Rejected
  Clock, // Import Clock icon for Pending
} from "lucide-react";
import { LoaderContext } from "../../components/Common/Loader"; // Import Loader Context
import Pagination from "../../components/Admin/pagination"; // Import Pagination component
import approvedIcon from "../../assets/icons/Approved 1.png";
import rejectedIcon from "../../assets/icons/rejected 1.png";
import pendingIcon from "../../assets/icons/pending 1.png"; // Corrected import for pending icon
import { FaEye } from "react-icons/fa"; // Import FaEye icon

export default function AdminMail() {
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("notifications"); // Set default tab to notifications
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const token = Cookies.get("jwt");
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useContext(LoaderContext); // Use Loader Context
  const [currentPage, setCurrentPage] = useState(1); // Add state for current page
  const itemsPerPage = 6; // Define items per page

  useEffect(() => {
    if (!token) {
      setError("JWT token not found!");
      setIsLoading(false);
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true); // Show loader when fetching data
      try {
        const response = await fetch("http://localhost:8000/api/mailjobs/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch data");
        }

        const data = await response.json();
        setJobs(data.jobs);
        setInternships(data.internships);
        setAchievements(data.achievements);
        setStudyMaterials(data.study_materials);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false); // Hide loader after data fetch
      }
    };

    const fetchReview = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/fetch-review/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch review");
        }

        const data = await response.json();
        let reviewsData = data.reviews || [];
        if (Array.isArray(reviewsData)) {
          // Sort reviews by timestamp in descending order
          reviewsData = reviewsData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setReviews(reviewsData);
        } else {
          console.error("Unexpected data format:", reviewsData);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
    fetchReview();
  }, [token, navigate, setIsLoading]);

  if (isLoading) {
    return <div className="text-center text-gray-500"></div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const paginate = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const filteredItems = reviews.filter(
    (item) =>
      item.job_data?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.internship_data?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.study_material_data?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.item_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
    let itemsToDisplay = [];

    switch (activeTab) {
      case "notifications":
        itemsToDisplay = reviews;
        break;
      default:
        return null;
    }

    return (
      <section>
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            paginate(filteredItems).map((item) => ( // Apply pagination
              <motion.div
                key={item._id || item.review_id}
                className="p-2 bg-white shadow-md rounded-lg hover:shadow-lg transition duration-300 cursor-pointer border border-gray-400"
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">
                    {item.job_data?.title ||
                      item.internship_data?.title ||
                      item.name ||
                      item.study_material_data?.title ||
                      item.item_name ||
                      "Notification"}
                    {item.item_type && (
                      <span className="ml-2 text-xs px-2 py-1 rounded bg-gray-200 text-black-400">
                        {item.item_type}
                      </span>
                    )}
                  </span>
                  {item.study_material_data ? null : (
                    <div className="flex space-x-2">
                      {activeTab !== "notifications" && <>
                        <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">
                          {item.status}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${item.is_publish === true
                            ? "bg-green-200 text-green-800"
                            : item.is_publish === false
                              ? "bg-red-200 text-red-800"
                              : "bg-yellow-200 text-yellow-800"
                            }`}
                        >
                          {item.is_publish === true
                            ? "Approved"
                            : item.is_publish === false
                              ? "Rejected"
                              : "Pending"}
                        </span>
                      </>}
                    </div>
                  )}
                  <div className="flex justify-center items-center space-x-2 mt-2">
                      <span className="bg-red-500 text-white px-4 py-2  rounded-lg text-sm flex items-center">
                        Rejected  <img src={rejectedIcon} alt="Rejected" className="ml-1 text-xs mr-1" width={20} height={10} />  
                      </span>
                    <button className="text-black border px-3 py-2 rounded-lg text-sm flex items-center gap-1">
                      View
                      <FaEye size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 ">
                  {item.job_data?.company_name ||
                    item.internship_data?.company_name ||
                    item.achievement_description ||
                    item.study_material_data?.description ||
                    ` Feedback: ${item.feedback}`}
                </p>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-600">No items found.</p>
          )}
        </div>
      </section>
    );
  };

  const renderPreview = () => {
    if (!selectedItem) return null;

    const {
      job_data,
      internship_data,
      achievement_description,
      study_material_data,
      is_publish,
      item_type,
      item_id,
      feedback, // Added feedback field
    } = selectedItem;

    return (
      <div className="flex-1 relative p-4 bg-gray-100 rounded-lg shadow-xl">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-300"
          onClick={() => setSelectedItem(null)}
        >
          <X className="h-5 w-5" />
        </button>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-300 text-gray-700 text-lg">
              {selectedItem.name ? selectedItem.name[0] : "A"}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                {job_data?.title ||
                  internship_data?.title ||
                  selectedItem.name ||
                  study_material_data?.title ||
                  selectedItem.item_name ||
                  "Notification"}
              </h2>
              <div className="flex justify-between items-center text-sm text-gray-500">
                {activeTab !== "notifications" && <>
                  <span>
                    {job_data?.company_name ||
                      internship_data?.company_name ||
                      "Company Name"}
                  </span>
                  <span>
                    {is_publish === true
                      ? "Approved"
                      : is_publish === false
                        ? "Rejected"
                        : "Pending"}
                  </span>
                </>}
              </div>
              {/* Feedback Section */}
              {feedback && (
                <div className="mt-2 text-sm text-gray-700 bg-gray-100 p-2 rounded">
                  <strong>Feedback:</strong> {feedback}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="border-t my-4" />
        <div className="whitespace-pre-wrap text-sm text-gray-700">
          {job_data?.job_description ||
            internship_data?.job_description ||
            achievement_description ||
            study_material_data?.description}
        </div>
        {job_data && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-gray-600 font-semibold">Experience:</p>
              <p className="text-sm">{job_data.experience_level}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Salary:</p>
              <p className="text-sm">{job_data.salary_range}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Location:</p>
              <p className="text-sm">{job_data.job_location}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Work Type:</p>
              <p className="text-sm">{job_data.selectedWorkType}</p>
            </div>
          </div>
        )}
        {internship_data && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-gray-600 font-semibold">Duration:</p>
              <p className="text-sm">{internship_data.duration}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Stipend:</p>
              <p className="text-sm">{internship_data.stipend}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Location:</p>
              <p className="text-sm">{internship_data.location}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Type:</p>
              <p className="text-sm">{internship_data.internship_type}</p>
            </div>
          </div>
        )}
        {study_material_data && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-gray-600 font-semibold">Category:</p>
              <p className="text-sm">{study_material_data.category}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Content:</p>
              <p className="text-sm">{study_material_data.text_content}</p>
            </div>
          </div>
        )}
        {item_type && (
          <div className="mt-4 text-center">
            <Link
              to={
                item_type === "internship"
                  ? `/internship-edit/${item_id}`
                  : `/job-edit/${item_id}`
              }
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md inline-block"
            >
              Edit
            </Link>
          </div>
        )}
        {!item_type && (
          <div className="mt-4">
            <a
              href={job_data?.job_link || internship_data?.job_link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-center inline-block"
            >
              {job_data
                ? "Apply Now"
                : internship_data
                  ? "Apply Now"
                  : "View More"}
            </a>
          </div>
        )}
      </div>

    );
  };

  return (
    <div className="flex flex-col h-screen">
      <AdminPageNavbar />
      <div className="flex flex-1 p-6 space-x-6 ml-62 mr-9 overflow-hidden"> {/* Remove scroll */}
        {/* Email List */}
        <div className="w-3/3 flex flex-col space-y-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 px-4 py-2 border rounded-md w-full"
              />
            </div>
          </div>
          <div className=" p-6 rounded-lg shadow-lg border border-gray-400">
            {renderContent()}
          </div>
          <div className="px-6">
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={filteredItems.length} onPageChange={setCurrentPage} />
          </div>
        </div>
        {/* Email Preview */}
        {selectedItem && (
          <div className="flex justify-center items-start mt-14 w-2/3 p-6">
            {renderPreview()}
          </div>
        )}
      </div>
    </div>
    
  );
}