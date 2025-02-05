import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function MailPage() {
  const [jobs, setJobs] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [internships, setInternships] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const token = Cookies.get("jwt"); // Retrieve JWT from cookies

  // Decode JWT to check user role
  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect if no token
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      if (payload.role !== "superadmin") {
        navigate("/"); // Redirect if not superadmin
      }
    } catch (err) {
      console.error("Invalid token:", err);
      navigate("/superadmin");
    }
  }, [token, navigate]);

  // Fetch jobs, achievements, and internships from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [jobsRes, achievementsRes, internshipsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/jobs", config),
          axios.get("http://localhost:8000/api/achievements", config),
          axios.get("http://localhost:8000/api/internship/", config),
        ]);

        setJobs(jobsRes.data.jobs);
        setAchievements(achievementsRes.data.achievements);
        setInternships(internshipsRes.data.internships);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      }
    };

    fetchData();
  }, [token]);

  // Handle Approve/Reject action for Jobs, Achievements, and Internships
  const handleAction = async (id, action, type) => {
    try {
      const endpoint =
        type === "job"
          ? `http://localhost:8000/api/review-job/${id}/`
          : type === "achievement"
          ? `http://localhost:8000/api/review-achievement/${id}/`
          : `http://localhost:8000/api/review-internship/${id}/`;

      const response = await axios.post(
        endpoint,
        { action },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);

      if (type === "job") {
        setJobs((prev) =>
          prev.map((job) =>
            job._id === id ? { ...job, is_publish: action === "approve" } : job
          )
        );
      } else if (type === "achievement") {
        setAchievements((prev) =>
          prev.map((achievement) =>
            achievement._id === id
              ? { ...achievement, is_publish: action === "approve" }
              : achievement
          )
        );
      } else {
        setInternships((prev) =>
          prev.map((internship) =>
            internship._id === id
              ? { ...internship, publish: action === "approve" }
              : internship
          )
        );
      }
    } catch (err) {
      console.error(`Error updating ${type}:`, err);
      setError(`Failed to update ${type} status.`);
    }
  };

  // Handle View action for Jobs, Achievements, and Internships
  const handleView = (id, type) => {
    if (type === "job") {
      navigate(`/job-edit/${id}`);
    } else if (type === "achievement") {
      navigate(`/achievement-edit/${id}`);
    } else {
      navigate(`/internship-edit/${id}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Mail Inbox</h1>
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline">{message}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Job Approvals Section */}
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-4">Job Approvals</h2>
        {jobs.length === 0 ? (
          <p className="text-gray-600">No jobs to review.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Title</th>
                  <th className="border border-gray-300 px-4 py-2">Company</th>
                  <th className="border border-gray-300 px-4 py-2">Description</th>
                  <th className="border border-gray-300 px-4 py-2">Location</th>
                  <th className="border border-gray-300 px-4 py-2">Salary</th>
                  <th className="border border-gray-300 px-4 py-2">Deadline</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td className="border border-gray-300 px-4 py-2">{job.job_data.title}</td>
                    <td className="border border-gray-300 px-4 py-2">{job.job_data.company_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{job.job_data.job_description}</td>
                    <td className="border border-gray-300 px-4 py-2">{job.job_data.job_location}</td>
                    <td className="border border-gray-300 px-4 py-2">{job.job_data.salary_range}</td>
                    <td className="border border-gray-300 px-4 py-2">{job.job_data.application_deadline}</td>
                    <td className="border border-gray-300 px-4 py-2">{job.is_publish ? "Published" : "Pending"}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex space-x-2">
                        {!job.is_publish && (
                          <>
                            <button
                              className="px-3 py-1 bg-green-500 text-white rounded"
                              onClick={() => handleAction(job._id, "approve", "job")}
                            >
                              Approve
                            </button>
                            <button
                              className="px-3 py-1 bg-red-500 text-white rounded"
                              onClick={() => handleAction(job._id, "reject", "job")}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded"
                          onClick={() => handleView(job._id, "job")}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Achievement Approvals Section */}
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-4">Achievement Approvals</h2>
        {achievements.length === 0 ? (
          <p className="text-gray-600">No achievements to review.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Department</th>
                  <th className="border border-gray-300 px-4 py-2">Achievement</th>
                  <th className="border border-gray-300 px-4 py-2">Batch</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((achievement) => (
                  <tr key={achievement._id}>
                    <td className="border border-gray-300 px-4 py-2">{achievement.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{achievement.department}</td>
                    <td className="border border-gray-300 px-4 py-2">{achievement.achievement}</td>
                    <td className="border border-gray-300 px-4 py-2">{achievement.batch}</td>
                    <td className="border border-gray-300 px-4 py-2">{achievement.is_publish ? "Published" : "Pending"}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex space-x-2">
                        {!achievement.is_publish && (
                          <>
                            <button
                              className="px-3 py-1 bg-green-500 text-white rounded"
                              onClick={() => handleAction(achievement._id, "approve", "achievement")}
                            >
                              Approve
                            </button>
                            <button
                              className="px-3 py-1 bg-red-500 text-white rounded"
                              onClick={() => handleAction(achievement._id, "reject", "achievement")}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded"
                          onClick={() => handleView(achievement._id, "achievement")}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Internship Approvals Section */}
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-4">Internship Approvals</h2>
        {internships.length === 0 ? (
          <p className="text-gray-600">No internships to review.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Title</th>
                  <th className="border border-gray-300 px-4 py-2">Company</th>
                  <th className="border border-gray-300 px-4 py-2">Location</th>
                  <th className="border border-gray-300 px-4 py-2">Stipend</th>
                  <th className="border border-gray-300 px-4 py-2">Duration</th>
                  <th className="border border-gray-300 px-4 py-2">Deadline</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {internships.map((internship) => (
                  <tr key={internship._id}>
                    <td className="border border-gray-300 px-4 py-2">{internship.title}</td>
                    <td className="border border-gray-300 px-4 py-2">{internship.company_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{internship.location}</td>
                    <td className="border border-gray-300 px-4 py-2">{internship.stipend}</td>
                    <td className="border border-gray-300 px-4 py-2">{internship.duration}</td>
                    <td className="border border-gray-300 px-4 py-2">{internship.application_deadline}</td>
                    <td className="border border-gray-300 px-4 py-2">{internship.publish ? "Published" : "Pending"}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex space-x-2">
                        {!internship.publish && (
                          <>
                            <button
                              className="px-3 py-1 bg-green-500 text-white rounded"
                              onClick={() => handleAction(internship._id, "approve", "internship")}
                            >
                              Approve
                            </button>
                            <button
                              className="px-3 py-1 bg-red-500 text-white rounded"
                              onClick={() => handleAction(internship._id, "reject", "internship")}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded"
                          onClick={() => handleView(internship._id, "internship")}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
