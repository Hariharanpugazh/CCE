import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

export default function AdminMail() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("jwt");
  const navigate = useNavigate();

  console.log("JWT Token:", token); // Log the token to the console

  useEffect(() => {
    if (!token) {
      setError("JWT token not found!");
      setLoading(false);
      navigate("/login"); // Redirect to login page if token is missing
      return;
    }

    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/mailjobs/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Log the request headers to verify the Authorization header
        console.log("Request Headers:", {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch jobs');
        }

        const data = await response.json();
        setJobs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token, navigate]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-4 border border-gray-300">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold text-gray-800">Admin Mail</h2>
          <span className="text-sm text-gray-500">Inbox</span>
        </div>
        <div className="mt-4 space-y-4">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job._id} className="p-3 border rounded-lg shadow-sm bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-semibold">{job.job_data.title}</span>
                  <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">{job.status}</span>
                </div>
                <p className="mt-1 text-gray-700 text-sm">{job.job_data.job_description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No job listings available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
