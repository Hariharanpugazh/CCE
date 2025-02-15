import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { Mail, Bell, Briefcase, GraduationCap, BookOpen, Trophy, Search, X } from "lucide-react";

const InboxPage = () => {
  const [messages, setMessages] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState("");
  const [internships, setInternships] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [studentAchievements, setStudentAchievements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("contactMessages");
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAchievements = achievements.slice(indexOfFirstItem, indexOfLastItem);
  const currentJobs = jobs.slice(indexOfFirstItem, indexOfLastItem);
  const currentInternships = internships.slice(indexOfFirstItem, indexOfLastItem);
  const currentStudyMaterials = studyMaterials.slice(indexOfFirstItem, indexOfLastItem);
  const currentStudentAchievements = studentAchievements.slice(indexOfFirstItem, indexOfLastItem);
  const currentMessages = messages.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchMessages();
    fetchAchievements();
    fetchJobs();
    fetchInternships();
    fetchStudyMaterials();
    fetchStudentAchievements();
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get-contact-messages/");
      const messagesData = response.data.messages || [];
      if (Array.isArray(messagesData)) {
        setMessages(messagesData);
      } else {
        console.error("Unexpected data format:", messagesData);
      }
    } catch (error) {
      console.error("Failed to fetch messages.", error);
    }
  };
  

  const fetchAchievements = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get_achievements_with_admin/");
      setAchievements(response.data.achievements || []);
    } catch (err) {
      console.error("Failed to fetch achievements.");
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get_jobs_with_admin/");
      setJobs(response.data.jobs || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const fetchInternships = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get_internships_with_admin/");
      setInternships(response.data.internships || []);
    } catch (err) {
      console.error("Failed to fetch internships.");
    }
  };

  const fetchStudyMaterials = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get_study_materials_with_admin/");
      setStudyMaterials(response.data.study_materials || []);
    } catch (err) {
      console.error("Failed to fetch study materials:", err);
    }
  };

  const fetchStudentAchievements = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get_student_achievements_with_students/");
      setStudentAchievements(response.data.student_achievements || []);
    } catch (err) {
      console.error("Failed to fetch student achievements.");
    }
  };

  const sendReply = async (messageId) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/reply_to_message/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message_id: messageId, reply_message: replyText[messageId] }),
      });

      const data = await response.json();
      if (data.success) {
        setToastMessage("Message sent successfully!");
        fetchMessages();
      }
    } catch (error) {
      console.error("Error sending reply:", error);
    }
    setLoading(false);
  };

  const handleReplyChange = (messageId, value) => {
    setReplyText((prev) => ({
      ...prev,
      [messageId]: value,
    }));
  };

  const toggleExpand = (index) => {
    setExpandedIndex(prevIndex => prevIndex === index ? null : index);
  };

  const renderContent = () => {
    let itemsToDisplay = [];

    switch (selectedCategory) {
      case "contactMessages":
        itemsToDisplay = messages;
        break;
      case "achievements":
        itemsToDisplay = achievements;
        break;
      case "internships":
        itemsToDisplay = internships;
        break;
      case "studyMaterials":
        itemsToDisplay = studyMaterials;
        break;
      case "Jobs":
        itemsToDisplay = jobs;
        break;
      case "studentAchievements":
        itemsToDisplay = studentAchievements;
        break;
      default:
        return null;
    }

    const filteredItems = itemsToDisplay.filter(item =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.admin_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <section>
        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={index}
                className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition duration-300 cursor-pointer border border-gray-200"
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">
                    {item.name || item.admin_name || item.title || item.company_name || "No Title"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700 mt-2">
                  {item.message || item.description || item.job_description || "No Description"}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No items found.</p>
        )}
        {filteredItems.length > itemsPerPage && (
          <div className="flex justify-center mt-4">
            {[...Array(Math.ceil(filteredItems.length / itemsPerPage)).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`px-3 py-1 mx-1 border rounded ${
                  currentPage === number + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {number + 1}
              </button>
            ))}
          </div>
        )}
      </section>
    );
  };

  const renderPreview = () => {
    if (!selectedItem) return null;

    const { job_data, internship_data, achievement_description, study_material_data, item_type, item_id } = selectedItem;

    return (
      <div className="flex-1 relative p-4 bg-gray-100 rounded-lg shadow-xl ">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-300"
          onClick={() => setSelectedItem(null)}
        >
          <X className="h-5 w-5" />
        </button>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-300 text-gray-700 text-lg">
              {selectedItem.name ? selectedItem.name[0] : 'A'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                {job_data?.title || internship_data?.title || selectedItem.name || study_material_data?.title || 'Notification'}
              </h2>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{job_data?.company_name || internship_data?.company_name || 'Company Name'}</span>
              </div>
            </div>
          </div>
          <div className="border-t my-4" />
          <div className="whitespace-pre-wrap text-sm text-gray-700">
            {job_data?.job_description || internship_data?.job_description || achievement_description || study_material_data?.description || `Feedback: ${selectedItem.feedback}`}
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
                <p className="text-gray-600 font-semibold">Deadline:</p>
                <p className="text-sm">{new Date(internship_data.deadline).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Location:</p>
                <p className="text-sm">{internship_data.location}</p>
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
          {item_type && (
            <div className="mt-4 text-center">
              <a
                href={item_type === 'internship' ? `/internship-edit/${item_id}` : `/job-edit/${item_id}`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md inline-block"
              >
                Edit
              </a>
            </div>
          )}
          {!item_type && (
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
          )}
        </div>
      </div>
    );
  };

  const renderContactMessages = () => {
    return (
      <section>
        {currentMessages.length > 0 ? (
          <div className="space-y-4">
            {currentMessages.map((message, index) => (
              <motion.div
                key={index}
                className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition duration-300 cursor-pointer border border-gray-200"
                onClick={() => setSelectedItem(message)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">{message.name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(message.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700 mt-2">
                  {message.message}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No contact messages found.</p>
        )}
        {messages.length > itemsPerPage && (
          <div className="flex justify-center mt-4">
            {[...Array(Math.ceil(messages.length / itemsPerPage)).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`px-3 py-1 mx-1 border rounded ${
                  currentPage === number + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {number + 1}
              </button>
            ))}
          </div>
        )}
      </section>
    );
  };

  const renderContactPreview = () => {
    if (!selectedItem) return null;

    return (
      <div className="flex-1 relative p-4 bg-gray-100 rounded-lg shadow-xl">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-300"
          onClick={() => setSelectedItem(null)}
        >
          <X className="h-5 w-5" />
        </button>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-300 text-gray-700 text-lg">
              {selectedItem.name ? selectedItem.name[0] : 'A'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{selectedItem.name}</h2>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{selectedItem.contact}</span>
                <span>{new Date(selectedItem.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="border-t my-4" />
          <div className="whitespace-pre-wrap text-sm text-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">💬 Message:</h3>
            <p className="text-sm text-gray-700">{selectedItem.message}</p>
            {selectedItem.reply_message ? (
              <p className="mt-3 text-green-600 font-medium">✅ {selectedItem.reply_message}</p>
            ) : (
              <>
                <textarea
                  className="w-full mt-3 p-2 border rounded-lg"
                  placeholder="Type your reply..."
                  value={replyText[selectedItem._id] || ""}
                  onChange={(e) => handleReplyChange(selectedItem._id, e.target.value)}
                />
                <button
                  className={`mt-3 w-full font-medium py-2 rounded-lg transition duration-300 ${
                    selectedItem.reply_message
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  onClick={() => {
                    if (selectedItem.reply_message) {
                      setToastMessage("The message has already been replied to.");
                    } else {
                      sendReply(selectedItem._id);
                    }
                  }}
                  disabled={selectedItem.reply_message || loading}
                >
                  {loading ? "Sending..." : "✉️ Send Reply"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen ml-55">
      <SuperAdminPageNavbar />
      <div className="flex flex-1 p-4 space-x-4">
        <div className="w-1/4 max-w-[20%] space-y-4 shadow-md rounded-lg p-4 bg-white">
          <div className="flex items-center gap-2 mb-8">
            <Mail className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Inbox</h1>
          </div>
          <nav className="space-y-2">
            <button
              className={`w-full flex items-center gap-2 p-2 rounded transition duration-300 ${selectedCategory === 'Jobs' ? 'bg-yellow-50 text-yellow-600' : 'hover:bg-gray-200'}`}
              onClick={() => setSelectedCategory("Jobs")}
            >
              <Briefcase className="h-4 w-4" />
              Jobs
            </button>
            <button
              className={`w-full flex items-center gap-2 p-2 rounded transition duration-300 ${selectedCategory === 'internships' ? 'bg-yellow-50 text-yellow-600' : 'hover:bg-gray-200'}`}
              onClick={() => setSelectedCategory("internships")}
            >
              <GraduationCap className="h-4 w-4" />
              Internships
            </button>
            <button
              className={`w-full flex items-center gap-2 p-2 rounded transition duration-300 ${selectedCategory === 'studyMaterials' ? 'bg-yellow-50 text-yellow-600' : 'hover:bg-gray-200'}`}
              onClick={() => setSelectedCategory("studyMaterials")}
            >
              <BookOpen className="h-4 w-4" />
              Study Materials
            </button>
            <button
              className={`w-full flex items-center gap-2 p-2 rounded transition duration-300 ${selectedCategory === 'achievements' ? 'bg-yellow-50 text-yellow-600' : 'hover:bg-gray-200'}`}
              onClick={() => setSelectedCategory("achievements")}
            >
              <Trophy className="h-4 w-4" />
              Achievements
            </button>
            <button
              className={`w-full flex items-center gap-2 p-2 rounded transition duration-300 ${selectedCategory === 'studentAchievements' ? 'bg-yellow-50 text-yellow-600' : 'hover:bg-gray-200'}`}
              onClick={() => setSelectedCategory("studentAchievements")}
            >
              <Trophy className="h-4 w-4" />
              Student Achievements
            </button>
            <button
              className={`w-full flex items-center gap-2 p-2 rounded transition duration-300 ${selectedCategory === 'contactMessages' ? 'bg-yellow-50 text-yellow-600' : 'hover:bg-gray-200'}`}
              onClick={() => setSelectedCategory("contactMessages")}
            >
              <Mail className="h-4 w-4" />
              Contact Messages
            </button>
          </nav>
        </div>
        <div className="w-3/4 flex flex-col">
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
          <div className="flex-1 overflow-auto space-y-4">
            {selectedCategory === "contactMessages" ? renderContactMessages() : renderContent()}
          </div>
        </div>
        {selectedItem && (
          <div className="w-2/3 p-4">
            {selectedCategory === "contactMessages" ? renderContactPreview() : renderPreview()}
          </div>
        )}
      </div>
    </div>
  );
}

export default InboxPage;
