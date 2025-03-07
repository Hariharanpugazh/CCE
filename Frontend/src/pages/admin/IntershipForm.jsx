// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { FaClipboardList, FaFileSignature, FaRegFileAlt, FaSuitcase } from 'react-icons/fa';
// import AdminPageNavbar from "../../components/Admin/AdminNavBar";
// import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
// import { FormInputField, FormTextAreaField } from '../../components/Common/InputField';
// import { ToastContainer, toast } from 'react-toastify';
// import { MultiStepLoader as Loader } from "../../components/ui/multi-step-loader";

// const loadingStates = [
//   {
//     text: "Gathering internship details",
//   },
//   {
//     text: "Checking application deadline",
//   },
//   {
//     text: "Preparing application process",
//   },
//   {
//     text: "Finalizing internship posting",
//   },
// ];

// const InternshipDetails = ({ formData, setFormData }) => {
//   return (
//     <>
//       <div className='flex flex-col space-y-2'>
//         <FormInputField
//           label={"Internship Title"}
//           required={true}
//           args={{ placeholder: "Enter Internship Title", value: formData.title }}
//           setter={(val) => setFormData(prev => ({ ...prev, title: val }))}
//         />
//         <FormInputField
//           label={"Internship Location"}
//           required={true}
//           args={{ placeholder: "Enter Internship Location", value: formData.location }}
//           setter={(val) => setFormData(prev => ({ ...prev, location: val }))}
//         />
//         <FormInputField
//           label={"Industry Type"}
//           args={{ placeholder: "Enter Industry Type", value: formData.industry_type }}
//           setter={(val) => setFormData(prev => ({ ...prev, industry_type: val }))}
//         />
//         <FormInputField
//           label={"Internship Type"}
//           args={{ placeholder: "Enter Internship Type", value: formData.internship_type }}
//           setter={(val) => setFormData(prev => ({ ...prev, internship_type: val }))}
//         />
//         <FormInputField
//           label={"Company Name"}
//           args={{ placeholder: "Enter Company Name", value: formData.company_name }}
//           setter={(val) => setFormData(prev => ({ ...prev, company_name: val }))}
//         />
//       </div>

//       <div className='flex flex-col space-y-2'>
//         <FormTextAreaField
//           label={"Internship Description"}
//           args={{ placeholder: "Enter a brief description of the internship", value: formData.job_description }}
//           setter={(val) => setFormData(prev => ({ ...prev, job_description: val }))}
//         />
//         <FormInputField
//           label={"Company Website"}
//           args={{ placeholder: "Enter Company Website URL", value: formData.company_website }}
//           setter={(val) => setFormData(prev => ({ ...prev, company_website: val }))}
//         />
//         <FormInputField
//           label={"Duration"}
//           required={true}
//           args={{ placeholder: "Enter Duration (e.g., 3 months)", value: formData.duration }}
//           setter={(val) => setFormData(prev => ({ ...prev, duration: val }))}
//         />
//         <FormInputField
//           label={"Stipend Range"}
//           args={{ placeholder: "Enter Stipend Range (e.g., $500 - $1000)", value: formData.stipend }}
//           setter={(val) => setFormData(prev => ({ ...prev, stipend: val }))}
//         />
//       </div>
//     </>
//   );
// };

// const InternshipRequirements = ({ formData, setFormData }) => {
//   return (
//     <>
//       <div className='flex flex-col space-y-2'>
//         <FormInputField
//           label={"Technical Skills Required"}
//           args={{ placeholder: "Enter Technical Skills (comma-separated)", value: formData.technical_skills.join(',') }}
//           setter={(val) => setFormData(prev => ({ ...prev, technical_skills: val.split(',') }))}
//         />
//         <FormInputField
//           label={"Soft Skills Required"}
//           args={{ placeholder: "Enter Soft Skills (comma-separated)", value: formData.soft_skills.join(',') }}
//           setter={(val) => setFormData(prev => ({ ...prev, soft_skills: val.split(',') }))}
//         />
//         <FormInputField
//           label={"Educational Requirement"}
//           args={{ placeholder: "Enter Educational Requirement (e.g., Bachelor's Degree)", value: formData.education_requirements }}
//           setter={(val) => setFormData(prev => ({ ...prev, education_requirements: val }))}
//         />
//       </div>

//       <div className='flex flex-col space-y-2'>
//         <FormTextAreaField
//           label={"Documents Required"}
//           args={{ placeholder: "List required documents (e.g., Resume, Cover Letter)", value: formData.documents_required }}
//           setter={(val) => setFormData(prev => ({ ...prev, documents_required: val }))}
//         />
//         <FormInputField
//           label={"Additional Skills"}
//           args={{ placeholder: "Enter Additional Skills (comma-separated)", value: formData.additional_skills.join(',') }}
//           setter={(val) => setFormData(prev => ({ ...prev, additional_skills: val.split(',') }))}
//         />
//       </div>
//     </>
//   );
// };

// const ApplicationProcess = ({ formData, setFormData }) => {
//   return (
//     <>
//       <div className='flex flex-col space-y-2'>
//         <FormInputField
//           label={"Internship Posting Date"}
//           args={{ placeholder: "Enter Posting Date (YYYY-MM-DD)", type: "date", value: formData.internship_posting_date }}
//           setter={(val) => setFormData(prev => ({ ...prev, internship_posting_date: val }))}
//         />
//         <FormInputField
//           label={"Application Deadline"}
//           required={true}
//           args={{ placeholder: "Enter Application Deadline (YYYY-MM-DD)", type: "date", value: formData.application_deadline }}
//           setter={(val) => setFormData(prev => ({ ...prev, application_deadline: val }))}
//         />
//         <FormInputField
//           label={"Interview Start Date (If Applicable)"}
//           args={{ placeholder: "Enter Interview Start Date (YYYY-MM-DD)", type: "date", value: formData.interview_start_date }}
//           setter={(val) => setFormData(prev => ({ ...prev, interview_start_date: val }))}
//         />
//         <FormTextAreaField
//           label={"Steps to Apply"}
//           args={{ placeholder: "Describe the steps candidates need to take to apply", value: formData.steps_to_apply }}
//           setter={(val) => setFormData(prev => ({ ...prev, steps_to_apply: val }))}
//         />
//       </div>

//       <div className='flex flex-col space-y-2'>
//         <FormInputField
//           label={"Interview End Date (If Applicable)"}
//           args={{ placeholder: "Enter Interview End Date (YYYY-MM-DD)", type: "date", value: formData.interview_end_date }}
//           setter={(val) => setFormData(prev => ({ ...prev, interview_end_date: val }))}
//         />
//         <FormInputField
//           label={"Internship Link"}
//           required={true}
//           args={{ placeholder: "Enter the application link", value: formData.internship_link }}
//           setter={(val) => setFormData(prev => ({ ...prev, internship_link: val }))}
//         />
//         <FormTextAreaField
//           label={"Selection Process"}
//           args={{ placeholder: "Describe the selection process for applicants", value: formData.selection_process }}
//           setter={(val) => setFormData(prev => ({ ...prev, selection_process: val }))}
//         />
//       </div>
//     </>
//   );
// };

// const InternshipPreview = ({ formData, setFormData }) => {
//   return (
//     <>
//       <div className='flex flex-col space-y-2'>
//         <FormInputField
//           label={"Internship Title"}
//           required={true}
//           disabled={true}
//           args={{ placeholder: "Enter Internship Title", value: formData.title }}
//           setter={(val) => setFormData(prev => ({ ...prev, title: val }))}
//         />
//         <FormInputField
//           label={"Internship Location"}
//           required={true}
//           disabled={true}
//           args={{ placeholder: "Enter Internship Location", value: formData.location }}
//           setter={(val) => setFormData(prev => ({ ...prev, location: val }))}
//         />
//         <FormInputField
//           label={"Application Deadline"}
//           required={true}
//           disabled={true}
//           args={{ placeholder: "Enter Application Deadline (YYYY-MM-DD)", type: "date", value: formData.application_deadline }}
//           setter={(val) => setFormData(prev => ({ ...prev, application_deadline: val }))}
//         />
//         <FormInputField
//           label={"Internship Type"}
//           disabled={true}
//           args={{ placeholder: "Enter Internship Type", value: formData.internship_type }}
//           setter={(val) => setFormData(prev => ({ ...prev, internship_type: val }))}
//         />
//         <FormInputField
//           label={"Company Name"}
//           disabled={true}
//           args={{ placeholder: "Enter Company Name", value: formData.company_name }}
//           setter={(val) => setFormData(prev => ({ ...prev, company_name: val }))}
//         />
//       </div>

//       <div className='flex flex-col space-y-2'>
//         <FormTextAreaField
//           label={"Internship Description"}
//           disabled={true}
//           args={{ placeholder: "Enter a brief description of the internship", value: formData.job_description }}
//           setter={(val) => setFormData(prev => ({ ...prev, job_description: val }))}
//         />
//         <FormInputField
//           label={"Internship Link"}
//           required={true}
//           disabled={true}
//           args={{ placeholder: "Enter the application link", value: formData.internship_link }}
//           setter={(val) => setFormData(prev => ({ ...prev, internship_link: val }))}
//         />
//         <FormInputField
//           label={"Duration"}
//           required={true}
//           disabled={true}
//           args={{ placeholder: "Enter Duration (e.g., 3 months)", value: formData.duration }}
//           setter={(val) => setFormData(prev => ({ ...prev, duration: val }))}
//         />
//         <FormInputField
//           label={"Stipend Range"}
//           disabled={true}
//           args={{ placeholder: "Enter Stipend Range (e.g., $500 - $1000)", value: formData.stipend }}
//           setter={(val) => setFormData(prev => ({ ...prev, stipend: val }))}
//         />
//       </div>
//     </>
//   );
// };

// const InternPostForm = () => {
//   const storedInternshipData = sessionStorage.getItem("internshipData");
//   const initialInternshipData = storedInternshipData ? JSON.parse(storedInternshipData) : {};

//   const [formData, setFormData] = useState({
//     title: initialInternshipData.title || '',
//     company_name: initialInternshipData.company_name || '',
//     location: initialInternshipData.job_location || '',
//     industry_type: initialInternshipData.industry_type || '',
//     internship_type: initialInternshipData.work_type || '',
//     duration: initialInternshipData.duration || '',
//     stipend: initialInternshipData.salary_range || '',
//     application_deadline: initialInternshipData.application_deadline && !isNaN(Date.parse(initialInternshipData.application_deadline))
//       ? new Date(initialInternshipData.application_deadline)
//       : null,
//     skills_required: initialInternshipData.required_skills || [],
//     job_description: initialInternshipData.job_description || '',
//     company_website: initialInternshipData.company_website || '',
//     job_link: initialInternshipData.job_link || '',
//     education_requirements: initialInternshipData.education_requirements || '',
//     technical_skills: initialInternshipData.technical_skills || [],
//     soft_skills: initialInternshipData.soft_skills || [],
//     documents_required: initialInternshipData.documents_required || '',
//     additional_skills: initialInternshipData.additional_skills || [],
//     internship_posting_date: initialInternshipData.internship_posting_date && !isNaN(Date.parse(initialInternshipData.internship_posting_date))
//       ? new Date(initialInternshipData.internship_posting_date)
//       : null,
//     interview_start_date: initialInternshipData.interview_start_date && !isNaN(Date.parse(initialInternshipData.interview_start_date))
//       ? new Date(initialInternshipData.interview_start_date)
//       : null,
//     interview_end_date: initialInternshipData.interview_end_date && !isNaN(Date.parse(initialInternshipData.interview_end_date))
//       ? new Date(initialInternshipData.interview_end_date)
//       : null,
//     internship_link: initialInternshipData.internship_link || '',
//     selection_process: initialInternshipData.selection_process || '',
//     steps_to_apply: initialInternshipData.steps_to_apply || ''
//   });

//   const [message, setMessage] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [toastMessage, setToastMessage] = useState('');
//   const [isTypeOpen, setIsTypeOpen] = useState(false);
//   const [urlError, setUrlError] = useState('');
//   const [deadlineError, setDeadlineError] = useState('');
//   const navigate = useNavigate();
//   const [userRole, setUserRole] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (loading) {
//       const timer = setTimeout(() => {
//         setLoading(false);
//       }, 10000); // 10000 milliseconds = 10 seconds

//       // Cleanup function to clear the timer if the component unmounts or loading changes
//       return () => clearTimeout(timer);
//     }
//   }, [loading]);

//   const [categories, setCategories] = useState({
//     "Internship Details": { status: "active", icon: <FaSuitcase /> },
//     "Internship Requirements": { status: "unvisited", icon: <FaClipboardList /> },
//     "Application Process": { status: "unvisited", icon: <FaFileSignature /> },
//     "Summary": { status: "unvisited", icon: <FaRegFileAlt /> }
//   });

//   const internshipTypes = [
//     'Full-time',
//     'Part-time',
//     'Contract',
//     'Temporary',
//     'Volunteer',
//   ];

//   const validateUrl = (url) => {
//     const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
//     return urlPattern.test(url);
//   };

//   const validateDeadline = (date) => {
//     const currentDate = new Date();
//     if (date < currentDate) {
//       setDeadlineError('Application deadline must be a future date.');
//       return false;
//     } else {
//       setDeadlineError('');
//       return true;
//     }
//   };

//   useEffect(() => {
//     const token = Cookies.get('jwt');
//     if (!token) {
//       setError('No token found. Please log in.');
//       return;
//     }

//     const decodedToken = jwtDecode(token);
//     const currentTime = Date.now() / 1000;
//     if (decodedToken.exp < currentTime) {
//       setError('Token has expired. Please log in again.');
//       return;
//     }

//     if (decodedToken.role !== 'superadmin' && decodedToken.role !== 'admin') {
//       setError('You do not have permission to access this page.');
//     }
//     if (token) {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       setUserRole(payload.role);
//       if (payload.role === "admin") {
//         setUserId(payload.admin_user);
//       } else if (payload.role === "superadmin") {
//         setUserId(payload.superadmin_user);
//       }
//     }
//   }, [navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     if (name === 'company_website') {
//       if (value && !validateUrl(value)) {
//         setUrlError('Invalid URL');
//       } else {
//         setUrlError('');
//       }
//     }
//   };

//   const handleTypeChange = (type) => {
//     setFormData({
//       ...formData,
//       internship_type: type,
//     });
//     setIsTypeOpen(false);
//   };

//   const handleDateChange = (date) => {
//     setFormData({
//       ...formData,
//       application_deadline: date,
//     });
//     validateDeadline(date);
//   };

//   const handleSkillsChange = (e) => {
//     if (e.key === 'Enter' || e.key === ',') {
//       e.preventDefault();
//       const skill = e.target.value.trim();
//       if (skill && !formData.skills_required.includes(skill)) {
//         setFormData({
//           ...formData,
//           skills_required: [...formData.skills_required, skill],
//         });
//         e.target.value = '';
//       }
//     }
//   };

//   const handleRemoveSkill = (skillToRemove) => {
//     setFormData({
//       ...formData,
//       skills_required: formData.skills_required.filter(skill => skill !== skillToRemove),
//     });
//   };

//   const handleSubmit = async () => {
//     setLoading(true); // Start the loader

//     // Simulate loader duration with setTimeout
//     setTimeout(async () => {
//       if (formData.company_website && !validateUrl(formData.company_website)) {
//         toast.error('Invalid URL');
//         setLoading(false); // Stop the loader if validation fails
//         return;
//       }

//       // Validate Deadline
//       if (!validateDeadline(formData.application_deadline)) {
//         toast.error('please check the deadline');
//         setLoading(false); // Stop the loader if validation fails
//         return;
//       }

//       setIsSubmitting(true);
//       setMessage('');
//       setError('');

//       try {
//         const token = Cookies.get('jwt');
//         if (!token) {
//           setError('No token found. Please log in.');
//           setIsSubmitting(false);
//           setLoading(false); // Stop the loader if no token is found
//           return;
//         }

//         // Replace empty fields with "NA"
//         const formattedData = Object.keys(formData).reduce((acc, key) => {
//           acc[key] = formData[key] === '' ? 'NA' : formData[key];
//           return acc;
//         }, {});

//         // Ensure application_deadline is properly formatted
//         formattedData.application_deadline =
//           formattedData.application_deadline instanceof Date
//             ? formattedData.application_deadline.toISOString().split('T')[0]
//             : formattedData.application_deadline; // If it's already a string, use it as is

//         console.log("Sending data to API:", formattedData); // Debugging

//         // API Call
//         const response = await axios.post(
//           'http://localhost:8000/api/post-internship/',
//           { ...formattedData, userId, role: userRole },
//           {
//             headers: { Authorization: `Bearer ${token}` }, // Ensure auth header
//           }
//         );

//         console.log("API Response:", response.data); // Debugging

//         setMessage(response.data.message);
//         window.location.href = `${window.location.origin}/internships`;
//       } catch (error) {
//         console.error("API Error:", error); // Debugging
//         setError(`Error: ${error.response?.data?.error || 'Something went wrong'}`);
//         setToastMessage(`Error: ${error.response?.data?.error || 'Something went wrong'}`);
//       } finally {
//         setIsSubmitting(false);
//         setLoading(false); // Stop the loader after API call
//       }
//     }, 10000); // Adjust the duration to match your loader duration
//   };

//   useEffect(() => {
//     if (toastMessage) {
//       const timer = setTimeout(() => {
//         setToastMessage('');
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [toastMessage]);

//   useEffect(() => {
//     if (toastMessage) {
//       const timer = setTimeout(() => {
//         setToastMessage('');
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [toastMessage]);

//   if (error) {
//     return <div className="text-red-600">{error}</div>;
//   }

//   const categoryKeys = Object.keys(categories);
//   const activeIndex = categoryKeys.findIndex(key => categories[key].status === "active");

//   const handleNavigation = (direction) => {
//     setCategories(prevCategories => {
//       const updatedCategories = { ...prevCategories };

//       if (activeIndex !== -1) {
//         const currentKey = categoryKeys[activeIndex];
//         const nextIndex = direction === "next" ? activeIndex + 1 : activeIndex - 1;

//         if (nextIndex >= 0 && nextIndex < categoryKeys.length) {
//           const nextKey = categoryKeys[nextIndex];

//           if (direction === "next") {
//             updatedCategories[currentKey] = { ...updatedCategories[currentKey], status: "completed" };
//           }

//           updatedCategories[nextKey] = { ...updatedCategories[nextKey], status: "active" };

//           if (direction === "prev") {
//             for (let i = nextIndex + 1; i < categoryKeys.length; i++) {
//               updatedCategories[categoryKeys[i]] = { ...updatedCategories[categoryKeys[i]], status: "unvisited" };
//             }
//           }
//         }
//       }

//       return updatedCategories;
//     });
//   };

//   return (
//     <motion.div className="flex bg-gray-100 min-h-screen">
//       {userRole === "admin" && <AdminPageNavbar />}
//       {userRole === "superadmin" && <SuperAdminPageNavbar />}

//       <ToastContainer />

//       <div className='flex-1 flex items-center justify-center p-6'>
//         <div className='flex-1 p-8 bg-white rounded-xl flex flex-col h-[80%]'>
//           <div className='flex justify-between items-center text-2xl pb-4 border-b border-gray-300'>
//             <p> Post an Internship </p>
//             <button
//               className='px-3 p-1.5 border rounded-lg text-sm'
//               onClick={() => navigate('/internshipselection')}
//             >
//               Cancel
//             </button>
//           </div>

//           {toastMessage && (
//             <div className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded shadow">
//               {toastMessage}
//             </div>
//           )}

//           <div className='flex items-stretch'>
//             <div className='w-1/4 border-r border-gray-300 flex flex-col p-4'>
//               <div className='border-y border-r border-gray-300 flex flex-col rounded-lg'>
//               <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
//                 {
//                   Object.entries(categories).map(([category, prop], key, array) =>
//                     <div
//                       key={category}
//                       className={`border-l-6 flex items-center p-2 border-b border-gray-300
//                         ${key === 0 ? "rounded-tl-lg" : ""}
//                         ${key === array.length - 1 ? "rounded-bl-lg border-b-transparent" : ""}
//                         ${prop.status === "active" ? "border-l-yellow-400" : prop.status === "completed" ? "border-l-[#00B69B]" : "border-l-gray-300"}`}
//                     >
//                       <p className='text-gray-900 p-2 inline-block'>{prop.icon}</p>
//                       <p>{category}</p>
//                     </div>
//                   )
//                 }
//               </div>

//               <div className='flex justify-between mt-4'>
//                 <button
//                   className='px-3 p-1 border rounded text-sm cursor-pointer'
//                   disabled={activeIndex === 0}
//                   onClick={() => handleNavigation("prev")}
//                 >
//                   Previous
//                 </button>

//                 {activeIndex === categoryKeys.length - 1 ? (
//                   <button
//                     className="rounded bg-green-500 text-sm px-5 p-1 cursor-pointer"
//                     onClick={handleSubmit}
//                   >
//                     Finish
//                   </button>
//                 ) : (
//                   <button
//                     className="rounded bg-yellow-400 text-sm px-5 p-1 cursor-pointer"
//                     disabled={activeIndex === categoryKeys.length - 1}
//                     onClick={() => handleNavigation("next")}
//                   >
//                     Next
//                   </button>
//                 )}
//               </div>
//             </div>

//             <div className='flex-1 p-4 grid grid-cols-2 gap-4 items-stretch h-full'>
//               {
//                 {
//                   "Internship Details": <InternshipDetails formData={formData} setFormData={setFormData} />,
//                   "Internship Requirements": <InternshipRequirements formData={formData} setFormData={setFormData} />,
//                   "Application Process": <ApplicationProcess formData={formData} setFormData={setFormData} />,
//                   "Summary": <InternshipPreview formData={formData} setFormData={setFormData} />,
//                 }[
//                 Object.entries(categories).find(([_, prop]) => prop.status === "active")?.[0]
//                 ]
//               }
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default InternPostForm;

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaClipboardList,
  FaFileSignature,
  FaRegFileAlt,
  FaSuitcase,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import {
  FormInputField,
  FormTextAreaField,
} from "../../components/Common/InputField";
import { ToastContainer, toast } from "react-toastify";
import { MultiStepLoader as Loader } from "../../components/ui/multi-step-loader";

const loadingStates = [
  {
    text: "Gathering internship details",
  },
  {
    text: "Checking application deadline",
  },
  {
    text: "Preparing application process",
  },
  {
    text: "Finalizing internship posting",
  },
];

const InternshipDetails = ({ formData, setFormData }) => {
  return (
    <>
      <div className="flex flex-col space-y-6 w-full">
        <FormInputField
          label={"Internship Title"}
          required={true}
          args={{
            placeholder: "Enter Internship Title",
            value: formData.title,
          }}
          setter={(val) => setFormData((prev) => ({ ...prev, title: val }))}
        />
        <FormInputField
          label={"Internship Location"}
          required={true}
          args={{
            placeholder: "Enter Internship Location",
            value: formData.location,
          }}
          setter={(val) => setFormData((prev) => ({ ...prev, location: val }))}
        />
        <FormInputField
          label={"Industry Type"}
          args={{
            placeholder: "Enter Industry Type",
            value: formData.industry_type,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, industry_type: val }))
          }
        />
        <FormInputField
          label={"Internship Type"}
          args={{
            placeholder: "Enter Internship Type",
            value: formData.internship_type,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, internship_type: val }))
          }
        />
        <FormInputField
          label={"Company Name"}
          args={{
            placeholder: "Enter Company Name",
            value: formData.company_name,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, company_name: val }))
          }
        />
      </div>

      <div className="flex flex-col space-y-4 w-full">
        <FormTextAreaField
          label={"Internship Description"}
          args={{
            placeholder: "Enter a brief description of the internship",
            value: formData.job_description,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, job_description: val }))
          }
        />
        <FormInputField
          label={"Company Website"}
          args={{
            placeholder: "Enter Company Website URL",
            value: formData.company_website,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, company_website: val }))
          }
        />
        <FormInputField
          label={"Duration"}
          required={true}
          args={{
            placeholder: "Enter Duration (e.g., 3 months)",
            value: formData.duration,
          }}
          setter={(val) => setFormData((prev) => ({ ...prev, duration: val }))}
        />
        <FormInputField
          label={"Stipend Range"}
          args={{
            placeholder: "Enter Stipend Range (e.g., $500 - $1000)",
            value: formData.stipend,
          }}
          setter={(val) => setFormData((prev) => ({ ...prev, stipend: val }))}
        />
      </div>
    </>
  );
};

const InternshipRequirements = ({ formData, setFormData }) => {
  return (
    <>
      <div className="flex flex-col space-y-6 w-full">
        <FormInputField
          label={"Technical Skills Required"}
          args={{
            placeholder: "Enter Technical Skills (comma-separated)",
            value: formData.technical_skills.join(","),
          }}
          setter={(val) =>
            setFormData((prev) => ({
              ...prev,
              technical_skills: val.split(","),
            }))
          }
        />
        <FormInputField
          label={"Soft Skills Required"}
          args={{
            placeholder: "Enter Soft Skills (comma-separated)",
            value: formData.soft_skills.join(","),
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, soft_skills: val.split(",") }))
          }
        />
        <FormInputField
          label={"Educational Requirement"}
          args={{
            placeholder:
              "Enter Educational Requirement (e.g., Bachelor's Degree)",
            value: formData.education_requirements,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, education_requirements: val }))
          }
        />
      </div>

      <div className="flex flex-col space-y-6 w-full">
        <FormTextAreaField
          label={"Documents Required"}
          args={{
            placeholder: "List required documents (e.g., Resume, Cover Letter)",
            value: formData.documents_required,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, documents_required: val }))
          }
        />
        <FormInputField
          label={"Additional Skills"}
          args={{
            placeholder: "Enter Additional Skills (comma-separated)",
            value: formData.additional_skills.join(","),
          }}
          setter={(val) =>
            setFormData((prev) => ({
              ...prev,
              additional_skills: val.split(","),
            }))
          }
        />
      </div>
    </>
  );
};

const ApplicationProcess = ({ formData, setFormData }) => {
  return (
    <>
      <div className="flex flex-col space-y-6 w-full">
        <FormInputField
          label={"Internship Posting Date"}
          args={{
            placeholder: "Enter Posting Date (YYYY-MM-DD)",
            type: "date",
            value: formData.internship_posting_date,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, internship_posting_date: val }))
          }
        />
        <FormInputField
          label={"Application Deadline"}
          required={true}
          args={{
            placeholder: "Enter Application Deadline (YYYY-MM-DD)",
            type: "date",
            value: formData.application_deadline,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, application_deadline: val }))
          }
        />
        <FormInputField
          label={"Interview Start Date (If Applicable)"}
          args={{
            placeholder: "Enter Interview Start Date (YYYY-MM-DD)",
            type: "date",
            value: formData.interview_start_date,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, interview_start_date: val }))
          }
        />
        <FormTextAreaField
          label={"Steps to Apply"}
          args={{
            placeholder: "Describe the steps candidates need to take to apply",
            value: formData.steps_to_apply,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, steps_to_apply: val }))
          }
        />
      </div>

      <div className="flex flex-col space-y-6 w-full">
        <FormInputField
          label={"Interview End Date (If Applicable)"}
          args={{
            placeholder: "Enter Interview End Date (YYYY-MM-DD)",
            type: "date",
            value: formData.interview_end_date,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, interview_end_date: val }))
          }
        />
        <FormInputField
          label={"Internship Link"}
          required={true}
          args={{
            placeholder: "Enter the application link",
            value: formData.internship_link,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, internship_link: val }))
          }
        />
        <FormTextAreaField
          label={"Selection Process"}
          args={{
            placeholder: "Describe the selection process for applicants",
            value: formData.selection_process,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, selection_process: val }))
          }
        />
      </div>
    </>
  );
};

const InternshipPreview = ({ formData, setFormData }) => {
  return (
    <>
      <div className="flex flex-col space-y-6 w-full">
        <FormInputField
          label={"Internship Title"}
          required={true}
          disabled={true}
          args={{
            placeholder: "Enter Internship Title",
            value: formData.title,
          }}
          setter={(val) => setFormData((prev) => ({ ...prev, title: val }))}
        />
        <FormInputField
          label={"Internship Location"}
          required={true}
          disabled={true}
          args={{
            placeholder: "Enter Internship Location",
            value: formData.location,
          }}
          setter={(val) => setFormData((prev) => ({ ...prev, location: val }))}
        />
        <FormInputField
          label={"Application Deadline"}
          required={true}
          disabled={true}
          args={{
            placeholder: "Enter Application Deadline (YYYY-MM-DD)",
            type: "date",
            value: formData.application_deadline,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, application_deadline: val }))
          }
        />
        <FormInputField
          label={"Internship Type"}
          disabled={true}
          args={{
            placeholder: "Enter Internship Type",
            value: formData.internship_type,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, internship_type: val }))
          }
        />
        <FormInputField
          label={"Company Name"}
          disabled={true}
          args={{
            placeholder: "Enter Company Name",
            value: formData.company_name,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, company_name: val }))
          }
        />
      </div>

      <div className="flex flex-col space-y-6 w-full">
        <FormTextAreaField
          label={"Internship Description"}
          disabled={true}
          args={{
            placeholder: "Enter a brief description of the internship",
            value: formData.job_description,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, job_description: val }))
          }
        />
        <FormInputField
          label={"Internship Link"}
          required={true}
          disabled={true}
          args={{
            placeholder: "Enter the application link",
            value: formData.internship_link,
          }}
          setter={(val) =>
            setFormData((prev) => ({ ...prev, internship_link: val }))
          }
        />
        <FormInputField
          label={"Duration"}
          required={true}
          disabled={true}
          args={{
            placeholder: "Enter Duration (e.g., 3 months)",
            value: formData.duration,
          }}
          setter={(val) => setFormData((prev) => ({ ...prev, duration: val }))}
        />
        <FormInputField
          label={"Stipend Range"}
          disabled={true}
          args={{
            placeholder: "Enter Stipend Range (e.g., $500 - $1000)",
            value: formData.stipend,
          }}
          setter={(val) => setFormData((prev) => ({ ...prev, stipend: val }))}
        />
      </div>
    </>
  );
};

const InternPostForm = () => {
  const storedInternshipData = sessionStorage.getItem("internshipData");
  const initialInternshipData = storedInternshipData
    ? JSON.parse(storedInternshipData)
    : {};

  const [formData, setFormData] = useState({
    title: initialInternshipData.title || "",
    company_name: initialInternshipData.company_name || "",
    location: initialInternshipData.job_location || "",
    industry_type: initialInternshipData.industry_type || "",
    internship_type: initialInternshipData.work_type || "",
    duration: initialInternshipData.duration || "",
    stipend: initialInternshipData.salary_range || "",
    application_deadline:
      initialInternshipData.application_deadline &&
      !isNaN(Date.parse(initialInternshipData.application_deadline))
        ? new Date(initialInternshipData.application_deadline)
        : null,
    skills_required: initialInternshipData.required_skills || [],
    job_description: initialInternshipData.job_description || "",
    company_website: initialInternshipData.company_website || "",
    job_link: initialInternshipData.job_link || "",
    education_requirements: initialInternshipData.education_requirements || "",
    technical_skills: initialInternshipData.technical_skills || [],
    soft_skills: initialInternshipData.soft_skills || [],
    documents_required: initialInternshipData.documents_required || "",
    additional_skills: initialInternshipData.additional_skills || [],
    internship_posting_date:
      initialInternshipData.internship_posting_date &&
      !isNaN(Date.parse(initialInternshipData.internship_posting_date))
        ? new Date(initialInternshipData.internship_posting_date)
        : null,
    interview_start_date:
      initialInternshipData.interview_start_date &&
      !isNaN(Date.parse(initialInternshipData.interview_start_date))
        ? new Date(initialInternshipData.interview_start_date)
        : null,
    interview_end_date:
      initialInternshipData.interview_end_date &&
      !isNaN(Date.parse(initialInternshipData.interview_end_date))
        ? new Date(initialInternshipData.interview_end_date)
        : null,
    internship_link: initialInternshipData.internship_link || "",
    selection_process: initialInternshipData.selection_process || "",
    steps_to_apply: initialInternshipData.steps_to_apply || "",
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [deadlineError, setDeadlineError] = useState("");
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Check if screen is mobile on initial load
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Check on initial load
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 10000); // 10000 milliseconds = 10 seconds

      // Cleanup function to clear the timer if the component unmounts or loading changes
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const [categories, setCategories] = useState({
    "Internship Details": { status: "active", icon: <FaSuitcase /> },
    "Internship Requirements": {
      status: "unvisited",
      icon: <FaClipboardList />,
    },
    "Application Process": { status: "unvisited", icon: <FaFileSignature /> },
    Summary: { status: "unvisited", icon: <FaRegFileAlt /> },
  });

  const internshipTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Temporary",
    "Volunteer",
  ];

  const validateUrl = (url) => {
    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlPattern.test(url);
  };

  const validateDeadline = (date) => {
    const currentDate = new Date();
    if (date < currentDate) {
      setDeadlineError("Application deadline must be a future date.");
      return false;
    } else {
      setDeadlineError("");
      return true;
    }
  };

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

    if (decodedToken.role !== "superadmin" && decodedToken.role !== "admin") {
      setError("You do not have permission to access this page.");
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
  }, []); // Removed navigate from dependencies

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "company_website") {
      if (value && !validateUrl(value)) {
        setUrlError("Invalid URL");
      } else {
        setUrlError("");
      }
    }
  };

  const handleTypeChange = (type) => {
    setFormData({
      ...formData,
      internship_type: type,
    });
    setIsTypeOpen(false);
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      application_deadline: date,
    });
    validateDeadline(date);
  };

  const handleSkillsChange = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const skill = e.target.value.trim();
      if (skill && !formData.skills_required.includes(skill)) {
        setFormData({
          ...formData,
          skills_required: [...formData.skills_required, skill],
        });
        e.target.value = "";
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills_required: formData.skills_required.filter(
        (skill) => skill !== skillToRemove
      ),
    });
  };

  const handleSubmit = async () => {
    setLoading(true); // Start the loader

    // Simulate loader duration with setTimeout
    setTimeout(async () => {
      if (formData.company_website && !validateUrl(formData.company_website)) {
        toast.error("Invalid URL");
        setLoading(false); // Stop the loader if validation fails
        return;
      }

      // Validate Deadline
      if (!validateDeadline(formData.application_deadline)) {
        toast.error("please check the deadline");
        setLoading(false); // Stop the loader if validation fails
        return;
      }

      setIsSubmitting(true);
      setMessage("");
      setError("");

      try {
        const token = Cookies.get("jwt");
        if (!token) {
          setError("No token found. Please log in.");
          setIsSubmitting(false);
          setLoading(false); // Stop the loader if no token is found
          return;
        }

        // Replace empty fields with "NA"
        const formattedData = Object.keys(formData).reduce((acc, key) => {
          acc[key] = formData[key] === "" ? "NA" : formData[key];
          return acc;
        }, {});

        // Ensure application_deadline is properly formatted
        formattedData.application_deadline =
          formattedData.application_deadline instanceof Date
            ? formattedData.application_deadline.toISOString().split("T")[0]
            : formattedData.application_deadline; // If it's already a string, use it as is

        console.log("Sending data to API:", formattedData); // Debugging

        // API Call
        const response = await axios.post(
          "http://localhost:8000/api/post-internship/",
          { ...formattedData, userId, role: userRole },
          {
            headers: { Authorization: `Bearer ${token}` }, // Ensure auth header
          }
        );

        console.log("API Response:", response.data); // Debugging

        setMessage(response.data.message);
        window.location.href = `${window.location.origin}/internships`;
      } catch (error) {
        console.error("API Error:", error); // Debugging
        setError(
          `Error: ${error.response?.data?.error || "Something went wrong"}`
        );
        setToastMessage(
          `Error: ${error.response?.data?.error || "Something went wrong"}`
        );
      } finally {
        setIsSubmitting(false);
        setLoading(false); // Stop the loader after API call
      }
    }, 10000); // Adjust the duration to match your loader duration
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  const categoryKeys = Object.keys(categories);
  const activeIndex = categoryKeys.findIndex(
    (key) => categories[key].status === "active"
  );

  const handleNavigation = (direction) => {
    setCategories((prevCategories) => {
      const updatedCategories = { ...prevCategories };

      if (activeIndex !== -1) {
        const currentKey = categoryKeys[activeIndex];
        const nextIndex =
          direction === "next" ? activeIndex + 1 : activeIndex - 1;

        if (nextIndex >= 0 && nextIndex < categoryKeys.length) {
          const nextKey = categoryKeys[nextIndex];

          if (direction === "next") {
            updatedCategories[currentKey] = {
              ...updatedCategories[currentKey],
              status: "completed",
            };
          }

          updatedCategories[nextKey] = {
            ...updatedCategories[nextKey],
            status: "active",
          };

          if (direction === "prev") {
            for (let i = nextIndex + 1; i < categoryKeys.length; i++) {
              updatedCategories[categoryKeys[i]] = {
                ...updatedCategories[categoryKeys[i]],
                status: "unvisited",
              };
            }
          }
        }
      }

      return updatedCategories;
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <motion.div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}

      <ToastContainer />

      <div className="flex-1 flex flex-col md:items-center md:justify-center p-3 md:p-6">
        <div className="w-full max-w-6xl p-4 md:p-8 bg-white rounded-xl flex flex-col shadow-md">
          <div className="flex justify-between items-center text-xl md:text-2xl pb-4 border-b border-gray-300">
            <p className="font-semibold">Post an Internship</p>
            <button
              className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-100 transition-colors"
              onClick={() => navigate("/internshipselection")}
            >
              Cancel
            </button>
          </div>

          {toastMessage && (
            <div className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded shadow z-50">
              {toastMessage}
            </div>
          )}

          <div className="flex flex-col md:flex-row mt-4">
            {/* Mobile toggle button */}
            <button
              className="md:hidden flex items-center justify-center p-2 mb-4 bg-gray-200 rounded-md"
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? "Hide Steps" : "Show Steps"}
            </button>

            {/* Sidebar */}
            {isSidebarOpen && (
              <div className="w-full md:w-1/4 md:border-r border-gray-300 flex flex-col p-2 md:p-4 mb-4 md:mb-0">
                <div className="border-y border-r border-gray-300 flex flex-col rounded-lg mb-4">
                  <Loader
                    loadingStates={loadingStates}
                    loading={loading}
                    duration={2000}
                  />
                  {Object.entries(categories).map(
                    ([category, prop], key, array) => (
                      <div
                        key={category}
                        className={`border-l-4 flex items-center p-2 border-b border-gray-300
                          ${key === 0 ? "rounded-tl-lg" : ""}
                          ${
                            key === array.length - 1
                              ? "rounded-bl-lg border-b-transparent"
                              : ""
                          }
                          ${
                            prop.status === "active"
                              ? "border-l-yellow-400 bg-yellow-50"
                              : prop.status === "completed"
                              ? "border-l-[#00B69B] bg-green-50"
                              : "border-l-gray-300"
                          }`}
                      >
                        <span className="text-gray-900 p-2 inline-block">
                          {prop.icon}
                        </span>
                        <span className="text-sm md:text-base">{category}</span>
                      </div>
                    )
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    className={`px-3 py-1.5 border rounded text-sm ${
                      activeIndex === 0
                        ? "bg-gray-100 cursor-not-allowed"
                        : "hover:bg-gray-100 cursor-pointer"
                    }`}
                    disabled={activeIndex === 0}
                    onClick={() => handleNavigation("prev")}
                  >
                    <span className="flex items-center">
                      <FaChevronLeft className="mr-1" /> Previous
                    </span>
                  </button>

                  {activeIndex === categoryKeys.length - 1 ? (
                    <button
                      className="rounded bg-green-500 hover:bg-green-600 text-white text-sm px-5 py-1.5 cursor-pointer transition-colors"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Finish"}
                    </button>
                  ) : (
                    <button
                      className="rounded bg-yellow-400 hover:bg-yellow-500 text-sm px-5 py-1.5 cursor-pointer transition-colors"
                      disabled={activeIndex === categoryKeys.length - 1}
                      onClick={() => handleNavigation("next")}
                    >
                      <span className="flex items-center">
                        Next <FaChevronRight className="ml-1" />
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Form content */}
            <div className="flex-1 p-2 md:p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
              {
                {
                  "Internship Details": (
                    <InternshipDetails
                      formData={formData}
                      setFormData={setFormData}
                    />
                  ),
                  "Internship Requirements": (
                    <InternshipRequirements
                      formData={formData}
                      setFormData={setFormData}
                    />
                  ),
                  "Application Process": (
                    <ApplicationProcess
                      formData={formData}
                      setFormData={setFormData}
                    />
                  ),
                  Summary: (
                    <InternshipPreview
                      formData={formData}
                      setFormData={setFormData}
                    />
                  ),
                }[
                  Object.entries(categories).find(
                    ([_, prop]) => prop.status === "active"
                  )?.[0]
                ]
              }
            </div>
          </div>

          {/* Mobile navigation buttons */}
          <div className="flex justify-between mt-6 md:hidden">
            <button
              className={`px-3 py-1.5 border rounded text-sm ${
                activeIndex === 0
                  ? "bg-gray-100 cursor-not-allowed"
                  : "hover:bg-gray-100 cursor-pointer"
              }`}
              disabled={activeIndex === 0}
              onClick={() => handleNavigation("prev")}
            >
              <span className="flex items-center">
                <FaChevronLeft className="mr-1" /> Previous
              </span>
            </button>

            {activeIndex === categoryKeys.length - 1 ? (
              <button
                className="rounded bg-green-500 hover:bg-green-600 text-white text-sm px-5 py-1.5 cursor-pointer transition-colors"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Finish"}
              </button>
            ) : (
              <button
                className="rounded bg-yellow-400 hover:bg-yellow-500 text-sm px-5 py-1.5 cursor-pointer transition-colors"
                disabled={activeIndex === categoryKeys.length - 1}
                onClick={() => handleNavigation("next")}
              >
                <span className="flex items-center">
                  Next <FaChevronRight className="ml-1" />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InternPostForm;
