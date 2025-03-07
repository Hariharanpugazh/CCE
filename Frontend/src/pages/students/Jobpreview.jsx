"use client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaUserTie,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBuilding,
  FaClock,
  FaLaptop,
  FaTruckMoving,
  FaFileAlt,
  FaClipboardList,
  FaRegCalendarAlt,
  FaLightbulb,
  FaGlobe,
  FaCode,
  FaPlus,
  FaSmile,
  FaBookmark,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaCheck,
  FaListOl,
} from "react-icons/fa";
// Import a placeholder image directly
import placeholderImage from "../../assets/images/Null.png";

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

const JobPreview = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [saved, setSaved] = useState(false);
  const [showApplySuccess, setShowApplySuccess] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.student_user) {
          setUserId(payload.student_user);
        }
      } catch (error) {
        console.error("Invalid JWT token:", error);
      }
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/job/${id}/`)
      .then((response) => response.json())
      .then((data) => {
        setJob(data.job);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching job:", error);
        setLoading(false);
      });
  }, [id]);

  const handleApplyClick = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;
      await axios.post("http://localhost:8000/api/apply-job/", {
        studentId: userId,
        jobId: id,
      });
      setShowApplySuccess(true);
      setTimeout(() => {
        setShowApplySuccess(false);
        window.open(job.job_data.job_link, "_blank", "noopener noreferrer");
      }, 2000);
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };

  const handleSaveJob = async () => {
    try {
      if (!userId) {
        console.error("User ID is not available");
        return;
      }

      // Check if we're saving or unsaving
      const endpoint = saved
        ? `http://localhost:8000/api/unsave-job/${id}/`
        : `http://localhost:8000/api/save-job/${id}/`;

      const response = await axios.post(endpoint, {
        userId: userId,
      });

      console.log("Save/unsave job response:", response.data);

      // Toggle saved state
      setSaved(!saved);
      setShowSaveSuccess(true);
      setTimeout(() => {
        setShowSaveSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error saving/unsaving job:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
      }
    }
  };

  useEffect(() => {
    const fetchAllJobs = async () => {
      if (userId && userRole !== "admin" && userRole !== "superadmin") {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/published-jobs/`
          );
          // You might want to do something with the response here
        } catch (error) {
          console.error("Error checking if job is saved:", error);
        }
      }
    };
  
    fetchAllJobs();
  }, [userId, userRole]);
  

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <StudentPageNavbar />
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="animate-pulse flex flex-col items-center bg-white p-8 rounded-xl shadow-md max-w-md w-full">
            <div className="h-16 w-16 rounded-full bg-gray-200 mb-6"></div>
            <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-2 gap-4 w-full mb-6">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
            <p className="text-gray-500 mt-6 text-center">
              Loading job details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <StudentPageNavbar />
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
              <FaInfoCircle className="text-red-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Job Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The job you're looking for could not be found or may have been
              removed.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <StudentPageNavbar />

      {/* Success notification for applying */}
      {showApplySuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-200 text-green-800 px-6 py-3 rounded-lg shadow-lg flex items-center">
          <FaCheck className="mr-2" />
          Application submitted successfully! Redirecting...
        </div>
      )}

      {/* Success notification for saving */}
      {showSaveSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-200 text-green-800 px-6 py-3 rounded-lg shadow-lg flex items-center">
          <FaCheck className="mr-2" />
          Job saved successfully!
        </div>
      )}

      <div className="flex-grow p-4 sm:p-6 max-w-8xl mx-auto w-full">
        {/* Job Overview Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row">
            {/* Left Column - Company Image */}
            <div className="md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 flex items-center justify-center">
              <img
                src={job.job_data.image || placeholderImage}
                alt={`${job.job_data.company_name} logo`}
                className="max-w-full max-h-80 object-contain rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = placeholderImage;
                }}
              />
            </div>

            {/* Right Column - Job Summary */}
            <div className="md:w-2/3 p-6">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  {job.job_data.title}
                </h1>
              </div>

              <p className="text-lg sm:text-xl text-gray-600 mb-4 flex items-center">
                <FaBuilding className="mr-2 text-gray-500" />
                {job.job_data.company_name}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <FaMapMarkerAlt className="text-gray-600" />
                  </div>
                  <span className="text-gray-700">
                    {job.job_data.job_location}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <FaBriefcase className="text-gray-600" />
                  </div>
                  <span className="text-gray-700">
                    {job.job_data.work_type}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <FaGraduationCap className="text-gray-600" />
                  </div>
                  <span className="text-gray-700">
                    {job.job_data.education_requirements}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <FaUserTie className="text-gray-600" />
                  </div>
                  <span className="text-gray-700">
                    {job.job_data.experience_level}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <FaMoneyBillWave className="text-gray-600" />
                  </div>
                  <span className="text-gray-700">
                    ₹ {job.job_data.salary_range} per annum
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <FaCalendarAlt className="text-gray-600" />
                  </div>
                  <span className="text-gray-700">
                    Apply by: {formatDate(job.job_data.application_deadline)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleApplyClick}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out flex items-center shadow-md hover:shadow-lg"
                >
                  Apply Now <FaExternalLinkAlt className="ml-2 text-sm" />
                </button>
                <button
                  onClick={handleSaveJob}
                  className={`${
                    saved
                      ? "bg-gray-100 text-gray-800"
                      : "border-2 border-gray-300 text-gray-700"
                  } font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out flex items-center`}
                >
                  {saved ? (
                    <>
                      Saved <FaBookmark className="ml-2 text-yellow-500" />
                    </>
                  ) : (
                    <>
                      Save Job <FaBookmark className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Job Details Cards - One by one vertical listing */}
        <div className="space-y-6">
          {/* Job Description Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 w-[70%]">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <FaBriefcase className="text-yellow-600" />
                </div>
                Job Description
              </h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed text-justify ">
                {job.job_data.job_description}
              </p>
            </div>
          </div>

          {/* Key Responsibilities Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 w-[70%]">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <FaClipboardList className="text-yellow-600" />
                </div>
                Key Responsibilities
              </h2>
              <ul className="space-y-3 text-gray-700 text-justify">
                {job.job_data.key_responsibilities.map(
                  (responsibility, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center bg-yellow-100 text-yellow-800 w-6 h-6 rounded-full mr-3 flex-shrink-0 text-sm text-justify">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{responsibility}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Required Skills Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 w-[70%]">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <FaCode className="text-yellow-600" />
                </div>
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.job_data.technical_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Skills Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 w-[70%]">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <FaPlus className="text-yellow-600" />
                </div>
                Additional Skills
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                {job.job_data.additional_skills.map((skill, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Soft Skills Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 w-[70%]">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <FaSmile className="text-yellow-600" />
                </div>
                Soft Skills
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                {job.job_data.soft_skills.map((skill, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Education and Experience Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 w-[70%]">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <FaGraduationCap className="text-yellow-600" />
                </div>
                Education and Experience
              </h2>
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                  <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                    Education:
                  </div>
                  <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                    {job.job_data.education_requirements}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                  <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                    Minimum Marks:
                  </div>
                  <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                    {job.job_data.minimum_marks_requirement}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                  <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                    Experience:
                  </div>
                  <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                    {job.job_data.work_experience_requirement}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                  <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                    Age Limit:
                  </div>
                  <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                    {job.job_data.age_limit}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center py-2">
                  <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                    Certifications:
                  </div>
                  <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                    {job.job_data.professional_certifications}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Details Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 w-[70%]">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <FaBriefcase className="text-yellow-600" />
                </div>
                Job Details
              </h2>
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                  <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                    Industry:
                  </div>
                  <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                    {job.job_data.industry_type}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                  <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                    <FaClock className="inline-block mr-1 text-gray-500" />
                    Work Hours:
                  </div>
                  <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                    {job.job_data.work_schedule} hours
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                  <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                    <FaLaptop className="inline-block mr-1 text-gray-500" />
                    Remote Work:
                  </div>
                  <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded text-justify">
                    {job.job_data.remote_work_availability}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center py-2">
                  <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                    <FaTruckMoving className="inline-block mr-1 text-gray-500" />
                    Relocation:
                  </div>
                  <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded text-justify">
                    {job.job_data.relocation_assistance}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selection Process Card - Clean Design */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 w-[70%]">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <FaClipboardList className="text-yellow-600" />
                </div>
                Selection Process
              </h2>

              <div className="mt-4 space-y-4">
                {job.job_data.selection_process
                  .split("\n")
                  .filter((step) => step.trim())
                  .map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center border border-yellow-200 mr-3 mt-0.5">
                        <span className="text-yellow-700 font-medium text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{step}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Application Process Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 w-[70%]">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <FaFileAlt className="text-yellow-600 text-xl" />
                </div>
                Application Process
              </h2>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-yellow-50 to-white p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                    <FaListOl className="mr-2 text-yellow-600" />
                    Steps to Apply
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    {job.job_data.steps_to_apply
                      .split("\n")
                      .map((step, index) => (
                        <li key={index} className="pl-2">
                          {step.trim()}
                        </li>
                      ))}
                  </ol>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center">
                    <FaFileAlt className="mr-2 text-blue-600" />
                    Documents Required
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {job.job_data.documents_required
                      .split(",")
                      .map((doc, index) => (
                        <li key={index} className="pl-2">
                          {doc.trim()}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Important Dates Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 w-[70%]">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <FaRegCalendarAlt className="text-yellow-600" />
                </div>
                Important Dates
              </h2>
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                  <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                    Posted On:
                  </div>
                  <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                    {formatDate(job.job_data.job_posting_date)}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                  <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                    Apply By:
                  </div>
                  <div className="text-red-600 font-medium w-full sm:w-2/3 bg-red-50 p-2 rounded border border-red-100">
                    {formatDate(job.job_data.application_deadline)}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                  <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                    Interviews:
                  </div>
                  <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                    {formatDate(job.job_data.interview_start_date)} to{" "}
                    {formatDate(job.job_data.interview_end_date)}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center py-2">
                  <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                    Joining Date:
                  </div>
                  <div className="text-gray-700 w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                    {formatDate(job.job_data.expected_joining_date)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preparation Tips Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 w-[70%]">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <FaLightbulb className="text-yellow-600" />
                </div>
                Preparation Tips
              </h2>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-100 text-justify">
                {job.job_data.preparation_tips}
              </div>
            </div>
          </div>

          {/* Company Information Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 w-[70%]">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <FaBuilding className="text-yellow-600" />
                </div>
                Company Information
              </h2>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                  <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                    Company:
                  </div>
                  <div className="text-gray-700 font-medium w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                    {job.job_data.company_name}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center py-2">
                  <div className="font-medium w-full sm:w-1/3 text-gray-600 mb-1 sm:mb-0">
                    <FaGlobe className="inline-block mr-1 text-gray-500" />
                    Website:
                  </div>
                  <div className="w-full sm:w-2/3 bg-gray-50 p-2 rounded">
                    <a
                      href={job.job_data.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      {job.job_data.company_website}
                      <FaExternalLinkAlt className="ml-2 text-xs" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Apply Now Card at the bottom */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 w-[70%]">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <FaFileAlt className="text-yellow-600" />
                </div>
                Ready to Apply?
              </h2>
              <p className="text-gray-600 mb-4">
                Don't miss this opportunity! Apply before the deadline.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleApplyClick}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center justify-center shadow-md hover:shadow-lg"
                >
                  Apply Now <FaExternalLinkAlt className="ml-2 text-sm" />
                </button>
                <button
                  onClick={handleSaveJob}
                  className={`flex-1 ${
                    saved
                      ? "bg-gray-100 text-gray-800"
                      : "border-2 border-gray-300 text-gray-700"
                  } font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out flex items-center justify-center`}
                >
                  {saved ? (
                    <>
                      Saved <FaBookmark className="ml-2 text-yellow-500" />
                    </>
                  ) : (
                    <>
                      Save Job <FaBookmark className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPreview;
