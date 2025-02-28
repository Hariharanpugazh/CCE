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

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { FiMail, FiPlus, FiMenu } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineWorkOutline } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { GoTrophy } from "react-icons/go";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { RiSettings3Line } from "react-icons/ri";
import { useLocation } from "react-router-dom";

// Assume these imports are correct for your project structure
import snslogo from "../../assets/images/SNS Group Logo 1.png";
import verifyIcon from "../../assets/icons/material-symbols_order-approve-outline-rounded.png";
import Managementverify from "../../assets/icons/Group.png";
import LogoutIcon from "../../assets/icons/material-symbols_logout-rounded.png";

export default function AdminSidebar() {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isCreateMenuOpen, setCreateMenuOpen] = useState(false);
  const [isMailPopupOpen, setMailPopupOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const location = useLocation();

  useEffect(() => {
    const user = Cookies.get("username");
    if (user) {
      setUsername(user);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("jwt");
    window.location.href = "/";
  };

  const userInitials = username ? username.charAt(0).toUpperCase() : "S";

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ href, children }) => (
    <a
      href={href}
      className={`flex items-center p-2 rounded ${
        isActive(href) ? "bg-yellow-200" : "hover:bg-yellow-200"
      }`}
    >
      {children}
    </a>
  );

  return (
    <div className="relative w-57 z-[9999]">
      <div className="fixed md:flex">
        <button
          onClick={() => setMenuOpen(!isMenuOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-full"
        >
          <FiMenu size={20} />
        </button>

        <div
          className={`bg-white shadow-lg h-screen md:relative w-57 fixed left-0 top-0 flex flex-col transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
        >
          <div className="p-4 border-b border-gray-400 flex items-center justify-center bg-[#ffc800]">
            <img
              src={snslogo || "/placeholder.svg"}
              alt="Logo"
              className="h-7 w-15 mr-2"
            />
            <h1 className="text-lg font-semibold">CCE</h1>
          </div>

          <h2 className="text-gray-500 font-medium mb-1 ml-4 mt-2">
            MAIN MENU
          </h2>

          <nav className="flex-1 overflow-y-auto">
            <ul className="p-2">
              <li className="mb-2">
                <NavLink href="/admin/home">
                  <RxDashboard className="mr-3" /> Dashboard
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink href="/jobs">
                  <MdOutlineWorkOutline className="mr-3" /> Jobs
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink href="/internships">
                  <PiStudent className="mr-3" /> Internships
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink href="/study-material">
                  <HiOutlineBookOpen className="mr-3" /> Study Material
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink href="/admin-achievements">
                  <GoTrophy className="mr-3" /> Achievements
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink href="/admin/mail">
                  <FiMail className="mr-3" /> Inbox
                </NavLink>
              </li>

              <li className="mb-2 relative">
                <button
                  onClick={() => {
                    setCreateMenuOpen(!isCreateMenuOpen);
                    setProfileMenuOpen(false);
                    setMailPopupOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-4 py-3 text-gray-400 font-medium border-t border-b border-gray-400"
                >
                  <span className="">CREATE</span>
                  <FiPlus className="text-gray-400" />
                </button>

                {isCreateMenuOpen && (
                  <ul className="absolute z-10 bg-white shadow-md border border-gray-200 w-full mt-1 rounded">
                    <li>
                      <a
                        href="/jobselection"
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        Job Post
                      </a>
                    </li>
                    <li>
                      <a
                        href="/internshipselection"
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        Internship
                      </a>
                    </li>
                    <li>
                      <a
                        href="/achievementpost"
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        Achievement Post
                      </a>
                    </li>
                    <li>
                      <a
                        href="/studymaterial-post"
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        Study Material Post
                      </a>
                    </li>
                  </ul>
                )}
              </li>

              <h2 className="text-gray-500 font-medium mb-4 ml-2">MANAGE</h2>

              <ul>
                <li className="mb-2">
                  <NavLink href="/manage-student">
                    <img
                      src={Managementverify || "/placeholder.svg"}
                      alt="Manage Post"
                      className="mr-2"
                    />
                    Student Management
                  </NavLink>
                </li>
                <li className="mb-2">
                  <NavLink href="/manage-jobs">
                    <img
                      src={verifyIcon || "/placeholder.svg"}
                      alt="Manage Post"
                      className="mr-2"
                    />
                    Manage Post
                  </NavLink>
                </li>
              </ul>
            </ul>
          </nav>
          <div className="p-4">
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center p-2 hover:bg-yellow-200 rounded w-full px-0"
              >
                <RiSettings3Line className="mr-2" /> Setting
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center px-0 py-2 hover:bg-yellow-200"
              >
                <img
                  src={LogoutIcon || "/placeholder.svg"}
                  alt="Logout"
                  className="mr-2"
                />
                Logout
              </button>
              <div className="border-t border-gray-400"></div>
              {isProfileMenuOpen && (
                <ul className="absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-lg w-full">
                  <li>
                    <a
                      href="/profile"
                      className="block px-4 py-2 hover:bg-yellow-200"
                    >
                      View Profile
                    </a>
                  </li>
                </ul>
              )}
            </div>
            <div className="flex items-center p-4 px-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-[#000000] text-lg font-semibold mr-3">
                {userInitials}
              </div>
              <div>
                <p className="font-semibold text-[#000000]">
                  {username || "Admin"}
                </p>
                <p className="text-sm text-[#000000]">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black opacity-50 lg:hidden z-30"
          ></div>
        )}
      </div>
    </div>
  );
}
