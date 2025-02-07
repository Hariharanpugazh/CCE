import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import { motion } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

export default function SuperadminJobPost() {
  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    company_overview: "",
    company_website: "",
    job_description: "",
    key_responsibilities: "",
    required_skills: [],
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
    job_link: "",
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedWorkType, setSelectedWorkType] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isWorkTypeOpen, setIsWorkTypeOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const categories = [
    "TNPC",
    "Army and Defence",
    "IT & Development",
    "Civil",
    "Banking",
    "UPSC",
    "Biomedical",
    "TNPSC",
    "Army and Defence Systems",
  ];

  const workTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Temporary",
    "Internship",
    "Volunteer",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
  };

  const handleWorkTypeChange = (workType) => {
    setSelectedWorkType(workType);
    setIsWorkTypeOpen(false);
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      application_deadline: date,
    });
  };

  const handleRequiredSkillsChange = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const skill = e.target.value.trim();
      if (skill && !formData.required_skills.includes(skill)) {
        setFormData({
          ...formData,
          required_skills: [...formData.required_skills, skill],
        });
        e.target.value = "";
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      required_skills: formData.required_skills.filter(skill => skill !== skillToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("jwt");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/superjob_post/",
        { ...formData, selectedCategory, selectedWorkType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data.message);
      window.location.href = `${window.location.origin}/superadmin-dashboard`;
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setMessage("");
    }
  };

  const PreviewField = ({ label, value, multiline = false, url = false, email = false, phone = false }) => {
    if (!value) return null;

    let content = value;
    if (url) content = <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{value}</a>;
    if (email) content = <a href={`mailto:${value}`} className="text-blue-600 hover:underline">{value}</a>;
    if (phone) content = <a href={`tel:${value}`} className="text-blue-600 hover:underline">{value}</a>;

    return (
      <div>
        <h4 className="text-sm font-semibold text-gray-600 mb-1">{label}</h4>
        {multiline ? (
          <p className="text-gray-800 whitespace-pre-line">{content}</p>
        ) : (
          <p className="text-gray-800">{content}</p>
        )}
      </div>
    );
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto p-8 bg-white shadow-xl rounded-2xl relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Post a Job</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="col-span-1 relative">
          <label className="block text-sm font-semibold mb-2">
            Job Categories <span className="text-red-600">*</span>
          </label>
          <motion.div
            className="cursor-pointer w-full border border-gray-300 p-2.5 rounded-lg flex justify-between items-center transition-all duration-300"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            whileHover={{
              backgroundColor: "#e0f2ff", // Use hex value
              borderColor: "#3B82F6",
            }}
            style={{
              borderColor: isCategoryOpen ? "#3B82F6" : "#D1D5DB",
              backgroundColor: isCategoryOpen ? "#e0f2ff" : "white", // Use hex value
            }}
          >
            <span className="text-sm text-gray-700">
              {selectedCategory || "Select Job Category"}
            </span>
            <motion.span
              whileHover={{
                scale: 1.2,
              }}
              className="text-sm text-gray-700"
            >
              {isCategoryOpen ? "▲" : "▼"}
            </motion.span>
          </motion.div>

          {isCategoryOpen && (
            <div className="absolute z-10 mt-2 space-y-2 p-3 border border-gray-300 rounded-lg w-full bg-white shadow-lg">
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    type="radio"
                    name="job_category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={() => handleCategoryChange(category)}
                    className="mr-2"
                  />
                  <span>{category}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-semibold mb-2">
            Job Link <span className="text-red-600">*</span>
          </label>
          <motion.input
            type="url"
            name="job_link"
            value={formData.job_link}
            onChange={handleChange}
            required
            whileHover={{ backgroundColor: "#e0f2ff" }} // Use hex value
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
            placeholder="Enter job link"
          />
        </div>
      </div>

      {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="col-span-1">
          <label className="block text-sm font-semibold mb-2 capitalize">
            Required Skills <span className="text-red-600">*</span>
          </label>
          <motion.input
            type="text"
            name="required_skills"
            onKeyDown={handleRequiredSkillsChange}
            whileHover={{ backgroundColor: "#e0f2ff" }} // Use hex value
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
            placeholder="Enter required skills and press Enter"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.required_skills.map((skill, index) => (
              <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-2">
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 relative">
          <label className="block text-sm font-semibold mb-2">
            Work Type <span className="text-red-600">*</span>
          </label>
          <motion.div
            className="cursor-pointer w-full border border-gray-300 p-2.5 rounded-lg flex justify-between items-center transition-all duration-300"
            onClick={() => setIsWorkTypeOpen(!isWorkTypeOpen)}
            whileHover={{
              backgroundColor: "#e0f2ff", // Use hex value
              borderColor: "#3B82F6",
            }}
            style={{
              borderColor: isWorkTypeOpen ? "#3B82F6" : "#D1D5DB",
              backgroundColor: isWorkTypeOpen ? "#e0f2ff" : "white", // Use hex value
            }}
          >
            <span className="text-sm text-gray-700">
              {selectedWorkType || "Select Work Type"}
            </span>
            <motion.span
              whileHover={{
                scale: 1.2,
              }}
              className="text-sm text-gray-700"
            >
              {isWorkTypeOpen ? "▲" : "▼"}
            </motion.span>
          </motion.div>

          {isWorkTypeOpen && (
            <div className="absolute z-20 mt-2 space-y-2 p-3 border border-gray-300 rounded-lg w-full bg-white shadow-lg">
              {workTypes.map((workType) => (
                <div key={workType} className="flex items-center">
                  <input
                    type="radio"
                    name="work_type"
                    value={workType}
                    checked={selectedWorkType === workType}
                    onChange={() => handleWorkTypeChange(workType)}
                    className="mr-2"
                  />
                  <span>{workType}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {Object.keys(formData).map((field) => {
          if (field !== "application_deadline" && field !== "required_skills" && field !== "job_link" && field !== "work_type") {
            return (
              <div key={field} className="col-span-1">
                <label className="block text-sm font-semibold mb-2 capitalize">
                  {field.replace(/_/g, " ")} <span className="text-red-600">*</span>
                </label>
                <motion.input
                  type={field.includes("email")
                    ? "email"
                    : field.includes("phone")
                    ? "tel"
                    : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  whileHover={{ backgroundColor: "#e0f2ff" }} // Use hex value
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                  placeholder={`Enter ${field.replace(/_/g, " ")}`}
                />
              </div>
            );
          }
          return null;
        })}

        <div className="col-span-1">
          <label className="block text-sm font-semibold mb-2 capitalize">
            Application Deadline <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <DatePicker
              selected={formData.application_deadline}
              onChange={handleDateChange}
              dateFormat="MM/dd/yyyy"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow pl-10"
              placeholderText="Select a date"
            />
            <FaCalendarAlt
              onClick={(e) => {
                e.target.previousSibling.focus();
              }}
              className="absolute left-3 top-3 text-gray-500 cursor-pointer"
            />
          </div>
        </div>

        <motion.button
          type="button"
          className="col-span-2 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-transform shadow-lg"
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsPreview(true)}
        >
          Preview Job
        </motion.button>

        <motion.button
          type="submit"
          className="col-span-2 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-transform shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Publish Job
        </motion.button>
      </form>

      {isPreview && (
        <motion.div
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setIsPreview(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Job Preview</h2><br />
            <PreviewField label="Title" value={formData.title} /><br />
            <PreviewField label="Company Name" value={formData.company_name} /><br />
            <PreviewField label="Company Overview" value={formData.company_overview} multiline /><br />
            <PreviewField label="Company Website" value={formData.company_website} url /><br />
            <PreviewField label="Job Description" value={formData.job_description} multiline /><br />
            <PreviewField label="Key Responsibilities" value={formData.key_responsibilities} multiline /><br />
            <PreviewField
              label="Required Skills"
              value={formData.required_skills.join(", ")}
            /><br />
            <PreviewField label="Education Requirements" value={formData.education_requirements} /><br />
            <PreviewField label="Experience Level" value={formData.experience_level} /><br />
            <PreviewField label="Salary Range" value={formData.salary_range} /><br />
            <PreviewField label="Benefits" value={formData.benefits} multiline /><br />
            <PreviewField label="Job Location" value={formData.job_location} /><br />
            <PreviewField label="Work Type" value={selectedWorkType} /><br />
            <PreviewField label="Work Schedule" value={formData.work_schedule} /><br />
            <PreviewField label="Application Instructions" value={formData.application_instructions} multiline /><br />
            <PreviewField label="Application Deadline" value={formData.application_deadline} /><br />
            <PreviewField label="Contact Email" value={formData.contact_email} email /><br />
            <PreviewField label="Contact Phone" value={formData.contact_phone} phone /><br />
            <PreviewField label="Job Link" value={formData.job_link} url /><br />

          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
