import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const InboxPagey = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [adminId, setAdminId] = useState(null);

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
  }, []);

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
      setStudents(data.chats || []);
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
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
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

  return (
    <div className="admin-inbox">
      <h2>Admin Panel</h2>

      <div className="student-list">
        {students.map((student) => (
          <button key={student.student_id} onClick={() => fetchMessages(student.student_id)}>
            {student.student_email}
          </button>
        ))}
      </div>

      {selectedStudent && (
        <div className="chat-box">
          <h3>Chat with Student</h3>
          <div className="message-list">
            {messages.map((msg, index) => (
              <p key={index}><strong>{msg.sender}:</strong> {msg.content}</p>
            ))}
          </div>

          <textarea value={reply} onChange={(e) => setReply(e.target.value)}></textarea>
          <button onClick={sendReply}>Send</button>
        </div>
      )}
    </div>
  );
};

export default InboxPagey;
