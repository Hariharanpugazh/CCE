// import { useState, useEffect } from "react";
// import Cookies from "js-cookie"; // Import js-cookie
// import { AppPages } from "../../utils/constants";
// import { FiMail, FiPlus, FiUser, FiSettings } from "react-icons/fi";
// import { IoMdNotifications } from "react-icons/io";
// import { MdInbox, MdWork } from "react-icons/md"; // Icons for pop-up box

// export default function SuperAdminPageNavbar() {
//   const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
//   const [isCreateMenuOpen, setCreateMenuOpen] = useState(false);
//   const [isMailPopupOpen, setMailPopupOpen] = useState(false);
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

//   const handleStudyMaterialClick = (event) => {
//     event.preventDefault();
//     alert("Coming Soon!");
//   };
//   const userInitials = username ? username.charAt(0).toUpperCase() : "S";


//   return (
//     <div className="sticky top-0 bg-white shadow z-10 rounded-b-lg mx-3">
//       <nav className="flex justify-between p-2 items-stretch pt-4 relative">
//         {/* Logo */}
//         <div className="flex items-center">
//         <img
//             src="/sns (1).ico"
//             alt="Logo"
//             className="ml-1 pl-3 h-14 w-17"
//           />
//         </div>
//         <span className="flex-1 max-w-[20%]"></span>

//         <div className="flex flex-1 justify-evenly space-x-5 items-center text-lg">
//           <p
//             className="cursor-pointer hover:underline hover:text-blue-400"
//             onClick={() => (window.location.href = "/superadmin-dashboard")}
//           >
//             Home
//           </p>
//           <p
//             className="cursor-pointer hover:underline hover:text-blue-400"
//             onClick={() => (window.location.href = "/jobs")}
//           >
//             Jobs
//           </p>
//           <p
//             className="cursor-pointer hover:underline hover:text-blue-400"
//             onClick={() => (window.location.href = "/internships")}
//           >
//             Internships
//           </p>
//           {/* <p className="cursor-pointer hover:underline hover:text-blue-400" onClick={handleStudyMaterialClick}>Study Material</p> */}
//           <p
//             className="cursor-pointer hover:underline hover:text-blue-400"
//             onClick={() => (window.location.href = "/superadmin/achievements")}
//           >
//             Achievements
//           </p>
//           {/* <p className="cursor-pointer hover:underline hover:text-blue-400">Contact</p> */}
//         </div>

//         <div className="flex flex-1 max-w-[25%] justify-end items-center text-sm space-x-4">
//           <div
//             className="flex space-x-2 items-center relative cursor-pointer"
//             onClick={() => {
//               setCreateMenuOpen((toggle) => !toggle);
//               setProfileMenuOpen(false);
//               setMailPopupOpen(false);
//             }}
//           >
//             <p>Create New</p>
//             <FiPlus
//               className="text-2xl text-gray-700 cursor-pointer hover:text-blue-500 hover:cursor-pointer"
//               style={{ width: "2rem" }}
//               title="Create"
//             />

//             {/* Create Menu */}
//             {isCreateMenuOpen && (
//               <div className="top-[100%] right-0 mt-2 bg-white shadow-lg rounded-lg w-40 z-50 absolute p-2">
//                 <ul className="flex flex-col">
//                   <li
//                     className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                     onClick={() => (window.location.href = "/internpost")}
//                   >
//                     Internship
//                   </li>
//                   <li
//                     className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                     onClick={() => (window.location.href = "/jobpost")}
//                   >
//                     Job Post
//                   </li>
//                   <li
//                     className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                     onClick={() => (window.location.href = "/studymaterial-post")}
//                   >
//                     Study Material Post
//                   </li>
//                   <li
//                     className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                     onClick={() => (window.location.href = "/achievementpost")}
//                   >
//                     Achievement Post
//                   </li>
//                   <li
//                     className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                     onClick={() => (window.location.href = "/Admin-Management")}
//                   >
//                     Admin Management
//                   </li>
//                   <li
//                     className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                     onClick={() => (window.location.href = "/manage-student")}
//                   >
//                     Student Management
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>

//           <div
//             className="flex space-x-2 items-center cursor-pointer relative"
//             onClick={() => setProfileMenuOpen((toggle) => !toggle)}
//           >
//             <p>{username || "SuperAdmin"}</p>
//             <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-700 text-lg font-semibold">
//               {userInitials}
//             </div>

//             {/* Profile Menu */}
//             {isProfileMenuOpen && (
//               <div className="top-[100%] right-0 mt-2 bg-white shadow-lg rounded-lg w-40 z-50 absolute p-2">
//                 <ul className="flex flex-col">
//                   <li
//                     className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                     onClick={() => (window.location.href = "/profile")}
//                   >
//                     Profile
//                   </li>
//                   <li
//                     className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                     onClick={handleLogout}
//                   >
//                     Logout
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>

//           {/* Mail Button */}
//           <div
//             className="flex space-x-2 items-center cursor-pointer relative"
//             onClick={() => {
//               setMailPopupOpen((toggle) => !toggle);
//               setProfileMenuOpen(false);
//               setCreateMenuOpen(false);
//             }}
//           >
//             <IoMdNotifications
//               className="text-2xl text-gray-700 cursor-pointer hover:text-blue-500 hover:cursor-pointer"
//               style={{ width: "2rem" }}
//               title="Options"
//             />

//             {/* Mail Popup */}
//             {isMailPopupOpen && (
//               <div className="top-[100%] right-0 mt-2 bg-white shadow-lg rounded-lg w-60 z-50 absolute p-2">
//                 <ul className="flex flex-col">
//                   <li
//                     className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
//                     onClick={() => (window.location.href = "/contact-inbox")}
//                   >
//                     <FiMail className="text-xl mr-2" /> Inbox
//                   </li>
//                   <li
//                     className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
//                     onClick={() => (window.location.href = "/superadmin-manage-jobs")}
//                   >
//                     <MdWork className="text-xl mr-2" /> Manage Jobs
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// }


"use client"

import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { FiMail, FiPlus, FiUser, FiHome, FiBriefcase, FiAward } from "react-icons/fi"
import { IoMdNotifications } from "react-icons/io"
import { MdWork } from "react-icons/md"

export default function SuperAdminSidebar() {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false)
  const [isCreateMenuOpen, setCreateMenuOpen] = useState(false)
  const [isMailPopupOpen, setMailPopupOpen] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() => {
    // Retrieve the username from cookies when the component mounts
    const user = Cookies.get("username")
    if (user) {
      setUsername(user)
    }
  }, [])

  const handleLogout = () => {
    // Clear the JWT cookie
    Cookies.remove("jwt")

    // Redirect to the login page
    window.location.href = "/"
  }

  const handleStudyMaterialClick = (event) => {
    event.preventDefault()
    alert("Coming Soon!")
  }

  const userInitials = username ? username.charAt(0).toUpperCase() : "S"

  return (
    <div className="bg-white shadow-lg h-screen w-57 fixed left-0 top-0 flex flex-col">
      <div className="p-4 border-b">
        <img src="/sns (1).ico" alt="Logo" className="h-14 w-17 mx-auto" />
      </div>

      <div className="flex items-center p-4 border-b">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-700 text-lg font-semibold mr-3">
          {userInitials}
        </div>
        <div>
          <p className="font-semibold">{username || "SuperAdmin"}</p>
          <p className="text-sm text-gray-500">Super Administrator</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="p-2">
          <li className="mb-2">
            <a href="/superadmin-dashboard" className="flex items-center p-2 hover:bg-gray-100 rounded">
              <FiHome className="mr-3" /> Home
            </a>
          </li>
          <li className="mb-2">
            <a href="/jobs" className="flex items-center p-2 hover:bg-gray-100 rounded">
              <FiBriefcase className="mr-3" /> Jobs
            </a>
          </li>
          <li className="mb-2">
            <a href="/internships" className="flex items-center p-2 hover:bg-gray-100 rounded">
              <FiBriefcase className="mr-3" /> Internships
            </a>
          </li>
          <li className="mb-2">
            <a href="/superadmin/achievements" className="flex items-center p-2 hover:bg-gray-100 rounded">
              <FiAward className="mr-3" /> Achievements
            </a>
          </li>
          <li className="mb-2 relative">
            <button
              onClick={() => {
                setCreateMenuOpen(!isCreateMenuOpen)
                setProfileMenuOpen(false)
                setMailPopupOpen(false)
              }}
              className="flex items-center p-2 hover:bg-gray-100 rounded w-full text-left"
            >
              <FiPlus className="mr-3" /> Create New
            </button>
            {isCreateMenuOpen && (
              <ul className="ml-6 mt-2">
                <li>
                  <a href="/internpost" className="block p-2 hover:bg-gray-100 rounded">
                    Internship
                  </a>
                </li>
                <li>
                  <a href="/jobpost" className="block p-2 hover:bg-gray-100 rounded">
                    Job Post
                  </a>
                </li>
                <li>
                  <a href="/studymaterial-post" className="block p-2 hover:bg-gray-100 rounded">
                    Study Material Post
                  </a>
                </li>
                <li>
                  <a href="/achievementpost" className="block p-2 hover:bg-gray-100 rounded">
                    Achievement Post
                  </a>
                </li>
                <li>
                  <a href="/Admin-Management" className="block p-2 hover:bg-gray-100 rounded">
                    Admin Management
                  </a>
                </li>
                <li>
                  <a href="/manage-student" className="block p-2 hover:bg-gray-100 rounded">
                    Student Management
                  </a>
                </li>
              </ul>
            )}
          </li>
          <li className="mb-2 relative">
            <button
              onClick={() => {
                setMailPopupOpen(!isMailPopupOpen)
                setProfileMenuOpen(false)
                setCreateMenuOpen(false)
              }}
              className="flex items-center p-2 hover:bg-gray-100 rounded w-full text-left"
            >
              <IoMdNotifications className="mr-3" /> Notifications
            </button>
            {isMailPopupOpen && (
              <ul className="ml-6 mt-2">
                <li>
                  <a href="/contact-inbox" className="flex items-center p-2 hover:bg-gray-100 rounded">
                    <FiMail className="mr-2" /> Inbox
                  </a>
                </li>
                <li>
                  <a href="/superadmin-manage-jobs" className="flex items-center p-2 hover:bg-gray-100 rounded">
                    <MdWork className="mr-2" /> Manage Jobs
                  </a>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t">
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center p-2 hover:bg-gray-100 rounded w-full"
          >
            <FiUser className="mr-3" /> Profile
          </button>
          {isProfileMenuOpen && (
            <ul className="absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-lg w-full">
              <li>
                <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  View Profile
                </a>
              </li>
              <li>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

