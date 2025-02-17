import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { Mail, Bell, Briefcase, GraduationCap, BookOpen, Trophy, Search, X } from "lucide-react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { FaCheckDouble, FaCheck } from "react-icons/fa";

const InboxPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [adminId, setAdminId] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [jobs, setJobs] = useState([]);
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
  const [isChatOpen, setIsChatOpen] = useState(false);
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
    const token = Cookies.get("jwt");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setAdminId(decodedToken.superadmin_user); // Extract SuperAdmin ID
    } catch (error) {
      console.error("Invalid token format.");
    }

    fetchAllStudents();
    fetchMessages(selectedStudent);
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

  const fetchAllStudents = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/get_all_student_chats/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${Cookies.get("jwt")}`, // Pass JWT token
          "Content-Type": "application/json"
        },
        credentials: "include",
      });

      const data = await response.json();
      console.log("Fetched students data:", data.chats); // Debugging line
      setStudents(data.chats || []);
      // setSelectedStudent(data.chats[0].student_id);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchMessages = async (student_id) => {
    setSelectedStudent(student_id);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/get_student_messages/${student_id}/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${Cookies.get("jwt")}`, // Pass JWT token
          "Content-Type": "application/json"
        },
        credentials: "include",
      });

      const data = await response.json();
      console.log("Fetched messages data:", data); // Debugging line
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const markMessagesAsSeen = async (student_id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/mark_messages_as_seen/${student_id}/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Cookies.get("jwt")}`, // Pass JWT token
          "Content-Type": "application/json"
        },
        credentials: "include",
      });

      if (response.ok) {
        console.log("Messages marked as seen.");
        fetchMessages(student_id); // Refresh messages to reflect the status change
      } else {
        console.error("Failed to mark messages as seen.");
      }
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  };

  const sendReply = async () => {
    if (!selectedStudent) {
      console.error("No student selected.");
      return;
    }

    const replyData = {
      student_id: selectedStudent,
      content: reply,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin_reply_message/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Cookies.get("jwt")}`, // Pass JWT token
          "Content-Type": "application/json"
        },
        body: JSON.stringify(replyData),
      });

      if (response.ok) {
        setReply(""); // Clear input field
        fetchMessages(selectedStudent); // Refresh chat
      }
    } catch (error) {
      console.error("Error sending reply:", error);
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
        itemsToDisplay = students; // Display students for contact messages
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
    console.log("Items to display:", students); // Debugging line
    const filteredItems = itemsToDisplay.filter(item =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.admin_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.student_email?.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by student email
    );

    return (
      <section>
        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={index}
                className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition duration-300 cursor-pointer border border-gray-200"
                onClick={async () => {
                  if (selectedCategory === "contactMessages") {
                    setSelectedStudent(item.student_id);
                    await markMessagesAsSeen(item.student_id); // Mark messages as seen
                    await fetchMessages(item.student_id);
                    const response = await fetch(`http://localhost:8000/api/profile/${item.student_id}/`);
                    const data = await response.json();
                    item.name = data.data.name; // Add student name to the student object
                    setIsChatOpen(true); // Open chat interface
                  } else {
                    setSelectedItem(item);
                  }
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">{item.name || item.student_email}</span>
                </div>
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

  const renderChatInterface = () => {
    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex items-center mb-4">
          <button
            onClick={() => setIsChatOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition duration-300"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold ml-2">Chat with {selectedStudent && students.find(student => student.student_id === selectedStudent)?.name}</h2>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4">
          {messages.length > 0 ? (
            messages.map((message, index) => {
              const dateLabel = formatDate(message.timestamp);
              const shouldShowDate =
                index === 0 || formatDate(messages[index - 1].timestamp) !== dateLabel;

              return (
                <React.Fragment key={index}>
                  {shouldShowDate && (
                    <div className="text-center text-gray-500 mb-2">
                      {dateLabel}
                    </div>
                  )}
                  <div className="flex items-start mb-4">
                    <div
                      className={`flex flex-col ${
                        message.sender === "admin" ? "items-end ml-auto" : "items-start mr-auto"
                      }`}
                    >
                      <div
                        className={`flex items-start ${
                          message.sender === "admin" ? "justify-end" : "justify-start"
                        }`}
                      >
                        
                        {message.sender !== "admin" && (
                          <div
                            className={`w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg mr-2`}
                          >
                            S
                          </div>
                        )}
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg w-xs ${
                            message.sender === "admin" ? "bg-gray-200" : "bg-blue-500 text-white"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex justify-end items-center mt-1 text-xs">
                            {message.sender === "admin" && (
                              <>
                                <span className="mr-1 text-gray-500">
                                  {new Date(message.timestamp).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                {message.status === "seen" ? <FaCheckDouble /> : <FaCheck />}
                              </>
                            )}
                            {message.sender !== "admin" && (
                              <span className="text-white">
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                          </div>
                        </motion.div>
                        {message.sender === "admin" && (
                          <div
                            className={`w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg text-gray-700 ml-2`}
                          >
                            A
                          </div>
                        )}
                        
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            <p className="text-center text-gray-500 italic">No messages found.</p>
          )}
        </div>
        <div className="flex items-center mt-4">
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type a message"
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <button
            onClick={sendReply}
            className="ml-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-sm"
          >
            Send
          </button>
        </div>
      </div>
    );
  };

  const formatDate = (timestamp) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    const diff = today.getDate() - messageDate.getDate();

    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return messageDate.toLocaleDateString();
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
            {isChatOpen ? renderChatInterface() : renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InboxPage;
