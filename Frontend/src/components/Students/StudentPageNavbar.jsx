import { useState } from "react";
import Cookies from "js-cookie"; // Import js-cookie
import { AppPages } from "../../utils/constants";
import { FiUser } from "react-icons/fi";

export default function StudentPageNavbar() {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Clear the JWT cookie
    Cookies.remove("jwt");

    // Redirect to the login page
    window.location.href = "/";
  };

  return (
    <nav className="flex justify-between p-4 items-stretch pt-8 relative">
      <span className="flex-1 max-w-[25%]"></span>

      <div className="flex flex-1 justify-evenly space-x-5 items-center text-lg">
        <p
          className="cursor-pointer hover:underline hover:text-blue-400"
          onClick={() => (window.location.href = "/home")}
        >
          Home
        </p>
        <p
          className="cursor-pointer hover:underline hover:text-blue-400"
          onClick={() => (window.location.href = AppPages.jobDashboard.route)}
        >
          Jobs
        </p>
        <p
          className="cursor-pointer hover:underline hover:text-blue-400"
          onClick={() => (window.location.href = AppPages.internShipDashboard.route)}
        >
          Internships
        </p>
        <p className="cursor-pointer hover:underline hover:text-blue-400">
          Study Material
        </p>
        <p className="cursor-pointer hover:underline hover:text-blue-400"
          onClick={() => (window.location.href = "/achievements")}>
          Achievements
        </p>
        <p className="cursor-pointer hover:underline hover:text-blue-400"
          onClick={() => (window.location.href = "/contact")}>
          Contact
        </p>
      </div>

      <div className="flex flex-1 max-w-[25%] justify-end items-center text-sm relative">
        <div className="flex space-x-2 items-center cursor-pointer relative" onClick={() => setProfileMenuOpen(toggle => !toggle)}>
          <p>Profile</p>
          <FiUser className="text-2xl bi bi-person-circle text-theme-yellow cursor-pointer hover:cursor-pointer" style={{ width: "2rem" }} />

          {/* Profile Menu */}
          {isProfileMenuOpen && (
            <div className="top-[100%] right-0 mt-2 bg-white shadow-lg rounded-lg w-40 z-50 absolute p-2">
              <ul className="flex flex-col">
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/profile")}
                >
                  Profile
                </li>
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/studentachievement")}
                >
                  Post Achievement
                </li>
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => (window.location.href = "/saved-jobs")}
                >
                  Saved Jobs
                </li>
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
