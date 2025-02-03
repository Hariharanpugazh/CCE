import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MailPage() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/jobs");
        setJobs(response.data.jobs); // Assuming the backend response contains `jobs`
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs.");
      }
    };
    fetchJobs();
  }, []);

// Handle Approve/Reject action
const handleAction = async (jobId, action) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/review-job/${jobId}/`, // Dynamically insert jobId
        { action },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(response.data.message);
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, is_publish: action === "approve" } : job
        )
      );
    } catch (err) {
      console.error("Error updating job:", err);
      setError("Failed to update job status.");
    }
  };  

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Mail Inbox</h1>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Job Approvals</h2>
        {jobs.length === 0 ? (
          <p className="text-gray-600">No jobs to review.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">Company</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td className="border border-gray-300 px-4 py-2">{job.job_data.title}</td>
                  <td className="border border-gray-300 px-4 py-2">{job.job_data.company_name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {job.is_publish ? "Published" : "Pending"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {!job.is_publish && (
                      <>
                        <button
                          className="px-3 py-1 bg-green-500 text-white rounded mr-2"
                          onClick={() => handleAction(job._id, "approve")}
                        >
                          Approve
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded"
                          onClick={() => handleAction(job._id, "reject")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
