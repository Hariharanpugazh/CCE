import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

const InboxPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

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

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
        <SuperAdminPageNavbar />
      <h1 className="text-3xl font-bold mb-6 pt-5 text-center text-gray-800">Contact Inbox</h1>

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
        <p className="text-center text-gray-600">No messages found.</p>
      )}
    </div>
  );
};

export default InboxPage;
