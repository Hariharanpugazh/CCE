import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const JobPreview = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/job/${id}/`)
            .then(response => response.json())
            .then(data => setJob(data.job))
            .catch(error => console.error("Error fetching job:", error));
    }, [id]);

    const handleApplyClick = () => {
        // Store the job ID in local storage or session storage
        sessionStorage.setItem('appliedJobId', id);
        window.open(job.job_data.company_website, "_blank", "noopener noreferrer");
      };
    
      useEffect(() => {
        const appliedJobId = sessionStorage.getItem('appliedJobId');
        if (appliedJobId) {
          setShowPopup(true);
          sessionStorage.removeItem('appliedJobId'); // Clear the storage after showing the popup
        }
      }, []);
    
      const handleConfirm = async () => {
        try {
          const token = Cookies.get("jwt");
          const userId = JSON.parse(atob(token.split(".")[1])).student_user;
          await axios.post('http://localhost:8000/api/apply-job/', {
            studentId: userId,
            jobId: id
          });
          setShowPopup(false);
        } catch (error) {
          console.error("Error confirming job application:", error);
          alert("Unable to track application. Please try again later.");
        }
      };
    
      const handleCancel = () => {
        setShowPopup(false);
      };

    if (!job) return <p className="text-center text-lg font-semibold">Loading...</p>;

    return (
        <div className="w-4/5 mx-auto bg-white shadow-lg rounded-lg p-8 my-10 border border-gray-200">
            {/* Job Title & Company */}
            <div className="border-b pb-4 mb-6">
                <h2 className="text-3xl font-bold text-gray-900">{job.job_data.title}</h2>
                <p className="text-lg text-gray-700 mt-2">{job.job_data.company_name}</p>
                <a
                    href={job.job_data.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                >
                    Visit Company Website
                </a>
            </div>

            {/* Job Overview */}
            <div className="border-b pb-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Job Overview</h3>
                <p className="text-gray-700"><strong>Location:</strong> {job.job_data.job_location}</p>
                <p className="text-gray-700"><strong>Work Type:</strong> {job.job_data.work_type}</p>
                <p className="text-gray-700"><strong>Schedule:</strong> {job.job_data.work_schedule}</p>
                <p className="text-gray-700"><strong>Salary:</strong> {job.job_data.salary_range}</p>
                <p className="text-gray-700"><strong>Experience Level:</strong> {job.job_data.experience_level}</p>
            </div>

            {/* Job Description */}
            <div className="border-b pb-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Job Description</h3>
                <p className="text-gray-700">{job.job_data.job_description}</p>
            </div>

            {/* Key Responsibilities */}
            <div className="border-b pb-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Key Responsibilities</h3>
                <p className="text-gray-700">{job.job_data.key_responsibilities}</p>
            </div>

            {/* Skills & Education */}
            <div className="border-b pb-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Required Skills & Qualifications</h3>
                <div className="text-gray-700 mb-2">
                    <strong>Skills:</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {job.job_data.required_skills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
                <p className="text-gray-700"><strong>Education:</strong> {job.job_data.education_requirements}</p>
            </div>

            {/* Benefits */}
            <div className="border-b pb-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Benefits</h3>
                <p className="text-gray-700">{job.job_data.benefits}</p>
            </div>

            {/* Application Details */}
            <div className="border-b pb-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Application Process</h3>
                <p className="text-gray-700"><strong>Deadline:</strong> {job.job_data.application_deadline}</p>
                <p className="text-gray-700"><strong>Instructions:</strong> {job.job_data.application_instructions}</p>
            </div>

            {/* Contact Info */}
            <div className="border-b pb-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Contact Information</h3>
                <p className="text-gray-700"><strong>Email:</strong> {job.job_data.contact_email}</p>
                <p className="text-gray-700"><strong>Phone:</strong> {job.job_data.contact_phone}</p>
            </div>

            {/* Apply Button */}
            <div className="text-center mt-8">
        <button
          onClick={handleApplyClick}
          className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
        >
          Apply Now
        </button>
      </div>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm Your Job Application</h2>
            <p className="mb-4">Did you complete your job application for "{job.job_data.title}"?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirm}
                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
              >
                Yes, Confirm
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
    );
};

export default JobPreview;
