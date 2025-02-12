import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { FaEnvelope, FaReply } from "react-icons/fa";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";

const StudentMail = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

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
          setMessages(data.messages || []);
        })
        .catch((err) => {
          console.error("Error fetching messages:", err);
          setError("Failed to load messages.");
        });
    } catch (err) {
      setError("Invalid token format.");
    }
  }, []);

  return (
    <div>
        <StudentPageNavbar />
        <section className="max-w-7xl mx-auto mt-10 p-6 bg-gray-50 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center mb-6">
            <FaEnvelope className="mr-3 text-pink-600" />
            Student Inbox
        </h2>

        {error ? (
            <p className="text-red-500">{error}</p>
        ) : messages.length > 0 ? (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {messages.map((message, index) => (
                <div
                key={index}
                className="p-5 border-b last:border-none hover:bg-gray-100 transition duration-300"
                >
                {/* Message Header */}
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">
                    {message.name}
                    </h3>
                    <p className="text-xs text-gray-500 italic">
                    {new Date(message.timestamp).toLocaleString()}
                    </p>
                </div>

                {/* Message Content */}
                <p className="text-gray-700 mt-2">{message.message}</p>

                {/* Reply Message */}
                {message.reply_message && (
                    <div className="mt-3 flex items-center bg-blue-100 p-3 rounded-md">
                    <FaReply className="text-blue-500 mr-2" />
                    <p className="text-blue-700 font-medium">
                        {message.reply_message}
                    </p>
                    </div>
                )}
                </div>
            ))}
            </div>
        ) : (
            <p className="text-center text-gray-500 italic">
            No messages found.
            </p>
        )}
        </section>
    </div>
  );
};

export default StudentMail;
