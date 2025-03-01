// import { useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import { FiMail, FiPlus, FiMenu } from "react-icons/fi";
// import snslogo from "../../assets/images/SNS Group Logo 1.png";
// import { RxDashboard } from "react-icons/rx";
// import { MdOutlineWorkOutline } from "react-icons/md";
// import { PiStudent } from "react-icons/pi";
// import { GoTrophy } from "react-icons/go";
// import verifyIcon from "../../assets/icons/material-symbols_order-approve-outline-rounded.png";
// import Managementverify from "../../assets/icons/Group.png";
// import { HiOutlineBookOpen } from "react-icons/hi2";
// import { RiSettings3Line } from "react-icons/ri";
// import LogoutIcon from "../../assets/icons/material-symbols_logout-rounded.png";

// export default function AdminSidebar() {
//   const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
//   const [isCreateMenuOpen, setCreateMenuOpen] = useState(false);
//   const [isMailPopupOpen, setMailPopupOpen] = useState(false);
//   const [isMenuOpen, setMenuOpen] = useState(false);
//   const [username, setUsername] = useState("");

//   useEffect(() => {
//     // Retrieve the username from cookies when the component mounts
//     const user = Cookies.get("username");
//     if (user) {
//       setUsername(user);
//     }
//   }, []);

//   const handleLogout = () => {
//     // Clear the JWT cookie
//     Cookies.remove("jwt");

//     // Redirect to the login page
//     window.location.href = "/";
//   };

//   const userInitials = username ? username.charAt(0).toUpperCase() : "S";

//   return (
//     <div className="relative w-57 z-[9999]">
//       <div className="fixed md:flex">
//         {/* Hamburger Menu Button */}
//         <button
//           onClick={() => setMenuOpen(!isMenuOpen)}
//           className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-full"
//         >
//           <FiMenu size={20} />
//         </button>

//         {/* Sidebar */}
//         <div
//           className={`bg-white shadow-lg h-screen md:relative w-57 fixed left-0 top-0 flex flex-col transform ${
//             isMenuOpen ? "translate-x-0" : "-translate-x-full"
//           } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
//         >
//           <div className="p-4 border-b border-gray-400  flex items-center justify-center bg-[#ffc800]">
//             <img src={snslogo} alt="Logo" className="h-7 w-15 mr-2" />
//             <h1 className="text-lg font-semibold">CCE</h1>
//           </div>

//           <h2 className="text-gray-500 font-medium mb-1 ml-4 mt-2">
//             MAIN MENUE
//           </h2>

//           <nav className="flex-1 overflow-y-auto">
//             <ul className="p-2">
//               <li className="mb-2">
//                 <a
//                   href="/admin/home"
//                   className="flex items-center p-2 hover:bg-yellow-200 rounded"
//                 >
//                   <RxDashboard className="mr-3" /> Dashboard
//                 </a>
//               </li>
//               <li className="mb-2">
//                 <a
//                   href="/jobs"
//                   className="flex items-center p-2 hover:bg-yellow-200 rounded"
//                 >
//                   <MdOutlineWorkOutline className="mr-3" /> Jobs
//                 </a>
//               </li>
//               <li className="mb-2">
//                 <a
//                   href="/internships"
//                   className="flex items-center p-2 hover:bg-yellow-200 rounded"
//                 >
//                   <PiStudent className="mr-3" /> Internships
//                 </a>
//               </li>
//               <li className="mb-2">
//                 <a
//                   href="/study-material"
//                   className="flex items-center p-2 hover:bg-yellow-200 rounded"
//                 >
//                   <HiOutlineBookOpen className="mr-3" /> Study Material
//                 </a>
//               </li>

//               <li className="mb-2">
//                 <a
//                   href="/admin-achievements"
//                   className="flex items-center p-2 hover:bg-yellow-200 rounded"
//                 >
//                   <GoTrophy className="mr-3" /> Achievements
//                 </a>
//               </li>
//               <li className="mb-2">
//                 <a
//                   href="/admin/mail"
//                   className="flex items-center p-2 hover:bg-yellow-200 rounded"
//                 >
//                   <FiMail className="mr-3" /> Inbox
//                 </a>
//               </li>

//               <li className="mb-2 relative">
//                 <button
//                   onClick={() => {
//                     setCreateMenuOpen(!isCreateMenuOpen);
//                     setProfileMenuOpen(false);
//                     setMailPopupOpen(false);
//                   }}
//                   className="flex items-center justify-between w-full px-4 py-3 text-gray-400 font-medium border-t border-b border-gray-400"
//                 >
//                   <span className="">CREATE</span>
//                   <FiPlus className="text-gray-400" />
//                 </button>

//                 {isCreateMenuOpen && (
//                   <ul className="absolute z-10 bg-white shadow-md border border-gray-200 w-full mt-1 rounded">
//                     <li>
//                       <a
//                         href="/jobselection"
//                         className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
//                       >
//                         Job Post
//                       </a>
//                     </li>
//                     <li>
//                       <a
//                         href="/internshipselection"
//                         className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
//                       >
//                         Internship
//                       </a>
//                     </li>
//                     <li>
//                       <a
//                         href="/achievementpost"
//                         className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
//                       >
//                         Achievement Post
//                       </a>
//                     </li>
//                     <li>
//                       <a
//                         href="/studymaterial-post"
//                         className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
//                       >
//                         Study Material Post
//                       </a>
//                     </li>
//                   </ul>
//                 )}
//               </li>

//               <h2 className="text-gray-500 font-medium mb-4 ml-2">MANAGE</h2>

//               <ul>
//                 <li className="mb-2 relative">
//                   <li className="mb-2">
//                     <a
//                       href="/manage-student"
//                       className="flex items-center p-2 hover:bg-yellow-200 rounded"
//                     >
//                       <img
//                         src={Managementverify}
//                         alt="Manage Post"
//                         className="mr-2"
//                       />
//                       Student Management
//                     </a>
//                   </li>
//                 </li>
//                 <li className="mb-2">
//                   <a
//                     href="/manage-jobs"
//                     className="flex items-center p-2 hover:bg-yellow-200 rounded"
//                   >
//                     <img src={verifyIcon} alt="Manage Post" className="mr-2" />
//                     Manage Post
//                   </a>
//                 </li>
//               </ul>
//             </ul>
//           </nav>
//           <div className="p-4">
//             <div className="relative">
//               <button
//                 onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
//                 className="flex items-center p-2 hover:bg-yellow-200 rounded w-full px-0"
//               >
//                 <RiSettings3Line className="mr-2 " /> Setting
//               </button>
//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left flex items-center px-0 py-2 hover:bg-yellow-200"
//               >
//                 <img src={LogoutIcon} alt="Logout" className="mr-2" />
//                 Logout
//               </button>
//               <div className="border-t border-gray-400"></div>
//               {isProfileMenuOpen && (
//                 <ul className="absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-lg w-full">
//                   <li>
//                     <a
//                       href="/profile"
//                       className="block px-4 py-2 hover:bg-yellow-200"
//                     >
//                       View Profile
//                     </a>
//                   </li>
//                 </ul>
//               )}
//             </div>
//             <div className="flex items-center p-4 px-0">
//               <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-[#000000] text-lg font-semibold mr-3">
//                 {userInitials}
//               </div>
//               <div>
//                 <p className="font-semibold text-[#000000]">
//                   {username || "Admin"}
//                 </p>
//                 <p className="text-sm text-[#000000]">Administrator</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Overlay to close the menu on clicking outside */}
//         {isMenuOpen && (
//           <div
//             onClick={() => setMenuOpen(false)}
//             className="fixed inset-0 bg-black opacity-50 lg:hidden z-30"
//           ></div>
//         )}
//       </div>
//     </div>
//   );
// }








import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AchievementPostForm() {
  const [formData, setFormData] = useState({
    name: "",
    achievement_description: "",
    achievement_type: "",
    company_name: "",
    date_of_achievement: "",
    batch: "",
    photo: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    const decodedToken = jwtDecode(token);
    if (decodedToken.role !== "superadmin" && decodedToken.role !== "admin") {
      toast.error("You do not have permission to access this page.");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    setUserRole(payload.role);
    if (payload.role === "admin") {
      setUserId(payload.admin_user);
    } else if (payload.role === "superadmin") {
      setUserId(payload.superadmin_user);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        setFormData({ ...formData, photo: file });
        setImagePreview(URL.createObjectURL(file));
      } else {
        toast.error("Only JPG and PNG images are allowed.");
        setFormData({ ...formData, photo: null });
        setImagePreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate date
    const selectedDate = new Date(formData.date_of_achievement);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

    if (selectedDate > today) {
      toast.error("Date of achievement cannot be in the future.");
      setLoading(false);
      return;
    }

    // Validate batch field format
    const batchPattern = /^[0-9]{4} - [0-9]{4}$/;
    if (!batchPattern.test(formData.batch)) {
      toast.error("Batch should be in the format YYYY - YYYY. (e.g. 2020 - 2024)");
      setLoading(false);
      return;
    }

    // Check if all fields are filled
    if (
      !formData.name ||
      !formData.achievement_description ||
      !formData.achievement_type ||
      !formData.company_name ||
      !formData.date_of_achievement ||
      !formData.batch ||
      !formData.photo
    ) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get("jwt");

      if (!token) {
        toast.error("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("achievement_description", formData.achievement_description);
      formDataObj.append("achievement_type", formData.achievement_type);
      formDataObj.append("company_name", formData.company_name);
      formDataObj.append("date_of_achievement", formData.date_of_achievement);
      formDataObj.append("batch", formData.batch);
      formDataObj.append("photo", formData.photo);
      formDataObj.append("userId", userId);
      formDataObj.append("role", userRole);

      const response = await axios.post(
        "http://localhost:8000/api/upload_achievement/",
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message, {
        autoClose: 2000,
        onClose: () => {
          if (userRole === "admin") {
            navigate("/admin/home");
          } else if (userRole === "superadmin") {
            navigate("/superadmin-dashboard");
          }
        },
      });

      setFormData({
        name: "",
        achievement_description: "",
        achievement_type: "",
        company_name: "",
        date_of_achievement: "",
        batch: "",
        photo: null,
      });
      setImagePreview(null);
      setLoading(false);
    } catch (err) {
      console.error("Error submitting achievement:", err);
      toast.error(err.response?.data?.error || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <ToastContainer />
      {userRole === "admin" && <AdminPageNavbar className="fixed left-0 top-0 h-full" />}
      {userRole === "superadmin" && <SuperAdminPageNavbar className="fixed left-0 top-0 h-full" />}

      <div className="flex-1 p-6 max-w-6xl w-full mx-auto bg-white rounded-lg shadow-lg my-auto md:m-10 ml-64">
        {/* Adjusted margin-left to account for the fixed navbar */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-black">Post an Achievement</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
        <hr className="border border-gray-300 mb-4" />

        <form onSubmit={handleSubmit} className="space-y-6 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full space-y-2">
              <label className="block text-sm font-semibold text-black">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full mb-3 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
                placeholder="Enter the name here"
              />
            </div>

            <div className="w-full space-y-2">
              <label className="block text-sm font-semibold text-black">
                Company/Organization Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
                placeholder="Enter the company/organization name here"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full space-y-2">
              <label className="block text-sm font-semibold text-black">
                Achievement Type <span className="text-red-500">*</span>
              </label>
              <select
                name="achievement_type"
                value={formData.achievement_type}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 mb-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="">Select Achievement Type</option>
                <option value="Job Placement">Job Placement</option>
                <option value="Internship">Internship</option>
                <option value="Certification">Certification</option>
                <option value="Exam Cracked">Exam Cracked</option>
              </select>
            </div>

            <div className="w-full space-y-2">
              <label className="block text-sm font-semibold text-black">
                Date of Achievement <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date_of_achievement"
                value={formData.date_of_achievement}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="flex flex-col md:flex-col md:items-center">
              <div className="w-full space-y-2">
                <label className="block text-sm font-semibold text-black">
                  Batch <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400"
                  placeholder="Enter the batch here (e.g. 2020 - 2024)"
                />
              </div>

              <div className="border-dashed border-2 border-gray-400 rounded-xl pt-4 pb-2 px-2 text-center bg-white mt-4">
                <label
                  htmlFor="photo"
                  className="cursor-pointer text-blue-600 font-semibold text-xl hover:underline"
                >
                  {imagePreview ? "Change Image " : "Upload an Achievement Photo"}
                </label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/jpeg, image/png"
                  onChange={handleImageChange}
                  className="mt-2"
                  required
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Uploaded"
                      className="max-h-30 mx-auto rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="w-full flex flex-col space-y-2">
              <label className="block text-sm font-semibold text-black">
                Achievement Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="achievement_description"
                value={formData.achievement_description}
                onChange={handleChange}
                required
                className="w-full flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400 overflow-y-auto resize-none"
                rows="5"
                placeholder="Enter the achievement description here"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="w-full md:w-1/3 bg-yellow-500 text-black font-semibold py-3 rounded-lg hover:bg-yellow-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Post Achievement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
