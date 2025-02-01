import { useState } from "react";
import LoginCard from "../components/Login/LoginCard";
import { apiBaseURL, AppPages } from "../utils/constants";
import axios from "axios";

export default function StudentLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const response = axios.post(`${apiBaseURL}/`);
    } catch (error) {}
  };

  return (
    <LoginCard
      page={AppPages.studentLogin}
      formData={formData}
      formDataSetter={setFormData}
      onSubmit={handleSubmit}
    />
  );
}
