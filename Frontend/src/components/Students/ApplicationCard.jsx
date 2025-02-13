import { FiBookmark, FiCircle, FiMapPin, FiEye } from "react-icons/fi"; // Import FiEye for views icon
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

function timeAgo(dateString) {
    const givenDate = new Date(dateString);
    const now = new Date();

    // Calculate the time difference in seconds
    const secondsDiff = Math.floor((now - givenDate) / 1000);

    // Calculate years
    const years = Math.floor(secondsDiff / 31536000);
    if (years >= 1) {
        return years + (years === 1 ? " year ago" : " years ago");
    }

    // Calculate months (approximation, assumes 30 days per month)
    const months = Math.floor(secondsDiff / 2592000);
    if (months >= 1) {
        return months + (months === 1 ? " month ago" : " months ago");
    }

    // Calculate days
    const days = Math.floor(secondsDiff / 86400);
    if (days >= 1) {
        return days + (days === 1 ? " day ago" : " days ago");
    }

    // Calculate hours
    const hours = Math.floor(secondsDiff / 3600);
    if (hours >= 1) {
        return hours + (hours === 1 ? " hour ago" : " hours ago");
    }

    // Calculate minutes
    const minutes = Math.floor(secondsDiff / 60);
    if (minutes >= 1) {
        return minutes + (minutes === 1 ? " minute ago" : " minutes ago");
    }

    return "Just now";
}

export default function ApplicationCard({ application, handleCardClick, isSaved }) {
    const handleApplyClick = (event) => {
        event.stopPropagation(); // Prevent triggering card click
        window.open(application.job_link, "_blank", "noopener noreferrer");
    };

    return (
        <div
            className="flex flex-col p-3 border border-gray-200 rounded-lg justify-between  hover:scale-[1.03]"
            onClick={handleCardClick} // Attach card click handler
        >
            {/* Title Section */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <p className="text-xl">{application.title}</p>
                    <div className="flex items-center space-x-3 text-sm flex-wrap text-xs mt-1">
                        <p className="text-[#8C8C8C] flex items-center">
                            <i className="bi bi-building w-[15px] mr-[5px]"></i> {application.company_name}
                        </p>
                        <FiCircle style={{ width: "4px", height: "4px", backgroundColor: "#8C8C8C", borderRadius: "50%" }} />
                        <p className="text-[#8C8C8C] flex items-center">
                            <FiMapPin style={{ width: "15px", marginRight: "5px" }} /> {application.job_location}
                        </p>
                    </div>
                </div>

                {/* Save Icon */}
                {isSaved !== undefined && <FiBookmark className={`text-2xl cursor-pointer ${isSaved ? "text-blue-500 fill-current" : ""}`} />}
            </div>

            {/* Description Section */}
            <p className="w-[95%] text-xs my-4">
                {application.job_description}
            </p>

            {/* Tags Section */}
            <div className="flex flex-wrap gap-2 text-xs mt-2">
                {application.selectedWorkType && (
                    <span className="bg-gray-200 px-2 py-1 rounded-full">{application.selectedWorkType}</span>
                )}
                {application.work_type && (
                    <span className="bg-gray-200 px-2 py-1 rounded-full">{application.work_type}</span>
                )}
                {application.experience_level && (
                    <span className="bg-gray-200 px-2 py-1 rounded-full">{application.experience_level}</span>
                )}
            </div>

            {/* Meta Info Section */}
            <div className="flex items-center text-gray-500 text-xs mt-3 space-x-2">
                <span>{timeAgo(application.updated_at)}</span>
                <span>|</span>
                <span className="flex items-center">
                    <FiEye className="mr-1" /> {application.views ?? 0} views
                </span>
            </div>

      {/* Footer Section */}
      <div className="flex justify-between items-center mt-4">
        <span
          className={`text-sm font-bold transition-all duration-300 
            ${application.status === "active" ? "text-green-500" : "text-red-500"}`}
        >
          {application.status === "active" ? "ON GOING" : "EXPIRED"}
        </span>

        <button
          className="bg-yellow-400 text-black px-4 py-2 rounded font-medium text-sm hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105"
          onClick={handleApplyClick}
        >
          View Details
        </button>
            </div>
        </div>
    );
}