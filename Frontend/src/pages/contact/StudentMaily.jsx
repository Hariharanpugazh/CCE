import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const StudentMaily = () => {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState(null);
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const token = Cookies.get("jwt"); // Get JWT from cookies
    if (!token) {
      setStatus("No token found. Please log in.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setStudentId(decodedToken.student_user); // Extract student_id from JWT
      fetchMessages(decodedToken.student_user); // Fetch messages using student_id
    } catch (error) {
      setStatus("Invalid token format.");
    }
  }, []);

  const fetchMessages = async (student_id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/get_student_messages/${student_id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("jwt")}`, // Send JWT token in Authorization header
        },
        credentials: "include",
      });

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendReply = async () => {
    if (!studentId) {
      setStatus("Student ID not found.");
      return;
    }

    const replyData = {
      student_id: studentId,
      content: reply,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/student_send_message/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("jwt")}`, // Send JWT token
        },
        body: JSON.stringify(replyData),
      });

      if (response.ok) {
        setStatus("Reply sent successfully!");
        setReply(""); // Clear input field
        fetchMessages(studentId); // Refresh chat
      } else {
        setStatus("Failed to send reply.");
      }
    } catch (error) {
      setStatus("Error sending reply.");
    }
  };

  return (
    <div className="inbox-container">
      <h2>Student Chat</h2>

      <div className="message-list">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender === "admin" ? "admin-msg" : "student-msg"}`}>
              <p><strong>{msg.sender}:</strong> {msg.content}</p>
              <span className="timestamp">{new Date(msg.timestamp).toLocaleString()}</span>
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>

      <textarea
        placeholder="Type your reply..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      ></textarea>
      <button onClick={sendReply}>Send</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default StudentMaily;
