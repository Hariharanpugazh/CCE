// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";
// import AdminPageNavbar from "../../components/Admin/AdminNavBar";
// import Pagination from "../../components/Admin/pagination";
// import Sidebar from "../../components/Admin/Sidebar";
// import {
//   Briefcase,
//   GraduationCap,
//   BookOpen,
//   Trophy,
//   Bell,
//   Edit2,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   Building2,
//   Folder,
//   Calendar,
// } from "lucide-react";

// const ManageJobs = () => {
//   const [jobs, setJobs] = useState([]);
//   const [studyMaterials, setStudyMaterials] = useState([]);
//   const [internships, setInternships] = useState([]);
//   const [achievements, setAchievements] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("Jobs");
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async (endpoint, setState, key) => {
//       try {
//         const token = Cookies.get("jwt");
//         const response = await axios.get(`http://localhost:8000/api/${endpoint}/`, {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         });

//         if (response.data && Array.isArray(response.data[key])) {
//           setState(response.data[key]);
//         } else {
//           console.warn(`Invalid data received for ${key}:`, response.data);
//           setState([]);
//         }
//       } catch (error) {
//         console.error(`Error fetching ${key}:`, error);
//         setState([]);
//       }
//     };

//     fetchData("manage-jobs", setJobs, "jobs");
//     fetchData("manage-study-materials", setStudyMaterials, "study_materials");
//     fetchData("manage-internships", setInternships, "internships");
//     fetchData("manage-achievements", setAchievements, "achievements");
//   }, []);

//   const paginate = (items) => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return items.slice(startIndex, startIndex + itemsPerPage);
//   };

//   const handleEditClick = (id, type) => {
//     navigate(
//       type === "job"
//         ? `/job-edit/${id}`
//         : type === "study"
//         ? `/study-edit/${id}`
//         : type === "internship"
//         ? `/internship-edit/${id}`
//         : `/achievement-edit/${id}`
//     );
//   };

//   const getStatusStyle = (isPublish) => {
//     if (isPublish === true) {
//       return {
//         bg: "bg-emerald-100",
//         text: "text-emerald-800",
//         icon: CheckCircle2,
//         label: "Published",
//       };
//     } else if (isPublish === false) {
//       return {
//         bg: "bg-red-100",
//         text: "text-red-800",
//         icon: XCircle,
//         label: "Rejected",
//       };
//     }
//     return {
//       bg: "bg-amber-100",
//       text: "text-amber-800",
//       icon: Clock,
//       label: "Pending",
//     };
//   };

//   const sidebarCategories = [
//     { name: "Jobs", icon: Briefcase },
//     { name: "Internships", icon: GraduationCap },
//     { name: "Study Materials", icon: BookOpen },
//     { name: "Achievements", icon: Trophy },
//     // { name: "Notifications", icon: Bell },
//   ];

//   const renderCard = (item, type) => {
//     if (!item) return null;

//     let title, company, description;
//     if (type === "job") {
//       title = item.job_data?.title || "No Title";
//       company = item.job_data?.company_name || "Unknown Company";
//     } else if (type === "study") {
//       title = item.study_material_data?.title || "No Title";
//       company = item.study_material_data?.category || "Unknown Category";
//     } else if (type === "internship") {
//       title = item.internship_data?.title || "No Title";
//       company = item.internship_data?.company_name || "Unknown Company";
//     } else {
//       title = item.name || "No Title";
//       company = item.company_name || "No Company";
//       description = item.achievement_description || "No Skills required";
//     }

//     const status = getStatusStyle(item.is_publish);
//     const StatusIcon = status.icon;

//     return (
//       <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
//         <div className="p-6">
//           <div className="flex justify-between items-start mb-4">
//             <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">{title}</h2>
//             <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
//               <StatusIcon className="h-4 w-4" />
//               {status.label}
//             </span>
//           </div>
//           <div className="space-y-3">
//             <div className="flex items-center text-gray-600">
//               {type === "study" ? <Folder className="h-4 w-4 mr-2" /> : <Building2 className="h-4 w-4 mr-2" />}
//               <span className="font-medium">{type === "study" ? "Category:" : "Company:"}</span>
//               <span className="text-gray-700 ml-1">{company}</span>
//             </div>
//             {type === "achievement" && (
//               <>
//                 <div className="flex items-center text-gray-600">
//                   <Trophy className="h-4 w-4 mr-2" />
//                   <span className="font-medium">Type:</span>
//                   <span className="text-gray-700 ml-1">{item.achievement_type}</span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <Calendar className="h-4 w-4 mr-2" />
//                   <span className="font-medium">Date:</span>
//                   <span className="text-gray-700 ml-1">{item.date_of_achievement}</span>
//                 </div>
//               </>
//             )}
//           </div>
//           <button
//             onClick={() => handleEditClick(item._id, type)}
//             className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
//           >
//             <Edit2 className="h-4 w-4 mr-2" />
//             Edit Details
//           </button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <AdminPageNavbar />
//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar
//           isOpen={sidebarOpen}

//           categories={sidebarCategories}
//           selectedCategory={selectedCategory}
//           onCategorySelect={setSelectedCategory}
//         />
//         <main className="flex-1 overflow-y-auto">
//           <div className="max-w-7xl mx-50 mr-12 p-6">
//             <header className="mb-8">
//               <h1 className="text-3xl font-bold text-gray-900">
//                 Manage {selectedCategory}
//               </h1>
//             </header>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {selectedCategory === "Jobs" && paginate(jobs).map((job) => renderCard(job, "job"))}
//               {selectedCategory === "Internships" &&
//                 paginate(internships).map((internship) => renderCard(internship, "internship"))}
//               {selectedCategory === "Study Materials" &&
//                 paginate(studyMaterials).map((study) => renderCard(study, "study"))}
//               {selectedCategory === "Achievements" &&
//                 paginate(achievements).map((achievement) => renderCard(achievement, "achievement"))}
//             </div>
//             <Pagination
//               currentPage={currentPage}
//               totalItems={
//                 selectedCategory === "Jobs"
//                   ? jobs.length
//                   : selectedCategory === "Internships"
//                   ? internships.length
//                   : selectedCategory === "Study Materials"
//                   ? studyMaterials.length
//                   : achievements.length
//               }
//               itemsPerPage={itemsPerPage}
//               onPageChange={setCurrentPage}
//             />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ManageJobs;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";
// import AdminPageNavbar from "../../components/Admin/AdminNavBar";
// import Pagination from "../../components/Admin/pagination";
// import Sidebar from "../../components/Admin/Sidebar";
// import {
//   Briefcase,
//   GraduationCap,
//   BookOpen,
//   Trophy,
//   View,
//   Edit2,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   Building2,
//   Folder,
//   Calendar,
//   MapPin,
//   DollarSign,
//   User,
//   FileText,
// } from "lucide-react";

// const ManageJobs = () => {
//   const [jobs, setJobs] = useState([]);
//   const [studyMaterials, setStudyMaterials] = useState([]);
//   const [internships, setInternships] = useState([]);
//   const [achievements, setAchievements] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("Jobs");
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async (endpoint, setState, key) => {
//       try {
//         const token = Cookies.get("jwt");
//         const response = await axios.get(
//           `http://localhost:8000/api/${endpoint}/`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             withCredentials: true,
//           }
//         );

//         if (response.data && Array.isArray(response.data[key])) {
//           setState(response.data[key]);
//         } else {
//           console.warn(`Invalid data received for ${key}:`, response.data);
//           setState([]);
//         }
//       } catch (error) {
//         console.error(`Error fetching ${key}:`, error);
//         setState([]);
//       }
//     };

//     fetchData("manage-jobs", setJobs, "jobs");
//     fetchData("manage-study-materials", setStudyMaterials, "study_materials");
//     fetchData("manage-internships", setInternships, "internships");
//     fetchData("manage-achievements", setAchievements, "achievements");
//   }, []);

//   const paginate = (items) => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return items.slice(startIndex, startIndex + itemsPerPage);
//   };

//   const handleEditClick = (id, type) => {
//     navigate(
//       type === "job"
//         ? `/job-edit/${id}`
//         : type === "study"
//         ? `/study-edit/${id}`
//         : type === "internship"
//         ? `/internship-edit/${id}`
//         : `/achievement-edit/${id}`
//     );
//   };

//   const getStatusStyle = (isPublish) => {
//     if (isPublish === true) {
//       return {
//         bg: "bg-emerald-100",
//         text: "text-emerald-800",
//         icon: CheckCircle2,
//         label: "Published",
//       };
//     } else if (isPublish === false) {
//       return {
//         bg: "bg-red-100",
//         text: "text-red-800",
//         icon: XCircle,
//         label: "Rejected",
//       };
//     }
//     return {
//       bg: "bg-amber-100",
//       text: "text-amber-800",
//       icon: Clock,
//       label: "Pending",
//     };
//   };

//   const sidebarCategories = [
//     { name: "Jobs", icon: Briefcase },
//     { name: "Internships", icon: GraduationCap },
//     { name: "Study Materials", icon: BookOpen },
//     { name: "Achievements", icon: Trophy },
//     // { name: "Notifications", icon: Bell },
//   ];

//   const renderCard = (item, type) => {
//     if (!item) return null;

//     let title,
//       company,
//       description,
//       experienceLevel,
//       jobLocation,
//       salaryRange,
//       selectedCategory;
//     if (type === "job") {
//       title = item.job_data?.title || "No Title";
//       company = item.job_data?.company_name || "Unknown Company";
//       experienceLevel = item.job_data?.experience_level || "Not Specified";
//       jobLocation = item.job_data?.job_location || "Not Specified";
//       salaryRange = item.job_data?.salary_range || "Not Specified";
//       selectedCategory = item.job_data?.selectedCategory || "No Category required";
//     } else if (type === "study") {
//       title = item.study_material_data?.title || "No Title";
//       company = item.study_material_data?.category || "Unknown Category";
//       // selectedCategory = item.study_material_data?.link || "No Category required";
//     } else if (type === "internship") {
//       title = item.internship_data?.title || "No Title";
//       company = item.internship_data?.company_name || "Unknown Company";
//       experienceLevel =
//         item.internship_data?.experience_level || "Not Specified";
//       jobLocation = item.internship_data?.location || "Not Specified";
//       salaryRange = item.internship_data?.salary_range || "Not Specified";
//       selectedCategory = item.internship_data?.selectedCategory || "Internship";
//     } else {
//       title = item.name || "No Title";
//       company = item.company_name || "No Company";
//       description = item.achievement_description || "No Skills required";
//     }

//     const status = getStatusStyle(item.is_publish);
//     const StatusIcon = status.icon;

//     return (
//       <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
//         <div className="p-6">
//           <div className="flex justify-between items-start mb-4">
//             <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">
//               {title}
//             </h2>
//             <span
//               className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.bg} ${status.text}`}
//             >
//               <StatusIcon className="h-4 w-4" />
//               {status.label}
//             </span>
//           </div>
//           <div className="space-y-3">
//             <div className="flex items-center text-gray-600">
//               {type === "study" ? (
//                 <Folder className="h-4 w-4 mr-2" />
//               ) : (
//                 <Building2 className="h-4 w-4 mr-2" />
//               )}
//               <span className="font-medium">
//                 {type === "study" ? "category:" : "Company:"}
//               </span>
//               <span className="text-gray-700 ml-1">{company}</span>
//               <span className="text-gray-700 ml-1">{selectedCategory}</span>
//             </div>
//             {type === "achievement" && (
//               <>
//                 <div className="flex items-center text-gray-600">
//                   <Trophy className="h-4 w-4 mr-2" />
//                   <span className="font-medium">Type:</span>
//                   <span className="text-gray-700 ml-1">
//                     {item.achievement_type}
//                   </span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <Calendar className="h-4 w-4 mr-2" />
//                   <span className="font-medium">Date:</span>
//                   <span className="text-gray-700 ml-1">
//                     {item.date_of_achievement}
//                   </span>
//                 </div>
//               </>
//             )}
//             {(type === "job" || type === "internship") && (
//               <>
//                 <div className="flex items-center text-gray-600">
//                   <User className="h-4 w-4 mr-2" />
//                   <span className="font-medium">Experience Level:</span>
//                   <span className="text-gray-700 ml-1">{experienceLevel}</span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <MapPin className="h-4 w-4 mr-2" />
//                   <span className="font-medium">Location:</span>
//                   <span className="text-gray-700 ml-1">{jobLocation}</span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <DollarSign className="h-4 w-4 mr-2" />
//                   <span className="font-medium">Salary Range:</span>
//                   <span className="text-gray-700 ml-1">{salaryRange}</span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <FileText className="h-4 w-4 mr-2" />
//                   <span className="font-medium">Category:</span>
//                   <span className="text-gray-700 ml-1">{selectedCategory}</span>
//                 </div>
//               </>
//             )}
//           </div>
//           <button
//             onClick={() => handleEditClick(item._id, type)}
//             className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
//           >
//             <View className="h-4 w-4 mr-2" />
//             Details
//           </button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <AdminPageNavbar />
//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar
//           isOpen={sidebarOpen}
//           categories={sidebarCategories}
//           selectedCategory={selectedCategory}
//           onCategorySelect={setSelectedCategory}
//         />
//         <main className="flex-1 overflow-y-auto">
//           <div className="max-w-7xl mx-50 mr-12 p-6">
//             <header className="mb-8">
//               <h1 className="text-3xl font-bold text-gray-900">
//                 Manage {selectedCategory}
//               </h1>
//             </header>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {selectedCategory === "Jobs" &&
//                 paginate(jobs).map((job) => renderCard(job, "job"))}
//               {selectedCategory === "Internships" &&
//                 paginate(internships).map((internship) =>
//                   renderCard(internship, "internship")
//                 )}
//               {selectedCategory === "Study Materials" &&
//                 paginate(studyMaterials).map((study) =>
//                   renderCard(study, "study")
//                 )}
//               {selectedCategory === "Achievements" &&
//                 paginate(achievements).map((achievement) =>
//                   renderCard(achievement, "achievement")
//                 )}
//             </div>
//             <Pagination
//               currentPage={currentPage}
//               totalItems={
//                 selectedCategory === "Jobs"
//                   ? jobs.length
//                   : selectedCategory === "Internships"
//                   ? internships.length
//                   : selectedCategory === "Study Materials"
//                   ? studyMaterials.length
//                   : achievements.length
//               }
//               itemsPerPage={itemsPerPage}
//               onPageChange={setCurrentPage}
//             />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ManageJobs;

// import { useEffect, useState } from "react"
// import axios from "axios"
// import Cookies from "js-cookie"
// import { useNavigate } from "react-router-dom"
// import AdminPageNavbar from "../../components/Admin/AdminNavBar"
// import Pagination from "../../components/Admin/pagination"
// import Sidebar from "../../components/Admin/Sidebar"
// import {
//   Briefcase,
//   GraduationCap,
//   BookOpen,
//   Trophy,
//   View,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   Building2,
//   Folder,
//   Calendar,
//   MapPin,
//   DollarSign,
//   User,
//   FileText,
// } from "lucide-react"

// const ManageJobs = () => {
//   const [jobs, setJobs] = useState([])
//   const [studyMaterials, setStudyMaterials] = useState([])
//   const [internships, setInternships] = useState([])
//   const [achievements, setAchievements] = useState([])
//   const [selectedCategory, setSelectedCategory] = useState("Jobs")
//   const [sidebarOpen, setSidebarOpen] = useState(true)
//   const [currentPage, setCurrentPage] = useState(1)
//   const itemsPerPage = 6
//   const navigate = useNavigate()

//   useEffect(() => {
//     const fetchData = async (endpoint, setState, key) => {
//       try {
//         const token = Cookies.get("jwt")
//         const response = await axios.get(`http://localhost:8000/api/${endpoint}/`, {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         })

//         if (response.data && Array.isArray(response.data[key])) {
//           setState(response.data[key])
//         } else {
//           console.warn(`Invalid data received for ${key}:`, response.data)
//           setState([])
//         }
//       } catch (error) {
//         console.error(`Error fetching ${key}:`, error)
//         setState([])
//       }
//     }

//     fetchData("manage-jobs", setJobs, "jobs")
//     fetchData("manage-study-materials", setStudyMaterials, "study_materials")
//     fetchData("manage-internships", setInternships, "internships")
//     fetchData("manage-achievements", setAchievements, "achievements")
//   }, [])

//   const paginate = (items) => {
//     const startIndex = (currentPage - 1) * itemsPerPage
//     return items.slice(startIndex, startIndex + itemsPerPage)
//   }

//   const handleEditClick = (id, type) => {
//     navigate(
//       type === "job"
//         ? `/job-edit/${id}`
//         : type === "study"
//           ? `/study-edit/${id}`
//           : type === "internship"
//             ? `/internship-edit/${id}`
//             : `/achievement-edit/${id}`,
//     )
//   }

//   const getStatusStyle = (isPublish) => {
//     if (isPublish === true) {
//       return {
//         bg: "bg-emerald-100",
//         text: "text-emerald-800",
//         icon: CheckCircle2,
//         label: "Published",
//       }
//     } else if (isPublish === false) {
//       return {
//         bg: "bg-red-100",
//         text: "text-red-800",
//         icon: XCircle,
//         label: "Rejected",
//       }
//     }
//     return {
//       bg: "bg-amber-100",
//       text: "text-amber-800",
//       icon: Clock,
//       label: "Pending",
//     }
//   }

//   const sidebarCategories = [
//     { name: "Jobs", icon: Briefcase },
//     { name: "Internships", icon: GraduationCap },
//     { name: "Study Materials", icon: BookOpen },
//     { name: "Achievements", icon: Trophy },
//   ]

//   const renderCard = (item, type) => {
//     if (!item) return null

//     let title, company, description, experienceLevel, jobLocation, salaryRange, selectedCategory
//     if (type === "job") {
//       title = item.job_data?.title || "No Title"
//       company = item.job_data?.company_name || "Unknown Company"
//       experienceLevel = item.job_data?.experience_level || "Not Specified"
//       jobLocation = item.job_data?.job_location || "Not Specified"
//       salaryRange = item.job_data?.salary_range || "Not Specified"
//       selectedCategory = item.job_data?.selectedCategory || "No Category required"
//     } else if (type === "study") {
//       title = item.study_material_data?.title || "No Title"
//       company = item.study_material_data?.category || "Unknown Category"
//       selectedCategory = item.study_material_data?.link || "No Link"
//     } else if (type === "internship") {
//       title = item.internship_data?.title || "No Title"
//       company = item.internship_data?.company_name || "Unknown Company"
//       experienceLevel = item.internship_data?.experience_level || "Not Specified"
//       jobLocation = item.internship_data?.location || "Not Specified"
//       salaryRange = item.internship_data?.salary_range || "Not Specified"
//       selectedCategory = item.internship_data?.selectedCategory || "Internship"
//     } else {
//       title = item.name || "No Title"
//       company = item.company_name || "No Company"
//       description = item.achievement_description || "No Skills required"
//     }

//     const status = getStatusStyle(item.is_publish)
//     const StatusIcon = status.icon

//     return (
//       <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 transform hover:-translate-y-1">
//         <div className="p-6">
//           <div className="flex justify-between items-start mb-4">
//             <h2 className="text-xl font-semibold text-gray-800 line-clamp-2 hover:line-clamp-none transition-all duration-300">
//               {title}
//             </h2>
//             <span
//               className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.bg} ${status.text}`}
//             >
//               <StatusIcon className="h-4 w-4" />
//               {status.label}
//             </span>
//           </div>
//           <div className="space-y-3">
//             <div className="flex items-center text-gray-600">
//               {type === "study" ? (
//                 <Folder className="h-4 w-4 mr-2 text-indigo-500" />
//               ) : (
//                 <Building2 className="h-4 w-4 mr-2 text-indigo-500" />
//               )}
//               <span className="font-medium">{type === "study" ? "Category:" : "Company:"}</span>
//               <span className="text-gray-700 ml-1 font-bold ">{company}</span>
//             </div>
//             {type === "achievement" && (
//               <>
//                 <div className="flex items-center text-gray-600">
//                   <Trophy className="h-4 w-4 mr-2 text-indigo-500" />
//                   <span className="font-medium">Type:</span>
//                   <span className="text-gray-700 ml-1 font-bold">{item.achievement_type}</span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
//                   <span className="font-medium">Date:</span>
//                   <span className="text-gray-700 ml-1 font-bold">{item.date_of_achievement}</span>
//                 </div>
//               </>
//             )}
//             {(type === "job" || type === "internship") && (
//               <>
//                 <div className="flex items-center text-gray-600">
//                   <User className="h-4 w-4 mr-2 text-indigo-500" />
//                   <span className="font-medium">Experience:</span>
//                   <span className="text-gray-700 ml-1 font-bold">{experienceLevel}</span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
//                   <span className="font-medium">Location:</span>
//                   <span className="text-gray-700 ml-1 font-bold">{jobLocation}</span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <DollarSign className="h-4 w-4 mr-2 text-indigo-500" />
//                   <span className="font-medium">Salary:</span>
//                   <span className="text-gray-700 ml-1 font-bold">{salaryRange}</span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <FileText className="h-4 w-4 mr-2 text-indigo-500" />
//                   <span className="font-medium">Category:</span>
//                   <span className="text-gray-700 ml-1 font-bold">{selectedCategory}</span>
//                 </div>
//               </>
//             )}
//           </div>
//           <button
//             onClick={() => handleEditClick(item._id, type)}
//             className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 bg-yellow-200 text-black rounded-lg hover:bg-yellow-500 transition-colors duration-200 font-semibold"
//           >
//             <View className="h-4 w-4 mr-2" />
//             View Details
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <AdminPageNavbar />
//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar
//           isOpen={sidebarOpen}
//           categories={sidebarCategories}
//           selectedCategory={selectedCategory}
//           onCategorySelect={setSelectedCategory}
//         />
//         <main className="flex-1 overflow-y-auto">
//           <div className="max-w-8xl mx-auto px-10 sm:px-6 lg:px-55 py-8 ml-25">
//             <header className="mb-8">
//               <h1 className="text-3xl font-bold text-gray-900">Manage {selectedCategory}</h1>
//             </header>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-3 gap-6">

//               {selectedCategory === "Jobs" && paginate(jobs).map((job) => renderCard(job, "job"))}
//               {selectedCategory === "Internships" &&
//                 paginate(internships).map((internship) => renderCard(internship, "internship"))}
//               {selectedCategory === "Study Materials" &&
//                 paginate(studyMaterials).map((study) => renderCard(study, "study"))}
//               {selectedCategory === "Achievements" &&
//                 paginate(achievements).map((achievement) => renderCard(achievement, "achievement"))}
//             </div>
//             <div className="mt-8">
//               <Pagination
//                 currentPage={currentPage}
//                 totalItems={
//                   selectedCategory === "Jobs"
//                     ? jobs.length
//                     : selectedCategory === "Internships"
//                       ? internships.length
//                       : selectedCategory === "Study Materials"
//                         ? studyMaterials.length
//                         : achievements.length
//                 }
//                 itemsPerPage={itemsPerPage}
//                 onPageChange={setCurrentPage}
//               />
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

// export default ManageJobs

// import { useEffect, useState } from "react"
// import axios from "axios"
// import Cookies from "js-cookie"
// import { useNavigate } from "react-router-dom"
// import AdminPageNavbar from "../../components/Admin/AdminNavBar"
// import Pagination from "../../components/Admin/pagination"
// import Sidebar from "../../components/Admin/Sidebar"
// import {
//   Briefcase,
//   GraduationCap,
//   BookOpen,
//   Trophy,
//   View,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   Building2,
//   Folder,
//   Calendar,
//   MapPin,
//   DollarSign,
//   User,
//   FileText,
// } from "lucide-react"

// const ManageJobs = () => {
//   const [jobs, setJobs] = useState([])
//   const [studyMaterials, setStudyMaterials] = useState([])
//   const [internships, setInternships] = useState([])
//   const [achievements, setAchievements] = useState([])
//   const [selectedCategory, setSelectedCategory] = useState("Jobs")
//   const [sidebarOpen, setSidebarOpen] = useState(true)
//   const [currentPage, setCurrentPage] = useState(1)
//   const itemsPerPage = 6
//   const navigate = useNavigate()

//   useEffect(() => {
//     const fetchData = async (endpoint, setState, key) => {
//       try {
//         const token = Cookies.get("jwt")
//         const response = await axios.get(`http://localhost:8000/api/${endpoint}/`, {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         })

//         if (response.data && Array.isArray(response.data[key])) {
//           setState(response.data[key])
//         } else {
//           console.warn(`Invalid data received for ${key}:`, response.data)
//           setState([])
//         }
//       } catch (error) {
//         console.error(`Error fetching ${key}:`, error)
//         setState([])
//       }
//     }

//     fetchData("manage-jobs", setJobs, "jobs")
//     fetchData("manage-study-materials", setStudyMaterials, "study_materials")
//     fetchData("manage-internships", setInternships, "internships")
//     fetchData("manage-achievements", setAchievements, "achievements")
//   }, [])

//   const paginate = (items) => {
//     const startIndex = (currentPage - 1) * itemsPerPage
//     return items.slice(startIndex, startIndex + itemsPerPage)
//   }

//   const handleEditClick = (id, type) => {
//     navigate(
//       type === "job"
//         ? `/job-edit/${id}`
//         : type === "study"
//           ? `/study-edit/${id}`
//           : type === "internship"
//             ? `/internship-edit/${id}`
//             : `/achievement-edit/${id}`,
//     )
//   }

//   const getStatusStyle = (isPublish) => {
//     if (isPublish === true) {
//       return {
//         bg: "bg-emerald-100",
//         text: "text-emerald-800",
//         icon: CheckCircle2,
//         label: "Published",
//       }
//     } else if (isPublish === false) {
//       return {
//         bg: "bg-red-100",
//         text: "text-red-800",
//         icon: XCircle,
//         label: "Rejected",
//       }
//     }
//     return {
//       bg: "bg-amber-100",
//       text: "text-amber-800",
//       icon: Clock,
//       label: "Pending",
//     }
//   }

//   const sidebarCategories = [
//     { name: "Jobs", icon: Briefcase },
//     { name: "Internships", icon: GraduationCap },
//     { name: "Study Materials", icon: BookOpen },
//     { name: "Achievements", icon: Trophy },
//   ]

//   const renderCard = (item, type) => {
//     if (!item) return null

//     let title, company, description, experienceLevel, jobLocation, salaryRange, selectedCategory
//     if (type === "job") {
//       title = item.job_data?.title || "No Title"
//       company = item.job_data?.company_name || "Unknown Company"
//       experienceLevel = item.job_data?.experience_level || "Not Specified"
//       jobLocation = item.job_data?.job_location || "Not Specified"
//       salaryRange = item.job_data?.salary_range || "Not Specified"
//       selectedCategory = item.job_data?.selectedCategory || "No Category required"
//     } else if (type === "study") {
//       title = item.study_material_data?.title || "No Title"
//       company = item.study_material_data?.category || "Unknown Category"
//       selectedCategory = item.study_material_data?.link || "No Link"
//     } else if (type === "internship") {
//       title = item.internship_data?.title || "No Title"
//       company = item.internship_data?.company_name || "Unknown Company"
//       experienceLevel = item.internship_data?.experience_level || "Not Specified"
//       jobLocation = item.internship_data?.location || "Not Specified"
//       salaryRange = item.internship_data?.salary_range || "Not Specified"
//       selectedCategory = item.internship_data?.selectedCategory || "Internship"
//     } else {
//       title = item.name || "No Title"
//       company = item.company_name || "No Company"
//       description = item.achievement_description || "No Skills required"
//     }

//     const status = getStatusStyle(item.is_publish)
//     const StatusIcon = status.icon

//     return (
//       <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform hover:-translate-y-2 overflow-hidden border border-gray-100">
//         <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//         <div className="relative p-6 space-y-4">
//           <div className="flex justify-between items-start">
//             <h2 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
//               {title}
//             </h2>
//             <span
//               className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${status.bg} ${status.text} shadow-sm transition-all duration-300 group-hover:shadow-md`}
//             >
//               <StatusIcon className="h-4 w-4" strokeWidth={2.5} />
//               {status.label}
//             </span>
//           </div>

//           <div className="space-y-3.5">
//             <div className="flex items-center text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
//               {type === "study" ? (
//                 <Folder className="h-5 w-5 mr-3 text-indigo-600" />
//               ) : (
//                 <Building2 className="h-5 w-5 mr-3 text-indigo-600" />
//               )}
//               <span className="font-medium min-w-[80px]">{type === "study" ? "Category:" : "Company:"}</span>
//               <span className="font-semibold text-gray-900">{company}</span>
//             </div>

//             {type === "achievement" && (
//               <>
//                 <div className="flex items-center text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
//                   <Trophy className="h-5 w-5 mr-3 text-indigo-600" />
//                   <span className="font-medium min-w-[80px]">Type:</span>
//                   <span className="font-semibold text-gray-900">{item.achievement_type}</span>
//                 </div>
//                 <div className="flex items-center text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
//                   <Calendar className="h-5 w-5 mr-3 text-indigo-600" />
//                   <span className="font-medium min-w-[80px]">Date:</span>
//                   <span className="font-semibold text-gray-900">{item.date_of_achievement}</span>
//                 </div>
//               </>
//             )}

//             {(type === "job" || type === "internship") && (
//               <>
//                 <div className="flex items-center text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
//                   <User className="h-5 w-5 mr-3 text-indigo-600" />
//                   <span className="font-medium min-w-[80px]">Experience:</span>
//                   <span className="font-semibold text-gray-900">{experienceLevel}</span>
//                 </div>
//                 <div className="flex items-center text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
//                   <MapPin className="h-5 w-5 mr-3 text-indigo-600" />
//                   <span className="font-medium min-w-[80px]">Location:</span>
//                   <span className="font-semibold text-gray-900">{jobLocation}</span>
//                 </div>
//                 <div className="flex items-center text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
//                   <DollarSign className="h-5 w-5 mr-3 text-indigo-600" />
//                   <span className="font-medium min-w-[80px]">Salary:</span>
//                   <span className="font-semibold text-gray-900">{salaryRange}</span>
//                 </div>
//                 <div className="flex items-center text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
//                   <FileText className="h-5 w-5 mr-3 text-indigo-600" />
//                   <span className="font-medium min-w-[80px]">Category:</span>
//                   <span className="font-semibold text-gray-900">{selectedCategory}</span>
//                 </div>
//               </>
//             )}
//           </div>

//           <button
//             onClick={() => handleEditClick(item._id, type)}
//             className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-100 to-yellow-300 text-black rounded-xl hover:from-yellow-700 hover:to-yellow-500 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//           >
//             <View className="h-5 w-5 mr-2" />
//             View Details
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <AdminPageNavbar />
//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar
//           isOpen={sidebarOpen}
//           categories={sidebarCategories}
//           selectedCategory={selectedCategory}
//           onCategorySelect={setSelectedCategory}
//         />
//         <main className="flex-1 overflow-y-auto">
//           <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 ml-50">
//             <header className="mb-8">
//               <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
//                 Manage {selectedCategory}
//               </h1>
//               <p className="mt-2 text-lg text-gray-600">
//                 View and manage all your {selectedCategory.toLowerCase()} in one place
//               </p>
//             </header>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-6">
//               {selectedCategory === "Jobs" && paginate(jobs).map((job) => renderCard(job, "job"))}
//               {selectedCategory === "Internships" &&
//                 paginate(internships).map((internship) => renderCard(internship, "internship"))}
//               {selectedCategory === "Study Materials" &&
//                 paginate(studyMaterials).map((study) => renderCard(study, "study"))}
//               {selectedCategory === "Achievements" &&
//                 paginate(achievements).map((achievement) => renderCard(achievement, "achievement"))}
//             </div>

//             <div className="mt-12">
//               <Pagination
//                 currentPage={currentPage}
//                 totalItems={
//                   selectedCategory === "Jobs"
//                     ? jobs.length
//                     : selectedCategory === "Internships"
//                       ? internships.length
//                       : selectedCategory === "Study Materials"
//                         ? studyMaterials.length
//                         : achievements.length
//                 }
//                 itemsPerPage={itemsPerPage}
//                 onPageChange={setCurrentPage}
//               />
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

// export default ManageJobs

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import Pagination from "../../components/Admin/pagination";
import Sidebar from "../../components/Admin/Sidebar";
import {
  Briefcase,
  GraduationCap,
  BookOpen,
  Trophy,
  View,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Folder,
  Calendar,
  MapPin,
  FileText,
} from "lucide-react";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [internships, setInternships] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Jobs");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (endpoint, setState, key) => {
      try {
        const token = Cookies.get("jwt");
        const response = await axios.get(
          `http://localhost:8000/api/${endpoint}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (response.data && Array.isArray(response.data[key])) {
          setState(response.data[key]);
        } else {
          console.warn(`Invalid data received for ${key}:`, response.data);
          setState([]);
        }
      } catch (error) {
        console.error(`Error fetching ${key}:`, error);
        setState([]);
      }
    };

    fetchData("manage-jobs", setJobs, "jobs");
    fetchData("manage-study-materials", setStudyMaterials, "study_materials");
    fetchData("manage-internships", setInternships, "internships");
    fetchData("manage-achievements", setAchievements, "achievements");
  }, []);

  const paginate = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleEditClick = (id, type) => {
    navigate(
      type === "job"
        ? `/job-edit/${id}`
        : type === "study"
        ? `/study-edit/${id}`
        : type === "internship"
        ? `/internship-edit/${id}`
        : `/achievement-edit/${id}`
    );
  };

  const getStatusStyle = (isPublish) => {
    if (isPublish === true) {
      return {
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        icon: CheckCircle2,
        label: "Published",
      };
    } else if (isPublish === false) {
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: XCircle,
        label: "Rejected",
      };
    }
    return {
      bg: "bg-amber-100",
      text: "text-amber-800",
      icon: Clock,
      label: "Pending",
    };
  };

  const sidebarCategories = [
    { name: "Jobs", icon: Briefcase },
    { name: "Internships", icon: GraduationCap },
    { name: "Study Materials", icon: BookOpen },
    { name: "Achievements", icon: Trophy },
  ];

  const renderCard = (item, type) => {
    if (!item) return null;

    let title, company, description, jobLocation, selectedCategory;
    if (type === "job") {
      title = item.job_data?.title || "No Title";
      company = item.job_data?.company_name || "Unknown Company";
      jobLocation = item.job_data?.job_location || "Not Specified";
      selectedCategory =
        item.job_data?.selectedCategory || "No Category required";
    } else if (type === "study") {
      title = item.study_material_data?.title || "No Title";
      company = item.study_material_data?.category || "Unknown Category";
    } else if (type === "internship") {
      title = item.internship_data?.title || "No Title";
      company = item.internship_data?.company_name || "Unknown Company";
      jobLocation = item.internship_data?.location || "Not Specified";
      selectedCategory = item.internship_data?.selectedCategory || "Internship";
    } else {
      title = item.name || "No Title";
      company = item.company_name || "No Company";
      description = item.achievement_description || "No Skills required";
    }

    const status = getStatusStyle(item.is_publish);
    const StatusIcon = status.icon;

    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">
              {title}
            </h2>
            <span
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.bg} ${status.text}`}
            >
              <StatusIcon className="h-4 w-4" />
              {status.label}
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              {type === "study" ? (
                <Folder className="h-4 w-4 mr-2" />
              ) : (
                <Building2 className="h-4 w-4 mr-2" />
              )}
              <span className="font-medium">
                {type === "study" ? "Category:" : "Company:"}
              </span>
              <span className="text-gray-700 ml-1">{company}</span>
            </div>
            {type === "achievement" && (
              <>
                <div className="flex items-center text-gray-600">
                  <Trophy className="h-4 w-4 mr-2" />
                  <span className="font-medium">Type:</span>
                  <span className="text-gray-700 ml-1">
                    {item.achievement_type}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="font-medium">Date:</span>
                  <span className="text-gray-700 ml-1">
                    {item.date_of_achievement}
                  </span>
                </div>
              </>
            )}
            {(type === "job" || type === "internship") && (
              <>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="font-medium">Location:</span>
                  <span className="text-gray-700 ml-1">{jobLocation}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FileText className="h-4 w-4 mr-2" />
                  <span className="font-medium">Category:</span>
                  <span className="text-gray-700 ml-1">{selectedCategory}</span>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => handleEditClick(item._id, type)}
            className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-yellow-500 text-black rounded-lg hover:bg-yellow-200 transition-colors duration-200"
          >
            <View className="h-4 w-4 mr-2" />
            View
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AdminPageNavbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          categories={sidebarCategories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-50 mr-12 p-8">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Manage {selectedCategory}
              </h1>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {selectedCategory === "Jobs" &&
                paginate(jobs).map((job) => renderCard(job, "job"))}
              {selectedCategory === "Internships" &&
                paginate(internships).map((internship) =>
                  renderCard(internship, "internship")
                )}
              {selectedCategory === "Study Materials" &&
                paginate(studyMaterials).map((study) =>
                  renderCard(study, "study")
                )}
              {selectedCategory === "Achievements" &&
                paginate(achievements).map((achievement) =>
                  renderCard(achievement, "achievement")
                )}
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={
                selectedCategory === "Jobs"
                  ? jobs.length
                  : selectedCategory === "Internships"
                  ? internships.length
                  : selectedCategory === "Study Materials"
                  ? studyMaterials.length
                  : achievements.length
              }
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageJobs;
