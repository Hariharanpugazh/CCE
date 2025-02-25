// import { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import { IoMdNotifications } from "react-icons/io";
// import { FiMail } from "react-icons/fi";
// import { MdOutlinePostAdd, MdWork } from "react-icons/md";
// import { IoBookmarksSharp } from "react-icons/io5";
// import { AppPages } from "../../utils/constants";

// export default function StudentPageNavbar({ currentPage, transparent, tag }) {
//   const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
//   const [isMailPopupOpen, setMailPopupOpen] = useState(false);
//   const [username, setUsername] = useState("");
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     const user = Cookies.get("username");
//     if (user) {
//       setUsername(user);
//     }

//     if (transparent) {
//       const handleScroll = () => {
//         const heroSection = document.getElementById("hero");
//         if (heroSection) {
//           const heroBottom = heroSection.offsetHeight;
//           setIsScrolled(window.scrollY > heroBottom);
//         }
//       };

//       window.addEventListener("scroll", handleScroll);
//       return () => window.removeEventListener("scroll", handleScroll);
//     }
//   }, [transparent]);

//   const handleLogout = () => {
//     Cookies.remove("jwt");
//     localStorage.clear();
//     window.location.href = "/";
//   };

//   const handleStudyMaterialClick = (event) => {
//     event.preventDefault();
//     alert("Coming Soon!");
//   };

//   const userInitials = username ? username.charAt(0).toUpperCase() : "A";

//   // Conditional class for Jobs and Internships pages
//   const navbarClasses = currentPage === "jobs" || currentPage === "internships" ? "custom-navbar-class" : "";

//   return (
//     <div className={`w-screen top-0
//       ${transparent ? (isScrolled ? "fixed bg-white shadow rounded-b-lg" : "fixed glass-lg") : "sticky bg-white shadow rounded-b-lg"}
//       z-10 ${navbarClasses} transition-all duration-300`}>
//       <nav className="flex justify-between p-4 items-stretch relative">
//         <span className="flex-1 max-w-[25%]"></span>

//         <div className="flex flex-1 justify-evenly space-x-5 items-center text-lg">
//           <p className="cursor-pointer hover:underline hover:text-blue-400" onClick={() => (window.location.href = "/home")}>
//             Home
//           </p>
//           <p className="cursor-pointer hover:underline hover:text-blue-400" onClick={() => (window.location.href = AppPages.jobDashboard.route)}>
//             Jobs
//           </p>
//           <p className="cursor-pointer hover:underline hover:text-blue-400" onClick={() => (window.location.href = AppPages.internShipDashboard.route)}>
//             Internships
//           </p>
//           <p className="cursor-pointer hover:underline hover:text-blue-400" onClick={handleStudyMaterialClick}>Study Material</p>
//           <p className="cursor-pointer hover:underline hover:text-blue-400" onClick={() => (window.location.href = "/achievements")}>
//             Achievements
//           </p>
//           <p className="cursor-pointer hover:underline hover:text-blue-400" onClick={() => (window.location.href = "/contact")}>
//             Contact
//           </p>
//         </div>

//         <div className="flex flex-1 max-w-[25%] justify-end items-center text-sm relative space-x-4">
//           <div className="flex space-x-2 items-center cursor-pointer relative" onClick={() => {
//             setMailPopupOpen(toggle => !toggle);
//             setProfileMenuOpen(false);
//           }}>
//             <IoMdNotifications className="text-2xl text-gray-700 cursor-pointer hover:text-blue-500" style={{ width: "2rem" }} title="Options" />
//             {isMailPopupOpen && (
//               <div className="top-[100%] right-0 mt-2 bg-white shadow-lg rounded-lg w-60 z-50 absolute p-2">
//                 <ul className="flex flex-col">
//                   <li className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => (window.location.href = "/student/mail")}>
//                     <FiMail className="text-xl mr-2" /> Inbox
//                   </li>
//                   <li className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => (window.location.href = "/studentachievement")}>
//                     <MdOutlinePostAdd className="text-xl mr-2" /> Post Achievement
//                   </li>
//                   <li className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => (window.location.href = "/saved-jobs")}>
//                     <IoBookmarksSharp className="text-xl mr-2" /> Saved Items
//                   </li>
//                   <li className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => (window.location.href = "/applied-jobs")}>
//                     <MdWork className="text-xl mr-2" /> Applied Jobs
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>

//           <div className="flex space-x-2 pr-2 items-center cursor-pointer relative" onClick={() => {
//             setProfileMenuOpen(toggle => !toggle);
//             setMailPopupOpen(false);
//           }}>
//             <p>{username || "Profile"}</p>
//             <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-700 text-lg font-semibold">
//               {userInitials}
//             </div>
//             {isProfileMenuOpen && (
//               <div className="top-[100%] right-0 mt-2 bg-white shadow-lg rounded-lg w-40 z-50 absolute p-2">
//                 <ul className="flex flex-col">
//                   <li className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => (window.location.href = "/profile")}>
//                     Profile
//                   </li>
//                   <li className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={handleLogout}>
//                     Logout
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


import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { IoMdNotifications } from "react-icons/io";
import { FiMail } from "react-icons/fi";
import { MdOutlinePostAdd, MdWork } from "react-icons/md";
import { IoBookmarksSharp } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { AppPages } from "../../utils/constants";
import LOGOSNS from "../../assets/images/snslogo.png";
import LogoutIcon from "../../assets/icons/material-symbols_logout-rounded.png";

export default function StudentPageNavbar({ currentPage, transparent, tag }) {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMailPopupOpen, setMailPopupOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // State to manage dropdown

  useEffect(() => {
    const user = Cookies.get("username");
    if (user) {
      setUsername(user);
    }

    if (transparent) {
      const handleScroll = () => {
        const heroSection = document.getElementById("hero");
        if (heroSection) {
          const heroBottom = heroSection.offsetHeight;
          setIsScrolled(window.scrollY > heroBottom);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [transparent]);

  const handleLogout = () => {
    Cookies.remove("jwt");
    localStorage.clear();
    window.location.href = "/";
  };

  const toggleDropdown = (itemLabel) => {
    if (openDropdown === itemLabel) {
      setOpenDropdown(null); // Close the dropdown if it's already open
    } else {
      setOpenDropdown(itemLabel); // Open the dropdown
    }
  };

  const userInitials = username ? username.charAt(0).toUpperCase() : "A";
  const navbarClasses =
    currentPage === "jobs" || currentPage === "internships"
      ? "custom-navbar-class"
      : "";

  const menuItems = [
    { label: "Home", href: "/home" },
    {
      label: "Opportunities",
      subItems: [
        { label: "Jobs", href: AppPages.jobDashboard.route },
        { label: "Internships", href: AppPages.internShipDashboard.route },
      ],
    },
    { label: "Study Material", href: "/study-material" },
    { label: "Achievements", href: "/achievements" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div
      className={`w-screen top-0
  ${
    transparent
      ? isScrolled
        ? "fixed bg-white shadow-md"
        : "fixed bg-[#ffc800] md:bg-transparent glass-lg"
      : "sticky shadow-md"
  }
  z-10 ${navbarClasses} transition-all duration-300`}
    >
      <nav className="flex justify-between items-center p-2 md:p-4 relative max-w-[1920px] mx-auto">
        {/* Mobile Menu Button - Left */}
        <button
          className="md:hidden text-2xl p-2 text-black"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <IoMdClose /> : <RxHamburgerMenu />}
        </button>

        {/* Logo - Center on mobile, left on desktop */}
        <div className="absolute left-1/2 -translate-x-1/2 md:static md:transform-none md:flex md:flex-1">
          <div className="flex items-center justify-center md:justify-start">
            <img
              src={LOGOSNS}
              alt="SNS"
              className="h-12 w-auto object-contain md:h-12 md:ml-0"
            />
          </div>
        </div>

        <div className="flex justify-center w-full">
          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-center space-x-10 items-center text-lg ml-10">
            {menuItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.href ? (
                  <p
                    className="cursor-pointer hover:underline text-black"
                    onClick={() => (window.location.href = item.href)}
                  >
                    {item.label}
                  </p>
                ) : item.onClick ? (
                  <p
                    className="cursor-pointer hover:underline text-black"
                    onClick={item.onClick}
                  >
                    {item.label}
                  </p>
                ) : (
                  <p className="cursor-pointer hover:underline text-black">
                    {item.label}
                  </p>
                )}
                {item.subItems && (
                  <div className="hidden group-hover:block absolute top-full left-0 bg-white shadow-lg rounded-lg w-48 z-50">
                    {item.subItems.map((subItem) => (
                      <p
                        key={subItem.label}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => (window.location.href = subItem.href)}
                      >
                        {subItem.label}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Profile Icon - Right side */}
        <div className="md:flex flex-none items-center">
          <div className="flex items-center space-x-2">
            <div className="md:flex hidden">
              <IoMdNotifications
                className="text-2xl text-black cursor-pointer hover:text-gray-700 mr-4"
                onClick={() => {
                  setMailPopupOpen(!isMailPopupOpen);
                  setProfileMenuOpen(false);
                }}
              />
            </div>
            <div
              className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center cursor-pointer mr-5"
              onClick={() => {
                setProfileMenuOpen(!isProfileMenuOpen);
                setMailPopupOpen(false);
              }}
            >
              {userInitials}
            </div>
          </div>

          {/* Notifications Popup */}
          {isMailPopupOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg w-60 z-50">
              <ul className="flex flex-col">
                <li
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/student/mail")}
                >
                  <FiMail className="text-xl mr-2" /> Inbox
                </li>
                <li
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/studentachievement")}
                >
                  <MdOutlinePostAdd className="text-xl mr-2" /> Post Achievement
                </li>
                <li
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/saved-jobs")}
                >
                  <IoBookmarksSharp className="text-xl mr-2" /> Saved Items
                </li>
                <li
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/applied-jobs")}
                >
                  <MdWork className="text-xl mr-2" /> Applied Jobs
                </li>
              </ul>
            </div>
          )}

          {/* Profile Menu */}
          {isProfileMenuOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg w-40 z-50">
              <ul className="flex flex-col">
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/profile")}
                >
                  Profile
                </li>
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-red-500"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-50 md:hidden">
            <div className="flex flex-col">
              {menuItems.map((item) => (
                <div key={item.label} className="border-b border-gray-300">
                  {item.href ? (
                    <p
                      className="px-6 py-4 hover:bg-gray-50"
                      onClick={() => {
                        window.location.href = item.href;
                        setMobileMenuOpen(false);
                      }}
                    >
                      {item.label}
                    </p>
                  ) : item.onClick ? (
                    <p
                      className="px-6 py-4 hover:bg-gray-50"
                      onClick={(event) => {
                        item.onClick(event);
                        setMobileMenuOpen(false);
                      }}
                    >
                      {item.label}
                    </p>
                  ) : (
                    <div>
                      <p
                        className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleDropdown(item.label)}
                      >
                        {item.label}
                        <svg
                          className={`w-4 h-4 ml-2 ${
                            openDropdown === item.label
                              ? "transform rotate-180"
                              : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </p>
                      {openDropdown === item.label && (
                        <div className="bg-gray-50">
                          {item.subItems.map((subItem) => (
                            <p
                              key={subItem.label}
                              className="px-8 py-3 hover:bg-gray-100"
                              onClick={() => {
                                window.location.href = subItem.href;
                                setMobileMenuOpen(false);
                              }}
                            >
                              {subItem.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div className="border-b border-gray-300">
                <p
                  className="px-6 py-4 hover:bg-gray-50"
                  onClick={() => (window.location.href = "/profile")}
                >
                  My Profile
                </p>
              </div>
              <div>
                <p
                  className="px-6 py-4 text-red-500 hover:bg-gray-50 flex items-center"
                  onClick={handleLogout}
                >
                  <img
                    src={LogoutIcon}
                    alt="Logout Icon"
                    className="mr-2 h-4 w-4"
                  />
                  Log out
                </p>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
