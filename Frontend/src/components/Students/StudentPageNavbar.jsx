import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { FiUser, FiMail } from "react-icons/fi";
import { IoMdNotifications } from "react-icons/io";
import { MdWork, MdOutlinePostAdd } from "react-icons/md";
import { IoBookmarksSharp } from "react-icons/io5";
import { AppPages } from "../../utils/constants";

export default function StudentPageNavbar() {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMailPopupOpen, setMailPopupOpen] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = Cookies.get("username");
    if (user) {
      setUsername(user);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("jwt");
    localStorage.clear();
    window.location.href = "/";
  };

  const handleStudyMaterialClick = (event) => {
    event.preventDefault();
    alert("Coming Soon!");
  };

  const userInitials = username ? username.charAt(0).toUpperCase() : "A";

  return (
    <div className="sticky top-0 bg-white shadow z-10 w-full">
      <nav className="flex justify-between p-4 items-center">
        <div className="flex flex-1 justify-evenly space-x-5 items-center text-lg">
          <p className="cursor-pointer hover:underline hover:text-blue-400" onClick={() => (window.location.href = "/home")}>
            Home
          </p>
          <p className="cursor-pointer hover:underline hover:text-blue-400" onClick={() => (window.location.href = AppPages.jobDashboard.route)}>
            Jobs
          </p>
          <p className="cursor-pointer hover:underline hover:text-blue-400" onClick={() => (window.location.href = AppPages.internShipDashboard.route)}>
            Internships
          </p>
          <p className="cursor-pointer hover:underline hover:text-blue-400" onClick={handleStudyMaterialClick}>Study Material</p>
          <p className="cursor-pointer hover:underline hover:text-blue-400" onClick={() => (window.location.href = "/achievements")}>
            Achievements
          </p>
          <p className="cursor-pointer hover:underline hover:text-blue-400" onClick={() => (window.location.href = "/contact")}>
            Contact
          </p>
        </div>
        <div className="flex items-center space-x-4 relative">
          <div className="flex space-x-2 items-center cursor-pointer relative" onClick={() => {
            setMailPopupOpen(toggle => !toggle);
            setProfileMenuOpen(false);
          }}>
            <IoMdNotifications className="text-2xl text-gray-700 cursor-pointer hover:text-blue-500" title="Options" />
            {isMailPopupOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg w-60 z-50 p-2">
                <ul className="flex flex-col">
                  <li className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => (window.location.href = "/student/mail")}>
                    <FiMail className="text-xl mr-2" /> Inbox
                  </li>
                  <li className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => (window.location.href = "/studentachievement")}>
                    <MdOutlinePostAdd className="text-xl mr-2" />  Post Achievement
                  </li>
                  <li className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => (window.location.href = "/saved-jobs")}>
                    <IoBookmarksSharp className="text-xl mr-2" /> Saved Items
                  </li>
                  <li className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => (window.location.href = "/applied-jobs")}>
                    <MdWork className="text-xl mr-2" /> Applied Jobs
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="flex space-x-2 items-center cursor-pointer relative" onClick={() => {
            setProfileMenuOpen(toggle => !toggle);
            setMailPopupOpen(false);
          }}>
            <p>{username || "Profile"}</p>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-700 text-lg font-semibold">
              {userInitials}
            </div>
            {isProfileMenuOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg w-40 z-50 p-2">
                <ul className="flex flex-col">
                  <li className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => (window.location.href = "/profile")}>
                    Profile
                  </li>
                  <li className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={handleLogout}>
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
