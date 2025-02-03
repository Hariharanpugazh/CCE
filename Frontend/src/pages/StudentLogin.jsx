import { useState } from "react";
import LoginCard from "../components/Login/LoginCard";
import { apiEndpoints, AppPages } from "../utils/constants";
import axios from "axios";

export default function StudentLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(apiEndpoints.studentLogin, formData);
      alert(response.message)
      console.log(response)
    } catch (error) {
        alert(error.response?.data.error || error.message)
        console.log(error)
    }
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
