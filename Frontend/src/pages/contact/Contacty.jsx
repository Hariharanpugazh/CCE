import React, { useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Contacty = () => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);

  // Get student email from localStorage
  const studentEmail = localStorage.getItem("student.email");

  // Extract student_id from JWT stored in cookies
  const token = Cookies.get("jwt");
  let studentId = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      studentId = decodedToken.student_user; // Extract student_id
    } catch (error) {
      setStatus("Invalid token format. Please log in again.");
    }
  }

  const sendMessage = async () => {
    if (!studentId) {
      setStatus("Student ID not found. Please log in.");
      return;
    }

    const studentData = {
      student_id: studentId,
      email: studentEmail,
      message: message,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/contact-us/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus("Message sent successfully!");
        setMessage(""); // Clear input field
      } else {
        setStatus(data.error);
      }
    } catch (error) {
      setStatus("Failed to send message. Try again.");
    }
  };

  return (
    <div className="contact-container">
      <h2>Contact Admin</h2>
      <textarea
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button onClick={sendMessage}>Send</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default Contacty;
