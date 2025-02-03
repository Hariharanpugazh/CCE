import { AppPages } from "../../utils/constants";

export default function StudentPageNavbar() {
  return <nav className="flex justify-between p-4 items-stretch pt-8">
    <span className="flex-1 max-w-[25%]"></span>

    <div className="flex flex-1 justify-evenly space-x-5 items-center">
      <p
        className="cursor-pointer hover:underline hover:text-blue-400"
        onClick={() => (window.location.href = AppPages.jobDashboard.route)}
      >
        Home
      </p>
      <p
        className="cursor-pointer hover:underline hover:text-blue-400"
        onClick={() => (window.location.href = AppPages.internShipDashboard.route)}
      >
        Opportunities
      </p>
      <p className="cursor-pointer hover:underline hover:text-blue-400">
        Study Material
      </p>
      <p className="cursor-pointer hover:underline hover:text-blue-400">
        Achievements
      </p>
      <p className="cursor-pointer hover:underline hover:text-blue-400">
        Contact
      </p>
    </div>

    <div className="flex flex-1 max-w-[25%] justify-end items-center text-sm">
      <p>My Profile</p>
      <i className="ml-2 text-2xl bi bi-person-circle text-theme-yellow"></i>
    </div>
  </nav>
}
