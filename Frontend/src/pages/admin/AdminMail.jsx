import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import AdminPageNavbar from '../../components/Admin/AdminNavBar';

export default function AdminMail() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]); // Use an array to handle multiple reviews
  const [activeTab, setActiveTab] = useState('jobs'); // State to manage active tab
  const token = Cookies.get("jwt");
  const navigate = useNavigate();


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

    const fetchReview = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/fetch-review/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch review');
        }

        const data = await response.json();
        setReviews(data.reviews); // Assuming the response is an object with a 'reviews' array
      } catch (error) {
        setError(error.message);
      }
    };

    fetchJobs();
    fetchReview();
  }, [token, navigate]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <AdminPageNavbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md p-4 border-r border-gray-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Admin Mail</h2>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`block p-2 rounded mb-2 ${activeTab === 'jobs' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Jobs
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`block p-2 rounded ${activeTab === 'notifications' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Notifications
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'jobs' && (
            <div className="space-y-4">
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
          )}

          {activeTab === 'notifications' && reviews.length > 0 && (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.review_id} className="p-3 border rounded-lg shadow-sm bg-yellow-100">
                  <h3 className="text-lg font-semibold text-gray-800">Review Notification</h3>
                  <p className="mt-1 text-gray-700 text-sm">Item ID: {review.item_id}</p>
                  <p className="mt-1 text-gray-700 text-sm">Item Name: {review.item_name || 'N/A'}</p>
                  <p className="mt-1 text-gray-700 text-sm">Item Type: {review.item_type}</p>
                  <p className="mt-1 text-gray-700 text-sm">Feedback: {review.feedback}</p>
                  <p className="mt-1 text-gray-700 text-sm">Timestamp: {new Date(review.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notifications' && reviews.length === 0 && (
            <p className="text-gray-500 text-center">No notifications available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
