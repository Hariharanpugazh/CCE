import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBookmark, FiMapPin, FiEye, FiClock } from "react-icons/fi";
import Cookies from "js-cookie";

function timeAgo(dateString) {
  const givenDate = new Date(dateString);
  const now = new Date();
  const secondsDiff = Math.floor((now - givenDate) / 1000);

  const years = Math.floor(secondsDiff / 31536000);
  if (years >= 1) return `${years} year${years > 1 ? "s" : ""} ago`;

  const months = Math.floor(secondsDiff / 2592000);
  if (months >= 1) return `${months} month${months > 1 ? "s" : ""} ago`;

  const days = Math.floor(secondsDiff / 86400);
  if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;

  const hours = Math.floor(secondsDiff / 3600);
  if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const minutes = Math.floor(secondsDiff / 60);
  if (minutes >= 1) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

  return "Just now";
}

function formatViewCount(count) {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
}

export default function ApplicationCard({ application, handleCardClick, isSaved }) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const Viewscount = formatViewCount(application.total_views);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role === "admin") {
          setUserId(payload.admin_user);
        } else if (payload.role === "superadmin") {
          setUserId(payload.superadmin_user);
        } else if (payload.student_user) {
          setUserId(payload.student_user);
        }
      } catch (error) {
        console.error("Invalid JWT token:", error);
      }
    }
  }, []);

  const handleViewDetails = async (event) => {
    event.stopPropagation();
    const previewPage = application.type === "internship" ? "internship-preview" : "job-preview";
    const pageType = application.type === "internship" ? "internship" : "job";

    if (!userId) {
      console.error("User ID is not available");
      navigate(`/${previewPage}/${application._id || application.id}`);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/viewcount/${application._id || application.id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, count: 1, pageType, applicationId: application._id || application.id }),
      });

      if (!response.ok) {
        console.error('Failed to update view count');
      } else {
        const data = await response.json();
        setViewCount(data.total_views);
      }
    } catch (error) {
      console.error('Error updating view count:', error);
    } finally {
      navigate(`/${previewPage}/${application._id || application.id}`);
    }
  };

  return (
    <div
      className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 group"
      onClick={handleCardClick}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {application.title}
          </h3>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <span className="flex items-center">
              <i className="bi bi-building text-sm mr-2 opacity-75"></i>
              {application.company_name}
            </span>
            <span className="flex items-center">
              <FiMapPin className="mr-2 opacity-75" />
              {application.location}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          application.status === "Active" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {application.status === "Active" ? "Active" : "Closed"}
        </span>
      </div>

      {/* Description Section */}
      <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed text-sm">
        {application.job_description}
      </p>

      {/* Metadata Section */}
      <div className="flex flex-wrap gap-3 mb-6">
        {application.selectedWorkType && (
          <div className="bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg text-sm">
            {application.selectedWorkType}
          </div>
        )}
        {application.work_type && (
          <div className="bg-purple-50 text-purple-800 px-3 py-1.5 rounded-lg text-sm">
            {application.work_type}
          </div>
        )}
        {application.experience_level && (
          <div className="bg-orange-50 text-orange-800 px-3 py-1.5 rounded-lg text-sm">
            {application.experience_level}
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-gray-100 pt-4">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <FiClock className="mr-2 opacity-75" />
            {timeAgo(application.updated_at)}
          </div>
          <div className="flex items-center">
            <FiEye className="mr-2 opacity-75" />
            {Viewscount} views
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:border-gray-400 transition-colors duration-200"
            onClick={handleViewDetails}
          >
            View Details
          </button>
          {isSaved !== undefined && (
            <FiBookmark
              className={`text-xl cursor-pointer p-2 hover:bg-gray-100 rounded-lg ${
                isSaved ? "text-blue-600 fill-current" : "text-gray-400"
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
