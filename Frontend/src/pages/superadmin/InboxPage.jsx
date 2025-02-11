import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

const InboxPage = () => {
  const [messages, setMessages] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("contactMessages");

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/get-contact-messages/");
      const formattedMessages = response.data.messages.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp || "N/A",
      }));
      setMessages(formattedMessages);
    } catch (err) {
      setError("Failed to fetch messages.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/achievements/");
      setAchievements(response.data.achievements);
    } catch (err) {
      setError("Failed to fetch achievements.");
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchAchievements();
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const renderContent = () => {
    switch (selectedCategory) {
      case "achievements":
        return (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Achievements</h2>
            {achievements.length > 0 ? (
              <div className="grid grid-cols-1 pt-5 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    layout
                    className="bg-gradient-to-r from-green-100 to-gray-100 shadow-lg rounded-lg p-4 cursor-pointer border border-gray-300 hover:shadow-xl transition-shadow duration-300"
                    onClick={() => toggleExpand(index)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-700">{achievement.name}</h2>
                        <p className="text-sm text-gray-600 italic">{achievement.achievement_description}</p>
                      </div>
                      <p className="text-sm text-gray-500">{achievement.date_of_achievement}</p>
                    </div>

                    <AnimatePresence>
                      {expandedIndex === index && (
                        <motion.div
                          className="mt-4 text-gray-700 bg-white rounded-lg shadow-inner p-3 border border-gray-200"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="text-base font-medium text-gray-800">Achievement Details:</h3>
                          <p className="text-sm text-gray-600 mt-1">{achievement.achievement_description}</p>
                          {achievement.photo && (
                            <img src={`data:image/jpeg;base64,${achievement.photo}`} alt="Achievement" className="mt-2 rounded" />
                          )}
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
      default:
        return (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Contact Messages</h2>
            {messages.length > 0 ? (
              <div className="grid grid-cols-1 pt-5 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    layout
                    className="bg-gradient-to-r from-blue-100 to-gray-100 shadow-lg rounded-lg p-4 cursor-pointer border border-gray-300 hover:shadow-xl transition-shadow duration-300"
                    onClick={() => toggleExpand(index)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-700">{message.name}</h2>
                        <p className="text-sm text-gray-600 italic">{message.contact}</p>
                      </div>
                      <p className="text-sm text-gray-500">{message.timestamp}</p>
                    </div>

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
    }
  };

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col h-screen">
      <SuperAdminPageNavbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/5 bg-gray-200 p-4">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <ul>
            <li
              onClick={() => setSelectedCategory("contactMessages")}
              className="cursor-pointer p-2 hover:bg-gray-300"
            >
              Contact Messages
            </li>
            <li
              onClick={() => setSelectedCategory("achievements")}
              className="cursor-pointer p-2 hover:bg-gray-300"
            >
              Achievements
            </li>
            {/* Add more categories here as needed */}
          </ul>
        </div>
        {/* Content Area */}
        <div className="w-4/5 p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default InboxPage;
