// src/components/ManageJobs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import AdminPageNavbar from "../../components/Admin/AdminNavBar";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Get JWT token from cookies
        const token = Cookies.get("jwt");

        // Make request with Authorization header
        const response = await axios.get("http://localhost:8000/api/manage-jobs/", {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
          withCredentials: true, // Ensure cookies are sent with requests
        });

        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  // Function to handle edit click
  const handleEditClick = (jobId) => {
    navigate(`/job-edit/${jobId}`); // Navigate to the edit page with job ID
  };

  return (
    <div className="container mx-auto p-4">
        <AdminPageNavbar />

      <h1 className="text-3xl font-bold mb-4">Manage Jobs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <div key={job._id} className="border rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold mr-2">{job.job_data.title}</h2>
                <span className={`px-2 py-1 text-sm font-semibold rounded ${job.is_publish ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {job.is_publish ? "Published" : "Pending"}
                </span>
              </div>
              <button
                onClick={() => handleEditClick(job._id)}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
                <span className="text-sm">Edit</span>
              </button>
            </div>
            <p className="text-gray-600"><strong>Company:</strong> {job.job_data.company_name}</p>
            <p className="text-gray-600"><strong>Description:</strong> {job.job_data.job_description}</p>
            <p className="text-gray-600"><strong>Responsibilities:</strong> {job.job_data.key_responsibilities}</p>
            <p className="text-gray-600"><strong>Skills Required:</strong> {job.job_data.required_skills.join(", ")}</p>
            <p className="text-gray-600"><strong>Education:</strong> {job.job_data.education_requirements}</p>
            <p className="text-gray-600"><strong>Experience Level:</strong> {job.job_data.experience_level}</p>
            <p className="text-gray-600"><strong>Salary Range:</strong> {job.job_data.salary_range}</p>
            <p className="text-gray-600"><strong>Benefits:</strong> {job.job_data.benefits}</p>
            <p className="text-gray-600"><strong>Location:</strong> {job.job_data.job_location}</p>
            <p className="text-gray-600"><strong>Work Type:</strong> {job.job_data.work_type}</p>
            <p className="text-gray-600"><strong>Work Schedule:</strong> {job.job_data.work_schedule}</p>
            <p className="text-gray-600"><strong>Application Deadline:</strong> {new Date(job.job_data.application_deadline).toLocaleDateString()}</p>
            <p className="text-gray-600"><strong>Contact Email:</strong> {job.job_data.contact_email}</p>
            <p className="text-gray-600"><strong>Contact Phone:</strong> {job.job_data.contact_phone}</p>
            <p className="text-gray-600"><strong>Job Link:</strong> <a href={job.job_data.job_link} target="_blank" rel="noopener noreferrer" className="text-blue-500">{job.job_data.job_link}</a></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageJobs;
