import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSuitcase, FaClipboardList, FaFileSignature, FaRegFileAlt } from 'react-icons/fa';
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { FormInputField, FormTextAreaField } from '../../components/Common/InputField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MultiStepLoader as Loader } from "../../components/ui/multi-step-loader";

const loadingStates = [
  { text: "Gathering job details" },
  { text: "Checking application deadline" },
  { text: "Preparing application process" },
  { text: "Finalizing job posting" },
];

  const JobDetails = ({ formData, setFormData }) => {
    const workTypes = [
      "Full-time",
      "Part-time",
      "Contract",
      "Temporary",
      "Internship",
      "Volunteer",
    ];
  
    return (
      <>
            {/* Left Column */}
            <div className="flex flex-col space-y-2">
              <FormInputField
                label="Job Title"
                required={true}
                args={{ placeholder: "Enter the job title here", value: formData.title }}
                setter={(val) => setFormData(prev => ({ ...prev, title: val }))}
              />
              <FormInputField
                label="Job Level"
                required={true}
                args={{ placeholder: "Enter the job level here", value: formData.experience_level }}
                setter={(val) => setFormData(prev => ({ ...prev, experience_level: val }))}
              />
              <FormInputField
                label="Industry Type"
                args={{ placeholder: "Enter the industry type here", value: formData.industry_type }}
                setter={(val) => setFormData(prev => ({ ...prev, industry_type: val }))}
              />
              <FormInputField
                label="Company Name"
                required={true}
                args={{ placeholder: "Enter the company name here", value: formData.company_name }}
                setter={(val) => setFormData(prev => ({ ...prev, company_name: val }))}
              />
              <FormInputField
                label="Work Location"
                required={true}
                args={{ placeholder: "Enter the work location here", value: formData.job_location }}
                setter={(val) => setFormData(prev => ({ ...prev, job_location: val }))}
              />
            </div>
  
            {/* Right Column */}
            <div className="flex flex-col space-y-2">
              <FormTextAreaField
                label="Job Description"
                args={{ placeholder: "Enter the job description here", value: formData.job_description }}
                setter={(val) => setFormData(prev => ({ ...prev, job_description: val }))}
              />
              <div className="flex flex-col space-y-2">
                <label className="text-sm">Employment Type</label>
                <select
                  value={formData.work_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, work_type: e.target.value }))}
                  className="w-full text-sm border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select Employment Type</option>
                  {workTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <FormInputField
                label="Company Website"
                args={{ placeholder: "Enter the company website here", value: formData.company_website }}
                setter={(val) => setFormData(prev => ({ ...prev, company_website: val }))}
              />
              <FormInputField
                label="Salary Range"
                required={true}
                args={{ placeholder: "Enter the salary range here", value: formData.salary_range }}
                setter={(val) => setFormData(prev => ({ ...prev, salary_range: val }))}
              />
            </div>
      </>
    );
  };

  const Requirement = ({ formData, setFormData }) => {
    return (
      <>
            {/* Left Column */}
            <div className="flex flex-col space-y-2">
              <FormInputField
                label="Educational Qualification"
                args={{ placeholder: "Enter the educational qualification here", value: formData.education_requirements }}
                setter={(val) => setFormData(prev => ({ ...prev, education_requirements: val }))}
              />
              <FormInputField
                label="Professional Certifications"
                args={{ placeholder: "Enter the professional certifications here", value: formData.professional_certifications }}
                setter={(val) => setFormData(prev => ({ ...prev, professional_certifications: val }))}
              />
              <FormInputField
                label="Technical Skills Required"
                args={{ placeholder: "Enter the required technical skills here", value: (formData.technical_skills || []).join(',') }}
                setter={(val) => setFormData(prev => ({ ...prev, technical_skills: val.split(',') }))}
              />
              <FormInputField
                label="Age Limit"
                args={{ placeholder: "Enter the age limit here", value: formData.age_limit }}
                setter={(val) => setFormData(prev => ({ ...prev, age_limit: val }))}
              />
              <FormInputField
                label="Additional Skills"
                args={{ placeholder: "Enter the additional skills here", value: (formData.additional_skills || []).join(',') }}
                setter={(val) => setFormData(prev => ({ ...prev, additional_skills: val.split(',') }))}
              />
            </div>
  
            {/* Right Column */}
            <div className="flex flex-col space-y-2">
              <FormInputField
                label="Work Experience Requirement"
                args={{ placeholder: "Enter the required work experience here", value: formData.work_experience_requirement }}
                setter={(val) => setFormData(prev => ({ ...prev, work_experience_requirement: val }))}
              />
              <FormInputField
                label="Minimum Marks Requirement"
                args={{ placeholder: "Enter the required minimum marks here", value: formData.minimum_marks_requirement }}
                setter={(val) => setFormData(prev => ({ ...prev, minimum_marks_requirement: val }))}
              />
              <FormInputField
                label="Soft Skills Required"
                args={{ placeholder: "Enter the required soft skills here", value: (formData.soft_skills || []).join(',') }}
                setter={(val) => setFormData(prev => ({ ...prev, soft_skills: val.split(',') }))}
              />
              <FormTextAreaField
                label="Documents Required"
                args={{ placeholder: "Enter the required documents here", value: formData.documents_required }}
                setter={(val) => setFormData(prev => ({ ...prev, documents_required: val }))}
              />
            </div>
      </>
    );
  };
  const ApplicationProcess = ({ formData, setFormData }) => {
    return (
      <>
            {/* Left Column */}
            <div className="flex flex-col space-y-2">
              <FormInputField
                label="Job Posting Date"
                args={{ placeholder: "Enter the job posting date here", type: "date", value: formData.job_posting_date }}
                setter={(val) => setFormData(prev => ({ ...prev, job_posting_date: val }))}
              />
              <FormInputField
                label="Interview Start Date"
                args={{ placeholder: "Enter the interview start date here", type: "date", value: formData.interview_start_date }}
                setter={(val) => setFormData(prev => ({ ...prev, interview_start_date: val }))}
              />
              <FormInputField
                label="Job Link"
                required={true}
                args={{ placeholder: "Enter the job link here", value: formData.job_link }}
                setter={(val) => setFormData(prev => ({ ...prev, job_link: val }))}
              />
              <FormTextAreaField
                label="Selection Process"
                args={{ placeholder: "Enter the selection process here", value: formData.selection_process }}
                setter={(val) => setFormData(prev => ({ ...prev, selection_process: val }))}
              />
            </div>
  
            {/* Right Column */}
            <div className="flex flex-col space-y-2">
              <FormInputField
                label="Application Deadline"
                required={true}
                args={{ placeholder: "Enter the job level here", type: "date", value: formData.application_deadline }}
                setter={(val) => setFormData(prev => ({ ...prev, application_deadline: val }))}
              />
              <FormInputField
                label="Interview End Date"
                args={{ placeholder: "Enter the salary range here", type: "date", value: formData.interview_end_date }}
                setter={(val) => setFormData(prev => ({ ...prev, interview_end_date: val }))}
              />
              <FormTextAreaField
                label="Steps to Apply"
                args={{ placeholder: "Enter the steps to apply here", value: formData.steps_to_apply }}
                setter={(val) => setFormData(prev => ({ ...prev, steps_to_apply: val }))}
              />
            </div>
      </>
    );
  };

  const OtherInstructions = ({ formData, setFormData }) => {
    return (
      <>
            {/* Left Column */}
            <div className="flex flex-col space-y-2">
              <FormInputField
                label="Relocation Assistance"
                args={{ placeholder: "Enter the relocation assistance here", value: formData.relocation_assistance }}
                setter={(val) => setFormData(prev => ({ ...prev, relocation_assistance: val }))}
              />
              <FormInputField
                label="Expected Joining Date"
                args={{ placeholder: "Enter the expected joining date here", type: "date", value: formData.expected_joining_date }}
                setter={(val) => setFormData(prev => ({ ...prev, expected_joining_date: val }))}
              />
              <FormTextAreaField
                label="Key Responsibilities"
                args={{ placeholder: "Enter the key responsibilities here", value: (formData.key_responsibilities || []).join(',') }}
                setter={(val) => setFormData(prev => ({ ...prev, key_responsibilities: val.split(',') }))}
              />
            </div>
  
            {/* Right Column */}
            <div className="flex flex-col space-y-2">
              <FormInputField
                label="Remote Work Availability"
                args={{ placeholder: "Enter the remote work availability here", value: formData.remote_work_availability }}
                setter={(val) => setFormData(prev => ({ ...prev, remote_work_availability: val }))}
              />
              <FormInputField
                label="Work Schedule"
                args={{ placeholder: "Enter the work schedule here", value: formData.work_schedule }}
                setter={(val) => setFormData(prev => ({ ...prev, work_schedule: val }))}
              />
              <FormTextAreaField
                label="Preparation Tips"
                args={{ placeholder: "Enter the preparation tips here", value: formData.preparation_tips }}
                setter={(val) => setFormData(prev => ({ ...prev, preparation_tips: val }))}
              />
            </div>
          
      </>
    );
  };

const Summary = ({ formData, setFormData }) => {
  return (
    <>
      <div className="flex flex-col space-y-2">
        <FormInputField
          label="Job Title"
          required={true}
          disabled={true}
          args={{ placeholder: "Enter the job title here", value: formData.title }}
          setter={(val) => setFormData(prev => ({ ...prev, title: val }))}
        />
        <FormTextAreaField
          label="Job Description"
          disabled={true}
          args={{ placeholder: "Enter the job description here", value: formData.job_description }}
          setter={(val) => setFormData(prev => ({ ...prev, job_description: val }))}
        />
        <FormInputField
          label="Work Type"
          disabled={true}
          args={{ placeholder: "Select Work Type", value: formData.work_type }}
          setter={(val) => setFormData(prev => ({ ...prev, work_type: val }))}
        />
        <FormInputField
          label="Company Name"
          disabled={true}
          args={{ placeholder: "Enter the company name here", value: formData.company_name }}
          setter={(val) => setFormData(prev => ({ ...prev, company_name: val }))}
        />

        </div>
        <div className="flex flex-col space-y-2">
        <FormInputField
          label="Company Website"
          disabled={true}
          args={{ placeholder: "Enter the company website here", value: formData.company_website }}
          setter={(val) => setFormData(prev => ({ ...prev, company_website: val }))}
        />
        <FormInputField
          label="Work Location"
          disabled={true}
          args={{ placeholder: "Enter the work location here", value: formData.job_location }}
          setter={(val) => setFormData(prev => ({ ...prev, job_location: val }))}
        />
        <FormInputField
          label="Salary Range"
          disabled={true}
          args={{ placeholder: "Enter salary range here", value: formData.salary_range }}
          setter={(val) => setFormData(prev => ({ ...prev, salary_range: val }))}
        />
      </div>
    </>
  );
};

export default function JobPostForm() {
  const storedJobData = sessionStorage.getItem("jobData");
  const initialJobData = storedJobData ? JSON.parse(storedJobData) : {};

  const [formData, setFormData] = useState({
    // JobDetails Section (9 fields)
    title: initialJobData.title || "", // "Job Title" (FormInputField, required, placeholder: "Enter the job title here")
    job_description: initialJobData.job_description || "", // "Job Description" (FormTextAreaField, placeholder: "Enter the job description here")
    experience_level: initialJobData.experience_level || "", // "Job Level" (FormInputField, required, placeholder: "Enter the job level here")
    industry_type: initialJobData.industry_type || "", // "Industry Type" (FormInputField, placeholder: "Enter the industry type here")
    work_type: initialJobData.work_type || "", // "Employment Type" (select, placeholder: "Select Employment Type")
    company_name: initialJobData.company_name || "", // "Company Name" (FormInputField, required, placeholder: "Enter the company name here")
    company_website: initialJobData.company_website || "", // "Company Website" (FormInputField, placeholder: "Enter the company website here")
    job_location: initialJobData.job_location || "", // "Work Location" (FormInputField, required, placeholder: "Enter the work location here")
    salary_range: initialJobData.salary_range || "", // "Salary Range" (FormInputField, required, placeholder: "Enter the salary range here")
  
    // Requirement Section (9 fields)
    education_requirements: initialJobData.education_requirements || "", // "Educational Qualification" (FormInputField, placeholder: "Enter the educational qualification here")
    work_experience_requirement: initialJobData.work_experience_requirement || "", // "Work Experience Requirement" (FormInputField, placeholder: "Enter the required work experience here")
    professional_certifications: initialJobData.professional_certifications || "", // "Professional Certifications" (FormInputField, placeholder: "Enter the professional certifications here")
    minimum_marks_requirement: initialJobData.minimum_marks_requirement || "", // "Minimum Marks Requirement" (FormInputField, placeholder: "Enter the required minimum marks here")
    technical_skills: initialJobData.technical_skills || [], // "Technical Skills Required" (FormInputField, placeholder: "Enter the required technical skills here", comma-separated array)
    soft_skills: initialJobData.soft_skills || [], // "Soft Skills Required" (FormInputField, placeholder: "Enter the required soft skills here", comma-separated array)
    age_limit: initialJobData.age_limit || "", // "Age Limit" (FormInputField, placeholder: "Enter the age limit here")
    documents_required: initialJobData.documents_required || "", // "Documents Required" (FormTextAreaField, placeholder: "Enter the required documents here")
    additional_skills: initialJobData.additional_skills || [], // "Additional Skills" (FormInputField, placeholder: "Enter the additional skills here", comma-separated array)
  
    // ApplicationProcess Section (7 fields)
    job_posting_date: initialJobData.job_posting_date && !isNaN(Date.parse(initialJobData.job_posting_date))
      ? new Date(initialJobData.job_posting_date)
      : null, // "Job Posting Date" (FormInputField, type: "date", placeholder: "Enter the job posting date here")
    application_deadline: initialJobData.application_deadline && !isNaN(Date.parse(initialJobData.application_deadline))
      ? new Date(initialJobData.application_deadline)
      : null, // "Application Deadline" (FormInputField, required, type: "date", placeholder: "Enter the job level here")
    interview_start_date: initialJobData.interview_start_date && !isNaN(Date.parse(initialJobData.interview_start_date))
      ? new Date(initialJobData.interview_start_date)
      : null, // "Interview Start Date" (FormInputField, type: "date", placeholder: "Enter the interview start date here")
    interview_end_date: initialJobData.interview_end_date && !isNaN(Date.parse(initialJobData.interview_end_date))
      ? new Date(initialJobData.interview_end_date)
      : null, // "Interview End Date" (FormInputField, type: "date", placeholder: "Enter the salary range here")
    job_link: initialJobData.job_link || "", // "Job Link" (FormInputField, required, placeholder: "Enter the job link here")
    selection_process: initialJobData.selection_process || "", // "Selection Process" (FormTextAreaField, placeholder: "Enter the selection process here")
    steps_to_apply: initialJobData.steps_to_apply || "", // "Steps to Apply" (FormTextAreaField, placeholder: "Enter the steps to apply here")
  
    // OtherInstructions Section (6 fields)
    relocation_assistance: initialJobData.relocation_assistance || "", // "Relocation Assistance" (FormInputField, placeholder: "Enter the relocation assistance here")
    remote_work_availability: initialJobData.remote_work_availability || "", // "Remote Work Availability" (FormInputField, placeholder: "Enter the remote work availability here")
    expected_joining_date: initialJobData.expected_joining_date && !isNaN(Date.parse(initialJobData.expected_joining_date))
      ? new Date(initialJobData.expected_joining_date)
      : null, // "Expected Joining Date" (FormInputField, type: "date", placeholder: "Enter the expected joining date here")
    work_schedule: initialJobData.work_schedule || "", // "Work Schedule" (FormInputField, placeholder: "Enter the work schedule here")
    key_responsibilities: initialJobData.key_responsibilities || [], // "Key Responsibilities" (FormTextAreaField, placeholder: "Enter the key responsibilities here", comma-separated array)
    preparation_tips: initialJobData.preparation_tips || "", // "Preparation Tips" (FormTextAreaField, placeholder: "Enter the preparation tips here")
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const [formSections, setFormSections] = useState({
    "Job Details": { status: "active", icon: <FaSuitcase /> },
    "Job Requirement": { status: "unvisited", icon: <FaClipboardList /> },
    "Application Process": { status: "unvisited", icon: <FaFileSignature /> },
    "Other Instructions": { status: "unvisited", icon: <FaRegFileAlt /> },
    "Summary": { status: "unvisited", icon: <FaRegFileAlt /> },
  });

  const sectionKeys = Object.keys(formSections);
  const activeIndex = sectionKeys.findIndex(key => formSections[key].status === "active");

  const validateUrl = (url) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(url);
  };

  const validateApplicationDeadline = (deadline) => {
    const now = new Date();
    return new Date(deadline) > now;
  };

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 10000); // 10 seconds for loader
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      setError("Token has expired. Please log in again.");
      return;
    }

    if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
      setError('You do not have permission to access this page.');
    }

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(payload.role);
      if (payload.role === "admin") {
        setUserId(payload.admin_user);
      } else if (payload.role === "superadmin") {
        setUserId(payload.superadmin_user);
      }
    }
  }, [navigate]);
  const handleNavigation = (direction) => {
    const currentSection = sectionKeys[activeIndex];
    let isValid = true;
  
    // Only validate fields when navigating forward (next)
    if (direction === "next") {
      switch (currentSection) {
        case "Job Details":
          // || !formData.job_description || !formData.experience_level || !formData.company_name || !formData.job_location || !formData.salary_range || !formData.work_type
          if (!formData.title ) {
            toast.error("Please fill in all mandatory fields in Job Details.");
            isValid = false;
          }
          break;
        case "Requirement":
          // || !formData.education_requirements || !formData.experience_level
          if (!formData.technical_skills.length) {
            toast.error("Please fill in all mandatory fields in Requirements.");
            isValid = false;
          }
          break;
        case "Application Process":
          // || !formData.work_schedule || !formData.application_instructions
          if (!formData.application_deadline ) {
            toast.error("Please fill in all mandatory fields in Application Process.");
            isValid = false;
          }
          break;
        case "Other Instructions":
          if (!formData.key_responsibilities) {
            toast.error("Please fill in all mandatory fields in Other Instructions.");
            isValid = false;
          }
          break;
        default:
          break;
      }
    }
  
    if (!isValid) return;
  
    setFormSections(prevSections => {
      const updatedSections = { ...prevSections };
      if (activeIndex !== -1) {
        const currentKey = sectionKeys[activeIndex];
        const nextIndex = direction === "next" ? activeIndex + 1 : activeIndex - 1;
  
        if (nextIndex >= 0 && nextIndex < sectionKeys.length) {
          const nextKey = sectionKeys[nextIndex];
  
          if (direction === "next") {
            updatedSections[currentKey] = { ...updatedSections[currentKey], status: "completed" };
          }
  
          updatedSections[nextKey] = { ...updatedSections[nextKey], status: "active" };
  
          if (direction === "prev") {
            for (let i = nextIndex + 1; i < sectionKeys.length; i++) {
              updatedSections[sectionKeys[i]] = { ...updatedSections[sectionKeys[i]], status: "unvisited" };
            }
          }
        }
      }
      return updatedSections;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    setTimeout(async () => {
      if (!formData.title || !formData.company_name || !formData.job_link) {
        toast.error("Please fill in all mandatory fields.");
        setLoading(false);
        return;
      }

      if (formData.company_website && !validateUrl(formData.company_website)) {
        toast.error("Invalid URL for Company Website.");
        setLoading(false);
        return;
      }

      if (formData.application_deadline && !validateApplicationDeadline(formData.application_deadline)) {
        toast.error("Application Deadline must be a future date.");
        setLoading(false);
        return;
      }

      try {
        const token = Cookies.get('jwt');
        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        const formattedData = Object.keys(formData).reduce((acc, key) => {
          acc[key] = formData[key] === '' ? 'NA' : formData[key];
          if (key === 'application_deadline' && formData[key] instanceof Date) {
            acc[key] = formData[key].toISOString().split('T')[0];
            console.log("Form Data before submission:", formData); // Format as YYYY-MM-DD
          } else if (key === 'application_deadline' && typeof formData[key] === 'string') {
            // Ensure the string is in YYYY-MM-DD format or parse it if needed
            const date = new Date(formData[key]);
            acc[key] = !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : formData[key];
          }
          return acc;
          
        }, {});

        const response = await axios.post(
          "http://localhost:8000/api/job_post/",
          { ...formattedData, userId, role: userRole },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMessage(response.data.message);
        window.location.href = `${window.location.origin}/jobs`;
      } catch (error) {
        setError(`Error: ${error.response?.data?.error || 'Something went wrong'}`);
        toast.error(`Error: ${error.response?.data?.error || 'Something went wrong'}`);
      } finally {
        setIsSubmitting(false);
        setLoading(false);
      }
    }, 2000); // Match loader duration
  };

  return (
    <motion.div className="flex bg-gray-100 min-h-screen">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}

      <ToastContainer />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="flex-1 p-8 bg-white rounded-xl flex flex-col h-[80%]">
          <div className="flex justify-between items-center text-2xl pb-4 border-b border-gray-300">
            <p>Post a Job</p>
            <button
              className="px-3 p-1.5 border rounded-lg text-sm"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded shadow">
              {error}
            </div>
          )}

          <div className="flex items-stretch">
            <div className="w-1/4 border-r border-gray-300 flex flex-col p-4">
              <div className="border-y border-r border-gray-300 flex flex-col rounded-lg">
                <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
                {Object.entries(formSections).map(([section, prop], key, array) => (
                  <div
                    key={section}
                    className={`border-l-6 flex items-center p-2 border-b border-gray-300
                      ${key === 0 ? "rounded-tl-lg" : ""}
                      ${key === array.length - 1 ? "rounded-bl-lg border-b-transparent" : ""}
                      ${prop.status === "active" ? "border-l-yellow-400" : prop.status === "completed" ? "border-l-[#00B69B]" : "border-l-gray-300"}`}
                  >
                    <p className="text-gray-900 p-2 inline-block">{prop.icon}</p>
                    <p>{section}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  className="px-3 p-1 border rounded text-sm cursor-pointer"
                  disabled={activeIndex === 0}
                  onClick={() => handleNavigation("prev")}
                >
                  Previous
                </button>

                {activeIndex === sectionKeys.length - 1 ? (
                  <button
                    className="rounded bg-green-500 text-sm px-5 p-1 cursor-pointer"
                    onClick={handleSubmit}
                  >
                    Finish
                  </button>
                ) : (
                  <button
                    className="rounded bg-yellow-400 text-sm px-5 p-1 cursor-pointer"
                    disabled={activeIndex === sectionKeys.length - 1}
                    onClick={() => handleNavigation("next")}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 p-4 grid grid-cols-2 gap-4 items-stretch h-full">
              {formSections["Job Details"].status === "active" && <JobDetails formData={formData} setFormData={setFormData} />}
              {formSections["Job Requirement"].status === "active" && <Requirement formData={formData} setFormData={setFormData} />}
              {formSections["Application Process"].status === "active" && <ApplicationProcess formData={formData} setFormData={setFormData} />}
              {formSections["Other Instructions"].status === "active" && <OtherInstructions formData={formData} setFormData={setFormData} />}
              {formSections["Summary"].status === "active" && <Summary formData={formData} setFormData={setFormData} />}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}