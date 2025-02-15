import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import Cookies from "js-cookie";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { FaBuilding, FaBriefcase, FaMapMarkerAlt, FaGraduationCap, FaUserTie } from "react-icons/fa";

const JobPreview = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/job/${id}/`)
      .then(response => response.json())
      .then(data => setJob(data.job))
      .catch(error => console.error("Error fetching job:", error));
  }, [id]);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role) {
          setUserRole(payload.role);
        } else if (payload.student_user) {
          setUserRole("student");
        }
      } catch (error) {
        console.error("Invalid JWT token:", error);
      }
    }
  }, []);

  const handleApplyClick = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;
      await axios.post('http://localhost:8000/api/apply-job/', {
        studentId: userId,
        jobId: id
      });
      window.open(job.job_data.company_website, "_blank", "noopener noreferrer");
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };

  if (!job) return <p className="text-center text-lg font-semibold">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Render navbar dynamically based on user role */}
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      {userRole === "student" && <StudentPageNavbar />}

      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row w-full max-w-7xl bg-transparent rounded-lg overflow-hidden">
          {/* Job Overview */}
          <div className="lg:w-1/3 p-4 border border-gray-300 lg:mr-8 rounded-lg">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{job.job_data.title}</h2>
              <p className="text-gray-700 mb-2 flex items-center">
                <FaBuilding className="mr-2 text-gray-600" />
                <div className="ml-1 flex flex-col">
                  <h3 className="font-semibold">Company Name:</h3>
                  <span className="text-sm">{job.job_data.company_name}</span>
                </div>
              </p>
              <p className="text-gray-700 mb-2 flex items-center">
                <FaBriefcase className="mr-2 text-gray-600" />
                <div className="ml-1 flex flex-col">
                  <h3 className="font-semibold">Work Type:</h3>
                  <span className="text-sm">{job.job_data.work_type}</span>
                </div>
              </p>
              <p className="text-gray-700 mb-2 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-gray-600" />
                <div className="ml-1 flex flex-col">
                  <h3 className="font-semibold">Location:</h3>
                  <span className="text-sm">{job.job_data.job_location}</span>
                </div>
              </p>
              <p className="text-gray-700 mb-2 flex items-center">
                <FaGraduationCap className="mr-2 text-lg text-gray-600" />
                <div className="ml-1 flex flex-col">
                  <h3 className="font-semibold">Education:</h3>
                  <span className="text-sm">{job.job_data.education_requirements}</span>
                </div>
              </p>
              <p className="text-gray-700 mb-2 flex items-center">
                <FaUserTie className="mr-2 text-gray-600" />
                <div className="ml-1 flex flex-col">
                  <h3 className="font-semibold">Experience:</h3>
                  <span className="text-sm">{job.job_data.experience_level} years</span>
                </div>
              </p>
              <p className="text-gray-700 mb-2 flex items-center">
                <RiMoneyRupeeCircleFill className="mr-2 text-gray-600" />
                <div className="ml-1 flex flex-col">
                  <h3 className="font-semibold">Salary:</h3>
                  <span className="text-sm">₹ {job.job_data.salary_range} per annum</span>
                </div>
              </p>
            </div>
          </div>

          {/* Job Description and Other Details */}
          <div className="lg:w-2/3 p-4 overflow-y-auto" style={{ maxHeight: '600px' }}>
            {/* Job Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Job Description</h3>
              <p className="text-gray-700">{job.job_data.job_description}</p>
            </div>

            {/* Key Responsibilities */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Responsibilities</h3>
              <p className="text-gray-700">{job.job_data.key_responsibilities}</p>
            </div>

            {/* Skills & Education */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Required Skills</h3>
              <div className="text-gray-700 mb-2">
                <strong>Skills:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.isArray(job.job_data.required_skills) ? (
                    job.job_data.required_skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      No skills available
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Benefits</h3>
              <p className="text-gray-700">{job.job_data.benefits}</p>
            </div>

            {/* Application Details */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Application Process</h3>
              <p className="text-gray-700 mb-2"><strong>Deadline:</strong> {job.job_data.application_deadline}</p>
              <p className="text-gray-700 mb-2"><strong>Instructions:</strong> {job.job_data.application_instructions}</p>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
              <p className="text-gray-700 mb-2"><strong>Email:</strong> {job.job_data.contact_email}</p>
              <p className="text-gray-700 mb-2"><strong>Phone:</strong> {job.job_data.contact_phone}</p>
            </div>

            {/* Apply Button */}
            <div className="text-left mt-8">
              <button
                onClick={handleApplyClick}
                className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPreview;
