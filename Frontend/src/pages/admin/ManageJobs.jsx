// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";
// import AdminPageNavbar from "../../components/Admin/AdminNavBar";
// import Pagination from "../../components/Admin/pagination";

// const ManageJobs = () => {
//   const [jobs, setJobs] = useState([]);
//   const [studyMaterials, setStudyMaterials] = useState([]);
//   const [internships, setInternships] = useState([]);
//   const [achievements, setAchievements] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("Jobs"); // Sidebar selection
//   const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar toggle state
//   const navigate = useNavigate();

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6; // Change this as needed

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
//           setState([]); // Prevent issues
//         }
//       } catch (error) {
//         console.error(`Error fetching ${key}:`, error);
//         setState([]); // Prevent undefined errors
//       }
//     };

//     fetchData("manage-jobs", setJobs, "jobs");
//     fetchData("manage-study-materials", setStudyMaterials, "study_materials");
//     fetchData("manage-internships", setInternships, "internships");
//     fetchData("manage-achievements", setAchievements, "achievements");
//   }, []);

//   // Pagination Logic
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
//       description = item.achievement_description || "No Description";
//     }

//     return (
//       <div
//         key={item._id}
//         className="border rounded-lg shadow-md p-4 flex flex-col justify-between h-full"
//       >
//         <div>
//           <div className="flex justify-between items-center mb-2">
//             <h2 className="text-xl font-semibold">{title}</h2>
//             <span
//               className={`px-2 py-1 text-sm font-semibold rounded
//               ${
//                 item.is_publish === true
//                   ? "bg-green-100 text-green-800"
//                   : item.is_publish === false
//                   ? "bg-red-100 text-red-800"
//                   : "bg-yellow-100 text-yellow-800"
//               }`}
//             >
//               {item.is_publish === true
//                 ? "Published"
//                 : item.is_publish === false
//                 ? "Rejected"
//                 : "Pending"}
//             </span>
//           </div>
//           <p className="text-gray-600">
//             <strong>{type === "study" ? "Category:" : "Company:"}</strong>{" "}
//             {company}
//           </p>
//           {type === "achievement" && (
//             <>
//               <p className="text-gray-600">
//                 <strong>Type:</strong> {item.achievement_type}
//               </p>
//               <p className="text-gray-600">
//                 <strong>Description:</strong> {description}
//               </p>
//               <p className="text-gray-600">
//                 <strong>Date:</strong> {item.date_of_achievement}
//               </p>
//             </>
//           )}
//         </div>
//         <button
//           onClick={() => handleEditClick(item._id, type)}
//           className="text-blue-500 mt-4 self-start border border-blue-500 px-4 py-1 rounded hover:bg-blue-500 hover:text-white transition"
//         >
//           Edit
//         </button>
//       </div>
//     );
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div
//         className={`bg-gray-100 p-4 transition-all ${
//           sidebarOpen ? "w-1/5" : "w-16"
//         } overflow-hidden`}
//       >
//         <button
//           className="mb-4 text-blue-500"
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//         >
//           {sidebarOpen ? "◀ Hide" : "▶ Show"}
//         </button>
//         {sidebarOpen && (
//           <>
//             <h2 className="text-xl font-semibold mb-4">Categories</h2>
//             <ul className="space-y-2">
//               {[
//                 "Jobs",
//                 "Internships",
//                 "Study Materials",
//                 "Achievements",
//                 "Notifications",
//               ].map((category) => (
//                 <li
//                   key={category}
//                   onClick={() => setSelectedCategory(category)}
//                   className={`cursor-pointer p-2 rounded-lg ${
//                     selectedCategory === category
//                       ? "bg-blue-500 text-white"
//                       : "hover:bg-gray-200"
//                   }`}
//                 >
//                   {category}
//                 </li>
//               ))}
//             </ul>
//           </>
//         )}
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6">
//         <AdminPageNavbar />
//         <h1 className="text-3xl pt-5 text-center font-bold mb-4">
//           Manage {selectedCategory}
//         </h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {selectedCategory === "Jobs" &&
//             paginate(jobs).map((job) => renderCard(job, "job"))}
//           {selectedCategory === "Internships" &&
//             paginate(internships).map((internship) =>
//               renderCard(internship, "internship")
//             )}
//           {selectedCategory === "Study Materials" &&
//             paginate(studyMaterials).map((study) => renderCard(study, "study"))}
//           {selectedCategory === "Achievements" &&
//             paginate(achievements).map((achievement) =>
//               renderCard(achievement, "achievement")
//             )}
//         </div>

//         {/* Pagination */}
//         <Pagination
//           currentPage={currentPage}
//           totalItems={jobs.length}
//           itemsPerPage={itemsPerPage}
//           onPageChange={(page) => setCurrentPage(page)}
//         />
//       </div>
//     </div>
//   );
// };

// export default ManageJobs;

import React, { useEffect, useState } from "react";
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
  Bell,
  ChevronLeft,
  ChevronRight,
  Edit2,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Folder,
  Calendar,
} from "lucide-react";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [internships, setInternships] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Jobs");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
    { name: "Notifications", icon: Bell },
  ];

  const renderCard = (item, type) => {
    if (!item) return null;

    let title, company, description;
    if (type === "job") {
      title = item.job_data?.title || "No Title";
      company = item.job_data?.company_name || "Unknown Company";
    } else if (type === "study") {
      title = item.study_material_data?.title || "No Title";
      company = item.study_material_data?.category || "Unknown Category";
    } else if (type === "internship") {
      title = item.internship_data?.title || "No Title";
      company = item.internship_data?.company_name || "Unknown Company";
    } else {
      title = item.name || "No Title";
      company = item.company_name || "No Company";
      description = item.achievement_description || "No Description";
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
              </span>{" "}
              <span className="text-gray-700 ml-1">{company}</span>
            </div>

            {type === "achievement" && (
              <>
                <div className="flex items-center text-gray-600">
                  <Trophy className="h-4 w-4 mr-2" />
                  <span className="font-medium">Type:</span>{" "}
                  <span className="text-gray-700 ml-1">
                    {item.achievement_type}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-4 w-4 mr-2" />
                  </div>
                  <div>
                    <span className="font-medium">Description:</span>{" "}
                    <span className="text-gray-700 line-clamp-2">
                      {description}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="font-medium">Date:</span>{" "}
                  <span className="text-gray-700 ml-1">
                    {item.date_of_achievement}
                  </span>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => handleEditClick(item._id, type)}
            className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-1"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        categories={sidebarCategories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        className="mt-30"
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <AdminPageNavbar />

        <main className="p-6 md:p-10">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              {React.createElement(
                sidebarCategories.find((cat) => cat.name === selectedCategory)
                  ?.icon,
                { className: "h-8 w-8 mr-3 text-[#ffcc00]" }
              )}
              Manage {selectedCategory}
            </h1>
            <p className="mt-2 text-gray-600">
              View and manage all {selectedCategory.toLowerCase()} entries
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            {selectedCategory === "Notifications" && (
              <div className="col-span-full flex flex-col items-center justify-center py-10 space-y-4">
                <Bell className="h-16 w-16 text-gray-300" />
                <p className="text-gray-500 text-lg">
                  Notification management coming soon...
                </p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalItems={
                selectedCategory === "Jobs"
                  ? jobs.length
                  : selectedCategory === "Internships"
                  ? internships.length
                  : selectedCategory === "Study Materials"
                  ? studyMaterials.length
                  : selectedCategory === "Achievements"
                  ? achievements.length
                  : 0
              }
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageJobs;
