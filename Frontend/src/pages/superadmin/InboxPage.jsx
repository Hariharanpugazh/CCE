import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

const InboxPage = () => {
  const [messages, setMessages] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("contactMessages");
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    fetchMessages();
    fetchAchievements();
    fetchJobs();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get-contact-messages/");
      setMessages(response.data.messages);
    } catch (err) {
      console.error("Failed to fetch messages.");
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get_achievements_with_admin/");
      setAchievements(response.data.achievements);
    } catch (err) {
      console.error("Failed to fetch achievements.");
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get_jobs_with_admin/");
      setJobs(response.data.jobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const renderContent = () => {
    switch (selectedCategory) {
      case "contactMessages":
        return (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Contact Messages</h2>
            {messages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    className="bg-white shadow-md rounded-lg p-4 border border-gray-300 hover:shadow-lg cursor-pointer"
                    onClick={() => toggleExpand(index)}
                  >
                    <h2 className="text-lg font-semibold text-gray-700">{message.name}</h2>
                    <p className="text-sm text-gray-600 italic">{message.contact}</p>
                    <p className="text-sm text-gray-500">{message.timestamp}</p>
                    <AnimatePresence>
                      {expandedIndex === index && (
                        <motion.div
                          className="mt-4 text-gray-700 bg-white rounded-lg shadow-inner p-3 border border-gray-200"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="text-base font-medium text-gray-800">Message:</h3>
                          <p className="text-sm text-gray-600 mt-1">{message.message}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No contact messages found.</p>
            )}
          </section>
        );
        case "achievements":
          return (
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Achievements</h2>
              {achievements.length > 0 ? (
                <div className="bg-white shadow-md rounded-md">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      className="border-b p-4 hover:bg-gray-100 cursor-pointer"
                      onClick={() => toggleExpand(index)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{achievement.admin_name}</span>
                        <span className="text-sm text-gray-500">{achievement.timestamp}</span>
                      </div>
                      <p className="text-gray-700">{achievement.message}</p>
                      <p className="text-sm text-gray-600 font-medium">{achievement.achievement_data.description}</p>
                      <AnimatePresence>
                        {expandedIndex === index && (
                          <motion.div
                            className="mt-4 text-gray-700 bg-white rounded-lg shadow-inner p-3 border border-gray-200"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <h3 className="text-base font-medium text-gray-800">Details:</h3>
                            <p className="text-sm text-gray-600 mt-1">Type: {achievement.achievement_data.type}</p>
                            <p className="text-sm text-gray-600">Company: {achievement.achievement_data.company}</p>
                            <p className="text-sm text-gray-600">Date: {achievement.achievement_data.date}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">No achievements found.</p>
              )}
            </section>
        );
      case "Jobs":
        return (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Jobs</h2>
            {jobs.length > 0 ? (
              <div className="bg-white shadow-md rounded-md">
                {jobs.map((job, index) => (
                  <div key={index} className="border-b p-4 hover:bg-gray-100 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{job.admin_name}</span>
                      <span className="text-sm text-gray-500">{job.timestamp}</span>
                    </div>
                    <p className="text-gray-700">{job.message}</p>
                    <p className="text-sm text-gray-600">{job.job_data.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No job posts found.</p>
            )}
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <SuperAdminPageNavbar />
      <div className="flex flex-1">
        <div className="w-1/5 bg-gray-200 p-4">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <ul>
            <li onClick={() => setSelectedCategory("contactMessages")} className="cursor-pointer p-2 hover:bg-gray-300">Contact Messages</li>
            <li onClick={() => setSelectedCategory("achievements")} className="cursor-pointer p-2 hover:bg-gray-300">Achievements</li>
            <li onClick={() => setSelectedCategory("Jobs")} className="cursor-pointer p-2 hover:bg-gray-300">Jobs</li>
          </ul>
        </div>
        <div className="w-4/5 p-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default InboxPage;
