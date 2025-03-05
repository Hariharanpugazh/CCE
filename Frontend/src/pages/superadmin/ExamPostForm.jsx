import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSuitcase, FaClipboardList, FaFileSignature, FaRegFileAlt } from 'react-icons/fa';
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { FormInputField, FormTextAreaField } from '../../components/Common/InputField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MultiStepLoader as Loader } from "../../components/ui/multi-step-loader";

const loadingStates = [
  { text: "Gathering exam details" },
  { text: "Checking important dates" },
  { text: "Preparing application process" },
  { text: "Finalizing exam posting" },
];

const ExamBasicDetails = ({ formData, setFormData }) => {
  return (
    <>
      
          {/* Left Column */}
          <div className="flex flex-col space-y-2">
            <FormInputField
              label="Exam Title"
              required={true}
              args={{ placeholder: "Enter the exam title here", value: formData.exam_title }}
              setter={(val) => setFormData(prev => ({ ...prev, exam_title: val }))}
            />
            <FormInputField
              label="Eligibility Criteria"
              args={{ placeholder: "Enter the eligibility criteria here", value: formData.eligibility_criteria }}
              setter={(val) => setFormData(prev => ({ ...prev, eligibility_criteria: val }))}
            />
            <FormInputField
              label="Exam Centers"
              args={{ placeholder: "Enter the exam centers here", value: formData.exam_centers }}
              setter={(val) => setFormData(prev => ({ ...prev, exam_centers: val }))}
            />
            <FormInputField
              label="Exam Pattern"
              args={{ placeholder: "Enter the exam pattern here", value: formData.exam_pattern }}
              setter={(val) => setFormData(prev => ({ ...prev, exam_pattern: val }))}
            />
            <FormInputField
              label="Mock Test"
              args={{ placeholder: "Enter the mock test details here", value: formData.mock_test }}
              setter={(val) => setFormData(prev => ({ ...prev, mock_test: val }))}
            />
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-2">
            <FormTextAreaField
              label="About Exam"
              args={{ placeholder: "Enter details about the exam here", value: formData.about_exam }}
              setter={(val) => setFormData(prev => ({ ...prev, about_exam: val }))}
            />
            <FormInputField
              label="Exam Highlights"
              args={{ placeholder: "Enter exam highlights (comma-separated) here", value: (formData.exam_highlights || []).join(',') }}
              setter={(val) => setFormData(prev => ({ ...prev, exam_highlights: val.split(',') }))}
            />
            <FormInputField
              label="Admit Card"
              args={{ placeholder: "Enter admit card details here", value: formData.admit_card }}
              setter={(val) => setFormData(prev => ({ ...prev, admit_card: val }))}
            />
            <FormInputField
              label="Result"
              args={{ placeholder: "Enter result details here", value: formData.result }}
              setter={(val) => setFormData(prev => ({ ...prev, result: val }))}
            />
            <FormInputField
              label="Answer Key"
              args={{ placeholder: "Enter answer key details here", value: formData.answer_key }}
              setter={(val) => setFormData(prev => ({ ...prev, answer_key: val }))}
            />
          </div>
        
    </>
  );
};

const ExamContentDetails = ({ formData, setFormData }) => {
  return (
    <>
      
          {/* Left Column */}
          <div className="flex flex-col space-y-2">
            <FormTextAreaField
              label="Preparation Tips"
              args={{ placeholder: "Enter preparation tips here", value: formData.preparation_tips }}
              setter={(val) => setFormData(prev => ({ ...prev, preparation_tips: val }))}
            />
            <FormInputField
              label="Cutoff"
              args={{ placeholder: "Enter cutoff values (comma-separated) here", value: (formData.cutoff || []).join(',') }}
              setter={(val) => setFormData(prev => ({ ...prev, cutoff: val.split(',') }))}
            />
            <FormInputField
              label="Documents Required"
              args={{ placeholder: "Enter required documents here", value: formData.documents_required }}
              setter={(val) => setFormData(prev => ({ ...prev, documents_required: val }))}
            />
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-2">
            <FormTextAreaField
              label="Exam Analysis"
              args={{ placeholder: "Enter exam analysis here", value: formData.exam_analysis }}
              setter={(val) => setFormData(prev => ({ ...prev, exam_analysis: val }))}
            />
            <FormTextAreaField
              label="Selection Process"
              args={{ placeholder: "Enter selection process here", value: formData.selection_process }}
              setter={(val) => setFormData(prev => ({ ...prev, selection_process: val }))}
            />
            <FormInputField
              label="Question Paper"
              args={{ placeholder: "Enter question paper details here", value: formData.question_paper }}
              setter={(val) => setFormData(prev => ({ ...prev, question_paper: val }))}
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
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-2">
            <FormInputField
              label="Application Deadline"
              required={true}
              args={{ placeholder: "Enter the application deadline here", type: "date", value: formData.application_deadline }}
              setter={(val) => setFormData(prev => ({ ...prev, application_deadline: val }))}
            />
            <FormInputField
              label="Interview End Date"
              args={{ placeholder: "Enter the interview end date here", type: "date", value: formData.interview_end_date }}
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

const ExamAdditionalInfo = ({ formData, setFormData }) => {
  return (
    <>
      
          {/* Left Column */}
          <div className="flex flex-col space-y-2">
            <FormInputField
              label="Relocation Assistance"
              args={{ placeholder: "Enter relocation assistance here", value: formData.relocation_assistance }}
              setter={(val) => setFormData(prev => ({ ...prev, relocation_assistance: val }))}
            />
            <FormInputField
              label="Expected Joining Date"
              args={{ placeholder: "Enter expected joining date here", type: "date", value: formData.expected_joining_date }}
              setter={(val) => setFormData(prev => ({ ...prev, expected_joining_date: val }))}
            />
            <FormTextAreaField
              label="Frequently Asked Questions (FAQ)"
              args={{ placeholder: "Enter FAQ here", value: formData.faq }}
              setter={(val) => setFormData(prev => ({ ...prev, faq: val }))}
            />
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-2">
            <FormInputField
              label="Remote Work Availability"
              args={{ placeholder: "Enter remote work availability here", value: formData.remote_work_availability }}
              setter={(val) => setFormData(prev => ({ ...prev, remote_work_availability: val }))}
            />
            <FormInputField
              label="Work Schedule"
              args={{ placeholder: "Enter work schedule here", value: formData.work_schedule }}
              setter={(val) => setFormData(prev => ({ ...prev, work_schedule: val }))}
            />
            <FormTextAreaField
              label="Important Dates"
              required={true}
              args={{ placeholder: "Enter important dates here", value: formData.important_dates }}
              setter={(val) => setFormData(prev => ({ ...prev, important_dates: val }))}
            />
          </div>
        
    </>
  );
};

const Summary = ({ formData, setFormData }) => {
  return (
    <>
      
          {/* Left Column (Limited Fields for Summary) */}
          <div className="flex flex-col space-y-2">
            <FormInputField
              label="Exam Title"
              required={true}
              disabled={true}
              args={{ placeholder: "Enter the exam title here", value: formData.exam_title }}
              setter={(val) => setFormData(prev => ({ ...prev, exam_title: val }))}
            />
            <FormInputField
              label="Eligibility Criteria"
              disabled={true}
              args={{ placeholder: "Enter the eligibility criteria here", value: formData.eligibility_criteria }}
              setter={(val) => setFormData(prev => ({ ...prev, eligibility_criteria: val }))}
            />
            <FormInputField
              label="Job Posting Date"
              disabled={true}
              args={{ placeholder: "Enter the job posting date here", type: "date", value: formData.job_posting_date }}
              setter={(val) => setFormData(prev => ({ ...prev, job_posting_date: val }))}
            />
            <FormInputField
              label="Job Link"
              disabled={true}
              args={{ placeholder: "Enter the job link here", value: formData.job_link }}
              setter={(val) => setFormData(prev => ({ ...prev, job_link: val }))}
            />
          </div>

          {/* Right Column (Limited Fields for Summary) */}
          <div className="flex flex-col space-y-2">
            <FormTextAreaField
              label="About Exam"
              disabled={true}
              args={{ placeholder: "Enter details about the exam here", value: formData.about_exam }}
              setter={(val) => setFormData(prev => ({ ...prev, about_exam: val }))}
            />
            <FormInputField
              label="Application Deadline"
              disabled={true}
              args={{ placeholder: "Enter the application deadline here", type: "date", value: formData.application_deadline }}
              setter={(val) => setFormData(prev => ({ ...prev, application_deadline: val }))}
            />
            <FormTextAreaField
              label="Steps to Apply"
              disabled={true}
              args={{ placeholder: "Enter the steps to apply here", value: formData.steps_to_apply }}
              setter={(val) => setFormData(prev => ({ ...prev, steps_to_apply: val }))}
            />
            <FormInputField
              label="Important Dates"
              disabled={true}
              args={{ placeholder: "Enter important dates here", value: formData.important_dates }}
              setter={(val) => setFormData(prev => ({ ...prev, important_dates: val }))}
            />
          </div>
        
    </>
  );
};

export default function ExamPostForm() {
  const storedExamData = sessionStorage.getItem("examData");
  const initialExamData = storedExamData ? JSON.parse(storedExamData) : {};

  const [formData, setFormData] = useState({
    exam_title: initialExamData.exam_title || "",
    about_exam: initialExamData.about_exam || "",
    exam_highlights: initialExamData.exam_highlights || [], // Array for comma-separated input
    eligibility_criteria: initialExamData.eligibility_criteria || "",
    application_process: initialExamData.application_process || "",
    documents_required: initialExamData.documents_required || "",
    exam_centers: initialExamData.exam_centers || "",
    exam_pattern: initialExamData.exam_pattern || "",
    mock_test: initialExamData.mock_test || "",
    admit_card: initialExamData.admit_card || "",
    preparation_tips: initialExamData.preparation_tips || "",
    result: initialExamData.result || "",
    answer_key: initialExamData.answer_key || "",
    exam_analysis: initialExamData.exam_analysis || "",
    cutoff: initialExamData.cutoff || [], // Array for comma-separated input
    selection_process: initialExamData.selection_process || "",
    question_paper: initialExamData.question_paper || "",
    faq: initialExamData.faq || "",
    important_dates: initialExamData.important_dates || "",
    syllabus: initialExamData.syllabus || "",
    participating_institutes: initialExamData.participating_institutes || "",
    job_posting_date: initialExamData.job_posting_date && !isNaN(Date.parse(initialExamData.job_posting_date))
      ? new Date(initialExamData.job_posting_date)
      : null,
    application_deadline: initialExamData.application_deadline && !isNaN(Date.parse(initialExamData.application_deadline))
      ? new Date(initialExamData.application_deadline)
      : null,
    interview_start_date: initialExamData.interview_start_date && !isNaN(Date.parse(initialExamData.interview_start_date))
      ? new Date(initialExamData.interview_start_date)
      : null,
    interview_end_date: initialExamData.interview_end_date && !isNaN(Date.parse(initialExamData.interview_end_date))
      ? new Date(initialExamData.interview_end_date)
      : null,
    job_link: initialExamData.job_link || "",
    steps_to_apply: initialExamData.steps_to_apply || "",
    relocation_assistance: initialExamData.relocation_assistance || "",
    remote_work_availability: initialExamData.remote_work_availability || "",
    expected_joining_date: initialExamData.expected_joining_date && !isNaN(Date.parse(initialExamData.expected_joining_date))
      ? new Date(initialExamData.expected_joining_date)
      : null,
    work_schedule: initialExamData.work_schedule || "",
    key_responsibilities: initialExamData.key_responsibilities || [],
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
    "Exam Basic Details": { status: "active", icon: <FaSuitcase /> },
    "Exam Content Details": { status: "unvisited", icon: <FaClipboardList /> },
    "Application Process": { status: "unvisited", icon: <FaFileSignature /> },
    "Exam Additional Info": { status: "unvisited", icon: <FaRegFileAlt /> },
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
        case "Exam Basic Details":
          if (!formData.exam_title || !formData.application_process || !formData.important_dates) {
            toast.error("Please fill in all mandatory fields in Exam Basic Details.");
            isValid = false;
          }
          break;
        case "Exam Content Details":
          if (!formData.documents_required) {
            toast.error("Please fill in all mandatory fields in Exam Content Details.");
            isValid = false;
          }
          break;
        case "Application Process":
          if (!formData.application_deadline || !formData.job_link || !formData.steps_to_apply) {
            toast.error("Please fill in all mandatory fields in Application Process.");
            isValid = false;
          }
          break;
        case "Exam Additional Info":
          if (!formData.relocation_assistance || !formData.remote_work_availability || !formData.important_dates) {
            toast.error("Please fill in all mandatory fields in Exam Additional Info.");
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
      if (!formData.exam_title || !formData.application_process || !formData.important_dates || !formData.job_link) {
        toast.error("Please fill in all mandatory fields.");
        setLoading(false);
        return;
      }

      if (formData.job_link && !validateUrl(formData.job_link)) {
        toast.error("Invalid URL for Job Link.");
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
          if (key === 'application_deadline' || key === 'job_posting_date' || key === 'interview_start_date' || key === 'interview_end_date' || key === 'expected_joining_date') {
            if (formData[key] instanceof Date) {
              acc[key] = formData[key].toISOString().split('T')[0]; // Format as YYYY-MM-DD
            }
          }
          if (key === 'exam_highlights' || key === 'cutoff' || key === 'key_responsibilities') {
            if (Array.isArray(formData[key])) {
              acc[key] = formData[key].join(',');
            }
          }
          return acc;
        }, {});

        const response = await axios.post(
          "http://localhost:8000/api/post-exam/",
          { 
            ...formattedData, 
            role: userRole, 
            userId: userId 
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMessage(response.data.message);
        window.location.href = `${window.location.origin}/exams`;
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
            <p>Post an Exam</p>
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
              {formSections["Exam Basic Details"].status === "active" && <ExamBasicDetails formData={formData} setFormData={setFormData} />}
              {formSections["Exam Content Details"].status === "active" && <ExamContentDetails formData={formData} setFormData={setFormData} />}
              {formSections["Application Process"].status === "active" && <ApplicationProcess formData={formData} setFormData={setFormData} />}
              {formSections["Exam Additional Info"].status === "active" && <ExamAdditionalInfo formData={formData} setFormData={setFormData} />}
              {formSections["Summary"].status === "active" && <Summary formData={formData} setFormData={setFormData} />}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}