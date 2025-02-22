import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

export default function JobPostForm() {
  const navigate = useNavigate();

  // Load AI-generated job data from sessionStorage
  const storedJobData = sessionStorage.getItem("jobData");
  const initialJobData = storedJobData ? JSON.parse(storedJobData) : {};

  const [activeSection, setActiveSection] = useState('jobDetails');
  const [formData, setFormData] = useState({
    jobTitle: initialJobData.title || "",
    jobLink: initialJobData.job_link || "",
    jobDescription: initialJobData.job_description || "",
    workType: initialJobData.work_type || "",
    salaryRange: initialJobData.salary_range || "",
    companyName: initialJobData.company_name || "",
    companyWebsite: initialJobData.company_website || "",
    companyLocation: initialJobData.job_location || "",
    companyOverview: initialJobData.company_overview || "",
    benefits: initialJobData.benefits || "",
    requiredSkills: initialJobData.required_skills?.join(", ") || "",
    keyResponsibilities: initialJobData.key_responsibilities?.join(", ") || "",
    educationRequirement: initialJobData.education_requirements || "",
    deadline: initialJobData.application_deadline && !isNaN(Date.parse(initialJobData.application_deadline))
      ? new Date(initialJobData.application_deadline)
      : null,
    contactEmail: initialJobData.contact_email || "",
    contactPhone: initialJobData.contact_phone?.join(", ") || "",
    experienceLevel: initialJobData.experience_level || "",
    workSchedule: initialJobData.work_schedule || "",
    applicationInstructions: initialJobData.application_instructions || "",
  });

  const [selectedCategory, setSelectedCategory] = useState(initialJobData.selectedCategory || "");
  const [isWorkTypeOpen, setIsWorkTypeOpen] = useState(false); // State for work type dropdown
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [disableSubmit, setDisableSubmit] = useState(false);

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

  // Validate URL
  const validateUrl = (url) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(url);
  };

  // Validate Application Deadline
  const validateApplicationDeadline = (deadline) => {
    const now = new Date();
    return new Date(deadline) > now;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      deadline: date,
    });
  };

  const handleRequiredSkillsChange = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const skills = e.target.value.trim().split(/[,]+/).map(skill => skill.trim()).filter(skill => skill);
      const newSkills = [...new Set([...formData.requiredSkills.split(",").map(s => s.trim()), ...skills])].filter(skill => skill);
      setFormData({
        ...formData,
        requiredSkills: newSkills.join(", "),
      });
      e.target.value = "";
    }
  };

  const handleclosed = () => {
    setIsPreview(false);
  };

  const handleRemoveSkill = (skillToRemove) => {
    const skills = formData.requiredSkills.split(",").map(s => s.trim()).filter(skill => skill !== skillToRemove);
    setFormData({
      ...formData,
      requiredSkills: skills.join(", "),
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    switch (activeSection) {
      case 'jobDetails':
        if (!formData.jobTitle || !formData.jobLink || !formData.workType) {
          setError("Please fill in all mandatory fields in Job Details.");
          return;
        }
        setActiveSection('companyDetails');
        break;
      case 'companyDetails':
        if (!formData.companyName || !formData.companyWebsite || !formData.companyLocation) {
          setError("Please fill in all mandatory fields in Company Details.");
          return;
        }
        setActiveSection('requirements');
        break;
      case 'requirements':
        if (!formData.benefits || !formData.requiredSkills || !formData.keyResponsibilities || !formData.educationRequirement || !formData.experienceLevel) {
          setError("Please fill in all mandatory fields in Requirements.");
          return;
        }
        setActiveSection('deadline');
        break;
      case 'deadline':
        if (!formData.deadline || !validateApplicationDeadline(formData.deadline) || !formData.workSchedule || !formData.applicationInstructions) {
          setError("Please fill in all mandatory fields in Deadline and Application Details.");
          return;
        }
        setActiveSection('summary');
        break;
      case 'summary':
        if (!formData.contactEmail || !formData.contactPhone) {
          setError("Please fill in all mandatory fields in Summary (Contact Information).");
          return;
        }
        break;
      default:
        break;
    }
    setError("");
  };

  const handlePrevious = () => {
    switch (activeSection) {
      case 'companyDetails':
        setActiveSection('jobDetails');
        break;
      case 'requirements':
        setActiveSection('companyDetails');
        break;
      case 'deadline':
        setActiveSection('requirements');
        break;
      case 'summary':
        setActiveSection('deadline');
        break;
      default:
        break;
    }
    setError("");
  };

  const isSectionCompleted = (section) => {
    switch (section) {
      case 'jobDetails':
        return formData.jobTitle && formData.jobLink && formData.jobDescription && formData.workType && formData.salaryRange;
      case 'companyDetails':
        return formData.companyName && formData.companyWebsite && formData.companyLocation && formData.companyOverview;
      case 'requirements':
        return formData.benefits && formData.requiredSkills && formData.keyResponsibilities && formData.educationRequirement && formData.experienceLevel;
      case 'deadline':
        return formData.deadline && formData.workSchedule && formData.applicationInstructions;
      case 'summary':
        return formData.contactEmail && formData.contactPhone;
      default:
        return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisableSubmit(true);

    if (!formData.jobTitle || !formData.companyName || !selectedCategory || !formData.jobLink) {
      setError("Please fill in all mandatory fields.");
      setDisableSubmit(false);
      return;
    }

    if (formData.companyWebsite && !validateUrl(formData.companyWebsite)) {
      setError("Invalid URL for Company Website.");
      setDisableSubmit(false);
      return;
    }

    if (formData.deadline && !validateApplicationDeadline(formData.deadline)) {
      setError("Application Deadline must be a future date.");
      setDisableSubmit(false);
      return;
    }

    try {
      const token = Cookies.get("jwt");
      if (!token) {
        setError("No token found. Please log in.");
        setDisableSubmit(false);
        return;
      }
      const response = await axios.post(
        "http://localhost:8000/api/job_post/",
        {
          title: formData.jobTitle,
          company_name: formData.companyName,
          company_overview: formData.companyOverview,
          company_website: formData.companyWebsite,
          job_description: formData.jobDescription,
          key_responsibilities: formData.keyResponsibilities.split(",").map(s => s.trim()),
          required_skills: formData.requiredSkills.split(",").map(s => s.trim()),
          education_requirements: formData.educationRequirement,
          experience_level: formData.experienceLevel,
          salary_range: formData.salaryRange,
          benefits: formData.benefits.split(",").map(s => s.trim()),
          job_location: formData.companyLocation,
          work_type: formData.workType,
          work_schedule: formData.workSchedule,
          application_instructions: formData.applicationInstructions,
          application_deadline: formData.deadline,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone.split(",").map(s => s.trim()),
          job_link: formData.jobLink,
          selectedWorktype: formData.workType,
          selectedCategory,
          userId,
          role: userRole
        }
      );

      setMessage(response.data.message);
      setError("");
      setDisableSubmit(false);
      setInterval(() => {
        window.location.href = `${window.location.origin}/jobs`;
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setMessage("");
      setDisableSubmit(false);
    }
  };

  const handlePreview = () => {
    setIsPreview(true);
  };

  const handleClose = () => {
    setIsPreview(false); // Close the preview modal
    setSelectedCategory(""); // Reset category
    setFormData({
      jobTitle: "",
      jobLink: "",
      jobDescription: "",
      workType: "",
      salaryRange: "",
      companyName: "",
      companyWebsite: "",
      companyLocation: "",
      companyOverview: "",
      benefits: "",
      requiredSkills: "",
      keyResponsibilities: "",
      educationRequirement: "",
      deadline: null,
      contactEmail: "",
      contactPhone: "",
      experienceLevel: "",
      workSchedule: "",
      applicationInstructions: "",
    });
    navigate(-1); // Navigate to the previous page
  };

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(payload.role);
      if (payload.role === "admin") {
        setUserId(payload.admin_user);
      } else if (payload.role === "superadmin") {
        setUserId(payload.superadmin_user);
      }
    }
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'jobDetails':
        return (
          <>
            <div className="flex gap-5 mb-3.75">
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-2 capitalize">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  placeholder="Enter the job title here"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-2">
                  Job Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="jobLink"
                  placeholder="Enter the job link here"
                  value={formData.jobLink}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                />
              </div>
            </div>
            <div className="mb-3.75">
              <label className="block text-sm font-semibold mb-2 capitalize">
                Job Description
              </label>
              <textarea
                name="jobDescription"
                placeholder="Enter the job description here"
                value={formData.jobDescription}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm h-24 resize-y focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
              />
            </div>
            <div className="flex gap-5">
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-2">
                  Work Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <motion.div
                    className="w-full border border-gray-300 p-2.5 rounded-lg flex justify-between items-center cursor-pointer transition-all duration-300"
                    onClick={() => setIsWorkTypeOpen(!isWorkTypeOpen)}
                    whileHover={{
                      backgroundColor: "#D1E7FF",
                      borderColor: "#3B82F6",
                    }}
                    style={{
                      borderColor: isWorkTypeOpen ? "#3B82F6" : "#D1D5DB",
                      backgroundColor: isWorkTypeOpen ? "#D1E7FF" : "white",
                    }}
                  >
                    <span className="text-sm text-gray-700">
                      {formData.workType || "Enter the work type here"}
                    </span>
                    <motion.span
                      whileHover={{ scale: 1.2 }}
                      className="text-sm text-gray-700"
                    >
                      {isWorkTypeOpen ? "▲" : "▼"}
                    </motion.span>
                  </motion.div>
                  {isWorkTypeOpen && (
                    <div className="absolute z-10 mt-2 space-y-2 p-3 border border-gray-300 rounded-lg w-full bg-white shadow-lg">
                      {workTypes.map((workType) => (
                        <div key={workType} className="flex items-center">
                          <input
                            type="radio"
                            name="workType"
                            value={workType}
                            checked={formData.workType === workType}
                            onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                            className="mr-2"
                          />
                          <span>{workType}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-2">
                  Salary Range
                </label>
                <input
                  type="text"
                  name="salaryRange"
                  placeholder="Enter the salary range here"
                  value={formData.salaryRange}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                />
              </div>
            </div>
          </>
        );
      case 'companyDetails':
        return (
          <>
            <div className="flex gap-5 mb-3.75">
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-2 capitalize">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Enter the job title here"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-2">
                  Company Website <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="companyWebsite"
                  placeholder="Enter the job link here"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                />
              </div>
            </div>
            <div className="mb-3.75">
              <label className="block text-sm font-semibold mb-2 capitalize">
                Company Overview
              </label>
              <textarea
                name="companyOverview"
                placeholder="Enter the job description here"
                value={formData.companyOverview}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm h-24 resize-y focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
              />
            </div>
            <div className="flex gap-5 mb-3.75">
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-2">
                  Conatct Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactEmail"
                  placeholder="Enter the contact Email here"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-2">
                  Conatct Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="contactPhone"
                  placeholder="Enter the Phone Number here"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                />
              </div>
            </div>
            <div className="flex gap-5">
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-2">
                  Company Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyLocation"
                  placeholder="Enter the work type here"
                  value={formData.companyLocation}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                />
              </div>
            </div>
          </>
        );
      case 'requirements':
        return (
          <>
            <div className="flex gap-5 mb-3.75">
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-2 capitalize">
                  Benefits
                </label>
                <input
                  type="text"
                  name="benefits"
                  placeholder="Enter the salary range here"
                  value={formData.benefits}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-2 capitalize">
                  Required Skills
                </label>
                <input
                  type="text"
                  name="requiredSkills"
                  onKeyDown={handleRequiredSkillsChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                  placeholder="Enter required skills and press Enter or comma"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.requiredSkills.split(",").map((skill, index) => (
                    skill.trim() && (
                      <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-2">
                        <span>{skill.trim()}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill.trim())}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          x
                        </button>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-3.75">
              <label className="block text-sm font-semibold mb-2 capitalize">
                Key Responsibilities
              </label>
              <textarea
                name="keyResponsibilities"
                placeholder="Enter the job description here"
                value={formData.keyResponsibilities}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm h-24 resize-y focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
              />
            </div>
            <div className="flex gap-5 mb-3.75">
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-2 capitalize">
                  Education Requirement
                </label>
                <input
                  type="text"
                  name="educationRequirement"
                  placeholder="Enter the work type here"
                  value={formData.educationRequirement}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-2 capitalize">
                  Experience Level
                </label>
                <input
                  type="text"
                  name="experienceLevel"
                  placeholder="Enter experience level here"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                />
              </div>
            </div>
          </>
        );
      case 'deadline':
        return (
          <>
            <div className="flex gap-5 mb-3.75">
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-2 capitalize">
                  Application Deadline <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DatePicker
                    selected={formData.deadline}
                    onChange={handleDateChange}
                    dateFormat="MM/dd/yyyy"
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow pl-10"
                    placeholderText="Select a date"
                    isClearable
                  />
                  <FaCalendarAlt
                    onClick={(e) => {
                      e.target.previousSibling.focus();
                    }}
                    className="absolute left-3 top-3 text-gray-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-5 mb-3.75">
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-2 capitalize">
                  Work Schedule <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="workSchedule"
                  placeholder="Enter work schedule here"
                  value={formData.workSchedule}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                />
              </div>
            </div>
            <div className="mb-3.75">
              <label className="block text-sm font-semibold mb-2 capitalize">
                Application Instructions <span className="text-red-500">*</span>
              </label>
              <textarea
                name="applicationInstructions"
                placeholder="Enter application instructions here"
                value={formData.applicationInstructions}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm h-24 resize-y focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
              />
            </div>
          </>
        );
      case 'summary':
        return (
          <div className="p-2.5 text-sm overflow-y-auto h-60">
            <p className="font-medium text-gray-800">Job Title: {formData.jobTitle || 'Not provided'}</p>
            <p className="text-gray-700">Job Link: {formData.jobLink || 'Not provided'}</p>
            <p className="text-gray-700">Job Description: {formData.jobDescription || 'Not provided'}</p>
            <p className="text-gray-700">Work Type: {formData.workType || 'Not provided'}</p>
            <p className="text-gray-700">Salary Range: {formData.salaryRange || 'Not provided'}</p>
            <p className="font-medium text-gray-800">Company Name: {formData.companyName || 'Not provided'}</p>
            <p className="text-gray-700">Company Website: {formData.companyWebsite || 'Not provided'}</p>
            <p className="text-gray-700">Company Location: {formData.companyLocation || 'Not provided'}</p>
            <p className="text-gray-700">Company Overview: {formData.companyOverview || 'Not provided'}</p>
            <p className="font-medium text-gray-800">Benefits: {formData.benefits || 'Not provided'}</p>
            <p className="text-gray-700">Required Skills: {formData.requiredSkills || 'Not provided'}</p>
            <p className="text-gray-700">Key Responsibilities: {formData.keyResponsibilities || 'Not provided'}</p>
            <p className="text-gray-700">Education Requirement: {formData.educationRequirement || 'Not provided'}</p>
            <p className="text-gray-700">Experience Level: {formData.experienceLevel || 'N/A'}</p>
            <p className="font-medium text-gray-800">Deadline: {formData.deadline?.toLocaleDateString() || 'Not provided'}</p>
            <p className="text-gray-700">Work Schedule: {formData.workSchedule || 'N/A'}</p>
            <p className="text-gray-700">Application Instructions: {formData.applicationInstructions || 'N/A'}</p>
            <p className="font-medium text-gray-800">Contact Email: {formData.contactEmail || 'N/A'}</p>
            <p className="text-gray-700">Contact Phone: {formData.contactPhone || 'N/A'}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="flex-1 mx-auto bg-white-100 h-screen flex items-center justify-center px-14"
    >
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      {/* <div className="p-8 w-900"> */}
      <div className="flex-1 bg-white p-13 rounded-xl shadow-lg ">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-800">Post a Job</h2>
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-100 font-medium"
          >
            Cancel
          </button>
        </div>
        <hr className="border-gray-300 mb-8" />
        <div className="flex gap-10 items-stretch">
          <div className="w-1/4  border border-gray-300 rounded-lg shadow-sm flex flex-col p-0 m-0">

            <p className={`p-3 flex-1 bg-white cursor-pointer rounded-lg font-medium relative pl-6 border-b border-gray-200 ${activeSection === 'jobDetails' ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-yellow-500' : isSectionCompleted('jobDetails') ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-green-500' : 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gray-300'}`}
              onClick={() => setActiveSection('jobDetails')}
            >
              Job Details
            </p>

            <p
              className={`p-3 flex-1 bg-white cursor-pointer rounded-lg font-medium relative pl-6 border-b border-gray-200 ${activeSection === 'companyDetails' ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-yellow-500' : isSectionCompleted('companyDetails') ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-green-500' : 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gray-300'}`}
              onClick={() => setActiveSection('companyDetails')}
            >
              Company Details
            </p>
            <p
              className={`p-3   flex-1 bg-white cursor-pointer rounded-lg font-medium relative pl-6 border-b border-gray-200 ${activeSection === 'requirements' ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-yellow-500' : isSectionCompleted('requirements') ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-green-500' : 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gray-300'}`}
              onClick={() => setActiveSection('requirements')}
            >
              Requirements
            </p>
            <p
              className={`p-3 flex-1 bg-white cursor-pointer rounded-lg font-medium relative pl-6 border-b border-gray-200 ${activeSection === 'deadline' ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-yellow-500' : isSectionCompleted('deadline') ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-green-500' : 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gray-300'}`}
              onClick={() => setActiveSection('deadline')}
            >
              Deadline
            </p>
            <p
              className={`p-3 flex-1 bg-white cursor-pointer rounded-lg font-medium relative pl-6 border-b border-gray-200 ${activeSection === 'summary' ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-yellow-500' : isSectionCompleted('summary   ') ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-green-500' : 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gray-300'}`}
              onClick={() => setActiveSection('summary')}
            >
              Summary
            </p>

          </div>
          <form onSubmit={handleNext} className="flex-1 flex flex-col justify-center gap-5 min-h-[500px] rounded-lg border border-gray-300 p-5">
            {renderSection()}

          </form>
        </div>
        <div className="mt-5 flex gap-2.5">
          {activeSection !== 'jobDetails' && (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-5 py-2.5 rounded-lg text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium"
            >
              Previous
            </button>
          )}
          {activeSection !== 'summary' ? (
            <button
              type="submit"
              onClick={handleNext}
              className="px-5 py-2.5 bg-yellow-500 text-black rounded-lg text-sm hover:bg-yellow-600 font-medium"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={disableSubmit}
              className={`px-5 py-2.5 rounded-lg text-sm ${disableSubmit ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'} font-medium`}
            >
              Submit
            </button>
          )}
          <button
            type="button"
            onClick={handlePreview}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 font-medium"
            whileHover={{ scale: 1.01 }}
          >
            Preview Job
          </button>
        </div>
      </div>

      {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      {isPreview && (
        <motion.div
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
        // initial={{ opacity: 0 }}
        // animate={{ opacity: 1 }}
        // transition={{ duration: 0.3 }}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={handleclosed}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
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
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Job Preview</h2>
            <PreviewField label="Title" value={formData.jobTitle} /><br />
            <PreviewField label="Company Name" value={formData.companyName} /><br />
            <PreviewField label="Company Overview" value={formData.companyOverview} multiline /><br />
            <PreviewField label="Company Website" value={formData.companyWebsite || "N/A"} url /><br />
            <PreviewField label="Job Description" value={formData.jobDescription} multiline /><br />
            <PreviewField label="Key Responsibilities" value={formData.keyResponsibilities} multiline /><br />
            <PreviewField label="Required Skills" value={formData.requiredSkills} /><br />
            <PreviewField label="Education Requirements" value={formData.educationRequirement} /><br />
            <PreviewField label="Experience Level" value={formData.experienceLevel} /><br />
            <PreviewField label="Salary Range" value={formData.salaryRange} /><br />
            <PreviewField label="Benefits" value={formData.benefits} multiline /><br />
            <PreviewField label="Job Location" value={formData.companyLocation} /><br />
            <PreviewField label="Work Type" value={formData.workType} /><br />
            <PreviewField label="Work Schedule" value={formData.workSchedule} /><br />
            <PreviewField label="Application Instructions" value={formData.applicationInstructions} multiline /><br />
            <PreviewField label="Application Deadline" value={formData.deadline ? formData.deadline.toLocaleDateString() : "N/A"} /><br />
            <PreviewField label="Contact Email" value={formData.contactEmail || "N/A"} email /><br />
            <PreviewField label="Contact Phone" value={formData.contactPhone || "N/A"} phone /><br />
            <PreviewField label="Job Link" value={formData.jobLink} url /><br />
          </div>
        </motion.div>
      )}
      {/* </div> */}
    </motion.div>
  );
}

const PreviewField = ({ label, value, multiline = false, url = false, email = false, phone = false }) => {
  let formattedValue = value;

  if (value instanceof Date) {
    formattedValue = value.toLocaleDateString();
  } else if (url) {
    formattedValue = <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{value}</a>;
  } else if (email) {
    formattedValue = <a href={`mailto:${value}`} className="text-blue-600 hover:underline">{value}</a>;
  } else if (phone) {
    formattedValue = <a href={`tel:${value}`} className="text-blue-600 hover:underline">{value}</a>;
  }

  if (!formattedValue && (label === "Title" || label === "Company Name" || label === "Job Link" || label === "Work Type")) {
    formattedValue = "";
  } else if (!formattedValue) {
    formattedValue = "N/A";
  }

  return (
    <div>
      <strong className="text-gray-800">{label}:</strong>
      {multiline ? <p className="text-gray-700">{formattedValue}</p> : <span className="text-gray-700 ml-2">{formattedValue}</span>}
    </div>
  );
};