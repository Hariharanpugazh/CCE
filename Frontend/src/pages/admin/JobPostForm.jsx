import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom"; // Assuming you are using React Router for navigation

export default function JobPostForm() {
  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    company_overview: "",
    company_website: "",
    job_description: "",
    key_responsibilities: "",
    required_skills: "",
    education_requirements: "",
    experience_level: "",
    salary_range: "",
    benefits: "",
    job_location: "",
    work_type: "",
    work_schedule: "",
    application_instructions: "",
    application_deadline: "",
    contact_email: "",
    contact_phone: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    const decodedToken = jwtDecode(token);
    if (decodedToken.role !== "superadmin" && decodedToken.role !== "admin") {
      // Optionally, you can redirect the user to a different page
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    try {
      const token = Cookies.get("jwt");
      console.log("JWT Token:", token);

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);

      const response = await axios.post(
        "http://localhost:8000/api/job_post/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.error || "Something went wrong");
      setMessage("");
    }
  };

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Post a Job</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Company Name</label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Company Overview</label>
          <textarea
            name="company_overview"
            value={formData.company_overview}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          ></textarea>
        </div>
        <div>
          <label className="block font-medium">Company Website</label>
          <input
            type="url"
            name="company_website"
            value={formData.company_website}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Job Description</label>
          <textarea
            name="job_description"
            value={formData.job_description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          ></textarea>
        </div>
        <div>
          <label className="block font-medium">Key Responsibilities</label>
          <textarea
            name="key_responsibilities"
            value={formData.key_responsibilities}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          ></textarea>
        </div>
        <div>
          <label className="block font-medium">Required Skills</label>
          <textarea
            name="required_skills"
            value={formData.required_skills}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          ></textarea>
        </div>
        <div>
          <label className="block font-medium">Education Requirements</label>
          <textarea
            name="education_requirements"
            value={formData.education_requirements}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          ></textarea>
        </div>
        <div>
          <label className="block font-medium">Experience Level</label>
          <input
            type="text"
            name="experience_level"
            value={formData.experience_level}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Salary Range</label>
          <input
            type="text"
            name="salary_range"
            value={formData.salary_range}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Benefits</label>
          <textarea
            name="benefits"
            value={formData.benefits}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          ></textarea>
        </div>
        <div>
          <label className="block font-medium">Job Location</label>
          <input
            type="text"
            name="job_location"
            value={formData.job_location}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Work Type</label>
          <input
            type="text"
            name="work_type"
            value={formData.work_type}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Work Schedule</label>
          <input
            type="text"
            name="work_schedule"
            value={formData.work_schedule}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Application Instructions</label>
          <textarea
            name="application_instructions"
            value={formData.application_instructions}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          ></textarea>
        </div>
        <div>
          <label className="block font-medium">Application Deadline</label>
          <input
            type="date"
            name="application_deadline"
            value={formData.application_deadline}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Contact Email</label>
          <input
            type="email"
            name="contact_email"
            value={formData.contact_email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Contact Phone</label>
          <input
            type="text"
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Job
        </button>
      </form>
    </div>
  );
}
