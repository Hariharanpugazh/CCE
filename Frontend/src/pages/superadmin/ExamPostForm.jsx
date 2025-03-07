import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSuitcase, FaClipboardList, FaFileSignature, FaRegFileAlt, FaPlus, FaTrash } from 'react-icons/fa';
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

// Helper Component for Key-Value Pair Inputs (Updated for Arrays)
const KeyValueInput = ({ label, items, onChange }) => {
  const handleAdd = () => {
    onChange([...items, { key: "", value: "" }]);
  };

  const handleRemove = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    onChange(newItems);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-semibold mb-1">{label}</label>
      {items.map((item, index) => (
        <div key={index} className="flex space-x-2 items-center">
          <input
            type="text"
            placeholder="Key (e.g., Name)"
            value={item.key}
            onChange={(e) => handleChange(index, "key", e.target.value)}
            className="w-1/2 text-sm border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Value (e.g., Common Admission Test)"
            value={item.value}
            onChange={(e) => handleChange(index, "value", e.target.value)}
            className="w-1/2 text-sm border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center text-blue-500 hover:text-blue-700"
      >
        <FaPlus className="mr-1" /> Add {label}
      </button>
    </div>
  );
};

// Component Definitions (Updated for Arrays)
const ExamBasicDetails = ({ formData, setFormData }) => {
  return (
    <>
      <div className="flex flex-col space-y-2">
        <FormInputField
          label="Exam Title"
          required={true}
          args={{ placeholder: "Enter the exam title here", value: formData.exam_title }}
          setter={(val) => setFormData(prev => ({ ...prev, exam_title: val }))}
        />
        <FormTextAreaField
          label="Eligibility Criteria"
          args={{ placeholder: "Enter the eligibility criteria here", value: formData.eligibility_criteria }}
          setter={(val) => setFormData(prev => ({ ...prev, eligibility_criteria: val }))}
        />
        <FormTextAreaField
          label="Application Process"
          required={true}
          args={{ placeholder: "Enter the application process here", value: formData.application_process }}
          setter={(val) => setFormData(prev => ({ ...prev, application_process: val }))}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <FormTextAreaField
          label="About Exam"
          args={{ placeholder: "Enter details about the exam here", value: formData.about_exam }}
          setter={(val) => setFormData(prev => ({ ...prev, about_exam: val }))}
        />
        <KeyValueInput
          label="Exam Highlights"
          items={formData.exam_highlights || []}
          onChange={(newHighlights) => setFormData(prev => ({ ...prev, exam_highlights: newHighlights }))}
        />
      </div>
    </>  
  );
};

const ExamRequirements = ({ formData, setFormData }) => {
  return (
    <>
      <div className="flex flex-col space-y-2">
        <FormTextAreaField
          label="Documents Required"
          args={{ placeholder: "Enter required documents here", value: formData.documents_required }}
          setter={(val) => setFormData(prev => ({ ...prev, documents_required: val }))}
        />
        <FormInputField
          label="Exam Centers"
          args={{ placeholder: "Enter the exam centers here", value: formData.exam_centers }}
          setter={(val) => setFormData(prev => ({ ...prev, exam_centers: val }))}
        />
        <FormTextAreaField
          label="Exam Pattern"
          args={{ placeholder: "Enter the exam pattern here", value: formData.exam_pattern }}
          setter={(val) => setFormData(prev => ({ ...prev, exam_pattern: val }))}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <FormTextAreaField
          label="Mock Test"
          args={{ placeholder: "Enter the mock test details here", value: formData.mock_test }}
          setter={(val) => setFormData(prev => ({ ...prev, mock_test: val }))}
        />
        <FormTextAreaField
          label="Admit Card"
          args={{ placeholder: "Enter admit card details here", value: formData.admit_card }}
          setter={(val) => setFormData(prev => ({ ...prev, admit_card: val }))}
        />
      </div>
    </>
  );
};

const ExamContentDetails = ({ formData, setFormData }) => {
  return (
    <>
      <div className="flex flex-col space-y-2">
        <FormTextAreaField
          label="Preparation Tips"
          args={{ placeholder: "Enter preparation tips here", value: formData.preparation_tips }}
          setter={(val) => setFormData(prev => ({ ...prev, preparation_tips: val }))}
        />
        <FormTextAreaField
          label="Result"
          args={{ placeholder: "Enter result details here", value: formData.result }}
          setter={(val) => setFormData(prev => ({ ...prev, result: val }))}
        />
        <FormTextAreaField
          label="Answer Key"
          args={{ placeholder: "Enter answer key details here", value: formData.answer_key }}
          setter={(val) => setFormData(prev => ({ ...prev, answer_key: val }))}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <FormTextAreaField
          label="Exam Analysis"
          args={{ placeholder: "Enter exam analysis here", value: formData.exam_analysis }}
          setter={(val) => setFormData(prev => ({ ...prev, exam_analysis: val }))}
        />
        <KeyValueInput
          label="Cutoff"
          items={formData.cutoff || []}
          onChange={(newCutoff) => setFormData(prev => ({ ...prev, cutoff: newCutoff }))}
        />
      </div>
    </>
  );
};

const ExamAdditionalInfo = ({ formData, setFormData }) => {
  return (
    <>
      <div className="flex flex-col space-y-2">
        <FormTextAreaField
          label="Selection Process"
          args={{ placeholder: "Enter selection process here", value: formData.selection_process }}
          setter={(val) => setFormData(prev => ({ ...prev, selection_process: val }))}
        />
        <FormTextAreaField
          label="Question Paper"
          args={{ placeholder: "Enter question paper details here", value: formData.question_paper }}
          setter={(val) => setFormData(prev => ({ ...prev, question_paper: val }))}
        />
        <FormTextAreaField
          label="Frequently Asked Questions (FAQ)"
          args={{ placeholder: "Enter FAQ here", value: formData.faq }}
          setter={(val) => setFormData(prev => ({ ...prev, faq: val }))}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <FormInputField
          label="Important Dates"
          required={true}
          args={{ placeholder: "Enter important dates here", value: formData.important_dates }}
          setter={(val) => setFormData(prev => ({ ...prev, important_dates: val }))}
        />
        <FormTextAreaField
          label="Syllabus"
          args={{ placeholder: "Enter the syllabus here", value: formData.syllabus }}
          setter={(val) => setFormData(prev => ({ ...prev, syllabus: val }))}
        />
        <FormTextAreaField
          label="Participating Institutes"
          args={{ placeholder: "Enter participating institutes here", value: formData.participating_institutes }}
          setter={(val) => setFormData(prev => ({ ...prev, participating_institutes: val }))}
        />
      </div>
    </>
  );
};

const Summary = ({ formData, setFormData }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
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
          label="Important Dates"
          disabled={true}
          args={{ placeholder: "Enter important dates here", value: formData.important_dates }}
          setter={(val) => setFormData(prev => ({ ...prev, important_dates: val }))}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <FormTextAreaField
          label="About Exam"
          disabled={true}
          args={{ placeholder: "Enter details about the exam here", value: formData.about_exam }}
          setter={(val) => setFormData(prev => ({ ...prev, about_exam: val }))}
        />
        <FormInputField
          label="Application Process"
          disabled={true}
          args={{ placeholder: "Enter the application process here", value: formData.application_process }}
          setter={(val) => setFormData(prev => ({ ...prev, application_process: val }))}
        />
      </div>
    </div>
  );
};

export default function ExamPostForm() {
  const storedExamData = sessionStorage.getItem("examData");
  const initialExamData = storedExamData ? JSON.parse(storedExamData) : {};

  const [formData, setFormData] = useState({
    exam_title: initialExamData.exam_title || "",
    about_exam: initialExamData.about_exam || "",
    exam_highlights: initialExamData.exam_highlights || [{ key: "", value: "" }],
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
    cutoff: initialExamData.cutoff || [{ key: "", value: "" }],
    selection_process: initialExamData.selection_process || "",
    question_paper: initialExamData.question_paper || "",
    faq: initialExamData.faq || "",
    important_dates: initialExamData.important_dates || "",
    syllabus: initialExamData.syllabus || "",
    participating_institutes: initialExamData.participating_institutes || "",
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
    "Exam Requirements": { status: "unvisited", icon: <FaClipboardList /> },
    "Exam Content Details": { status: "unvisited", icon: <FaFileSignature /> },
    "Exam Additional Info": { status: "unvisited", icon: <FaRegFileAlt /> },
    "Summary": { status: "unvisited", icon: <FaRegFileAlt /> },
  });

  const sectionKeys = Object.keys(formSections);
  const activeIndex = sectionKeys.findIndex(key => formSections[key].status === "active");

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
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

    if (direction === "next") {
      switch (currentSection) {
        case "Exam Basic Details":
          if (!formData.exam_title) {
            toast.error("Please fill in all mandatory fields in Exam Basic Details.");
            isValid = false;
          }
          break;
        case "Exam Requirements":
          if (!formData.documents_required) {
            toast.error("Please fill in all mandatory fields in Exam Requirements.");
            isValid = false;
          }
          break;
        case "Exam Additional Info":
          if (!formData.important_dates) {
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
      if (!formData.exam_title || !formData.application_process || !formData.important_dates) {
        toast.error("Please fill in all mandatory fields.");
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

        // Construct the payload to match the exact structure
        const payload = {
          exam_data: {
            exam_title: formData.exam_title || "NA"
          },
          about_exam: formData.about_exam || "NA",
          admit_card: formData.admit_card || "NA",
          answer_key: formData.answer_key || "NA",
          application_process: formData.application_process || "NA",
          cutoff: formData.cutoff
            .filter(item => item.key.trim() !== "" && item.value.trim() !== "")
            .map(item => ({ [item.key]: item.value })),
          documents_required: formData.documents_required || "NA",
          eligibility_criteria: formData.eligibility_criteria || "NA",
          exam_analysis: formData.exam_analysis || "NA",
          exam_centers: formData.exam_centers || "NA",
          exam_highlights: formData.exam_highlights
            .filter(item => item.key.trim() !== "" && item.value.trim() !== "")
            .map(item => ({ [item.key]: item.value })),
          exam_pattern: formData.exam_pattern || "NA",
          faq: formData.faq || "NA",
          important_dates: formData.important_dates || "NA",
          mock_test: formData.mock_test || "NA",
          participating_institutes: formData.participating_institutes || "NA",
          preparation_tips: formData.preparation_tips || "NA",
          question_paper: formData.question_paper || "NA",
          result: formData.result || "NA",
          selection_process: formData.selection_process || "NA",
          syllabus: formData.syllabus || "NA",
          role: userRole,
          userId: userId
        };

        const response = await axios.post(
          "http://localhost:8000/api/exam_post/",
          payload,
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
    }, 2000);
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
              {formSections["Exam Requirements"].status === "active" && <ExamRequirements formData={formData} setFormData={setFormData} />}
              {formSections["Exam Content Details"].status === "active" && <ExamContentDetails formData={formData} setFormData={setFormData} />}
              {formSections["Exam Additional Info"].status === "active" && <ExamAdditionalInfo formData={formData} setFormData={setFormData} />}
              {formSections["Summary"].status === "active" && <Summary formData={formData} setFormData={setFormData} />}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}