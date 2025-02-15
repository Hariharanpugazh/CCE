import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { FaCheckDouble } from "react-icons/fa";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";

const StudentMail = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const studentId = decodedToken.student_user;

      if (!studentId) {
        setError("Invalid token. No student ID found.");
        return;
      }

      fetch(`http://localhost:8000/api/get_student_messages/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          const formattedMessages = data.messages.map(message => ({
            contact: message.contact,
            message: message.message,
            timestamp: message.timestamp,
            from: "student",
            reply_message: message.reply_message,
            reply_timestamp: message.reply_timestamp || new Date().toISOString(),
          }));
          setMessages(formattedMessages);
        })
        .catch((err) => {
          console.error("Error fetching messages:", err);
          setError("Failed to load messages.");
        });
    } catch (err) {
      setError("Invalid token format.");
    }
  }, []);

  const sendMessage = async () => {
    const token = Cookies.get("jwt");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/send_student_message/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { message: newMessage, from: "student", timestamp: new Date().toISOString() }
        ]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-screen"
    >
      <StudentPageNavbar />
      <section className="flex-1 flex flex-col p-6 w-4/5 mx-auto mt-4 rounded-lg shadow-lg">
        {/* Header Section */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-6"
        >
          <h2 className="text-3xl font-semibold text-gray-800 flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg text-gray-700 mr-3">
              A
            </div>
            Admin
          </h2>
        </motion.div>

        {/* Message Section */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {error ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-center"
            >
              {error}
            </motion.p>
          ) : messages.length > 0 ? (
            messages.map((message, index) => {
              const dateLabel = formatDate(message.timestamp);
              const shouldShowDate = index === 0 || formatDate(messages[index - 1].timestamp) !== dateLabel;

              return (
                <React.Fragment key={index}>
                  {shouldShowDate && (
                    <div className="text-center text-gray-500 mb-2">
                      {dateLabel}
                    </div>
                  )}

                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start ml-auto p-3 rounded-lg max-w-xs ${
                      message.from === "student" ? "justify-end bg-blue-500 text-white" : "justify-start bg-gray-200"
                    }`}
                  >
                    <div className={`flex flex-col ${message.from === "student" ? "items-end" : "items-start"}`}>
                      <p className="text-sm">{message.message}</p>
                      <div className="flex items-center mt-1 text-xs">
                        {message.from === "student" && (
                          <>
                            <span className="mr-1 text-white">
                              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <FaCheckDouble />
                          </>
                        )}
                        {message.from !== "student" && (
                          <span className="text-gray-500">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  {message.reply_message && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start p-3 rounded-lg max-w-xs justify-start bg-gray-200"
                    >
                      <div className="mr-auto">
                        <p className="text-sm">{message.reply_message}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          {new Date(message.reply_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      
                    </motion.div>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 italic"
            >
              No messages found.
            </motion.p>
          )}
        </div>

        {/* Input Section */}
        <div className="flex items-center mt-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <button
            onClick={sendMessage}
            className="ml-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 shadow-sm"
          >
            Send
          </button>
        </div>
      </section>
    </motion.div>
  );
};

export default StudentMail;
