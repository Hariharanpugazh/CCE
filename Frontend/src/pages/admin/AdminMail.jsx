import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import AdminPageNavbar from '../../components/Admin/AdminNavBar';
import { Mail, Inbox, Star, Send, FileText, Archive, Users, Settings, Search } from 'lucide-react';

export default function AdminMail() {
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const token = Cookies.get("jwt");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("JWT token not found!");
      setLoading(false);
      navigate("/login");
      return;
    }

    const fetchData = async () => {
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
          throw new Error(errorData.error || 'Failed to fetch data');
        }

        const data = await response.json();
        setJobs(data.jobs);
        setInternships(data.internships);
        setAchievements(data.achievements);
        setStudyMaterials(data.study_materials);
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
        setReviews(data.reviews);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
    fetchReview();
  }, [token, navigate]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const renderContent = () => {
    let itemsToDisplay = [];

    switch (activeTab) {
      case "jobs":
        itemsToDisplay = jobs;
        break;
      case "internships":
        itemsToDisplay = internships;
        break;
      case "achievements":
        itemsToDisplay = achievements;
        break;
      case "study_materials":
        itemsToDisplay = studyMaterials;
        break;
      case "notifications":
        return (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Notifications</h2>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Link
                    to={review.item_type === 'internship' ? `/internship-edit/${review.item_id}` : `/job-edit/${review.item_id}`}
                    key={review.review_id}
                    className="block p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition duration-300 border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">{review.item_name || 'Notification'}</span>
                      <span className="text-sm text-gray-500">{new Date(review.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-700">Type: {review.item_type}</p>
                    <p className="text-gray-700">Feedback: {review.feedback}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No notifications found.</p>
            )}
          </section>
        );
      default:
        return null;
    }

    const filteredItems = itemsToDisplay.filter(item =>
      item.job_data?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.internship_data?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.study_material_data?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h2>
        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <motion.div
                key={item._id}
                className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition duration-300 cursor-pointer border border-gray-200"
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">
                    {item.job_data?.title || item.internship_data?.title || item.name || item.study_material_data?.title}
                  </span>
                  <div className="flex space-x-2">
                    <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">{item.status}</span>
                    <span className={`text-xs px-2 py-1 rounded ${item.is_publish === true ? 'bg-green-200 text-green-800' : item.is_publish === false ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                      {item.is_publish === true ? 'Approved' : item.is_publish === false ? 'Rejected' : 'Pending'}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mt-2">
                  {item.job_data?.company_name || item.internship_data?.company_name || item.achievement_description || item.study_material_data?.description}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No items found.</p>
        )}
      </section>
    );
  };

  const renderPreview = () => {
    if (!selectedItem) return null;

    const { job_data, internship_data, achievement_description, study_material_data, is_publish } = selectedItem;

    return (
      <div className="space-y-4 p-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-300 text-gray-700 text-lg">
            {selectedItem.name ? selectedItem.name[0] : 'A'}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">
              {job_data?.title || internship_data?.title || selectedItem.name || study_material_data?.title}
            </h2>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{job_data?.company_name || internship_data?.company_name || 'Company Name'}</span>
              <span>{is_publish === true ? 'Approved' : is_publish === false ? 'Rejected' : 'Pending'}</span>
            </div>
          </div>
        </div>
        <div className="border-t my-4" />
        <div className="whitespace-pre-wrap text-sm text-gray-700">
          {job_data?.job_description || internship_data?.job_description || achievement_description || study_material_data?.description}
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
        <div className="mt-4">
          <a
            href={job_data?.job_link || internship_data?.job_link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-center inline-block"
          >
            {job_data ? 'Apply Now' : internship_data ? 'Apply Now' : 'View More'}
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <AdminPageNavbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 border-r p-4 space-y-4">
          <div className="flex items-center gap-2 mb-8">
            <Mail className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Mail</h1>
          </div>

          <nav className="space-y-2">
            <button className="w-full flex items-center gap-2 p-2 hover:bg-gray-300 rounded transition duration-300" onClick={() => setActiveTab("jobs")}>
              <Inbox className="h-4 w-4" />
              Jobs
            </button>
            <button className="w-full flex items-center gap-2 p-2 hover:bg-gray-300 rounded transition duration-300" onClick={() => setActiveTab("internships")}>
              <Star className="h-4 w-4" />
              Internships
            </button>
            <button className="w-full flex items-center gap-2 p-2 hover:bg-gray-300 rounded transition duration-300" onClick={() => setActiveTab("achievements")}>
              <Send className="h-4 w-4" />
              Achievements
            </button>
            <button className="w-full flex items-center gap-2 p-2 hover:bg-gray-300 rounded transition duration-300" onClick={() => setActiveTab("study_materials")}>
              <FileText className="h-4 w-4" />
              Study Materials
            </button>
            <button className="w-full flex items-center gap-2 p-2 hover:bg-gray-300 rounded transition duration-300" onClick={() => setActiveTab("notifications")}>
              <Archive className="h-4 w-4" />
              Notifications
            </button>
          </nav>

          <div className="border-t my-4" />
        </div>

        {/* Email List */}
        <div className="flex-1 flex flex-col border-r p-4">
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
          <div className="flex-1 overflow-auto">
            {renderContent()}
          </div>
        </div>

        {/* Email Preview */}
        {selectedItem && (
          <div className="w-[45%] border-l p-4 bg-gray-100">
            {renderPreview()}
          </div>
        )}
      </div>
    </div>
  );
}
