import { FiBookmark, FiCircle, FiMapPin } from "react-icons/fi";
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

export default function ApplicationCard({ application }) {
    const navigate = useNavigate(); // Initialize useNavigate for navigation

    const handleCardClick = () => {
        if (application._id) {
            if (application.type === "internship") {
                navigate(`/internship-preview/${application._id}`);
            } else if (application.type === "job") {
                navigate(`/job-preview/${application._id}`);
            } else {
                console.error("Unknown application type:", application.type);
            }
        } else {
            console.error("ObjectId is missing in the application:", application);
        }
    };

    const handleApplyClick = (event) => {
        event.stopPropagation(); // Prevent triggering card click
        window.open(application.job_link, "_blank", "noopener noreferrer");
    };

    return (
        <div
            className="flex flex-col p-3 border border-gray-200 rounded-lg justify-between cursor-pointer"
            onClick={handleCardClick} // Attach card click handler
        >
            {/* Title Section */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <p className="text-2xl">{application.title}</p>
                    <div className="flex items-center space-x-3 text-sm">
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
                <FiBookmark className="text-2xl cursor-pointer mt-2" />
            </div>

            {/* Description Section */}
            <p className="w-[95%] text-xs my-4">
                {application.job_description}
            </p>

            {/* Skills Badges */}
            <div className="w-[85%] flex flex-wrap space-x-3">
                {typeof (application.skills_required ?? application.required_skills) === "string"
                    ? <p className="p-1 bg-gray-100 text-xs rounded px-2">{application.skills_required ?? application.required_skills}</p>
                    : (application.skills_required ?? application.required_skills).map((skill, key) => (
                        <p key={key} className="p-1 bg-gray-100 text-xs rounded px-2">{skill}</p>
                    ))}
            </div>

            {/* Time and Website Section */}
            <div className="flex text-[#8C8C8C] items-center space-x-2 mt-2">
                <p className="text-xs">{timeAgo(application.updated_at)}</p>
                <FiCircle style={{ width: "4px", height: "4px", backgroundColor: "#8C8C8C", borderRadius: "50%" }} />
                <p
                    className="underline text-xs truncate w-[65%] leading-none cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering card click
                        window.open(application.company_website, "_blank", "noopener noreferrer");
                    }}
                >
                    {application.company_website}
                </p>
            </div>

            {/* Apply Now Section */}
            <div className="flex justify-between items-center mt-5">
                <p className="text-[#FFC800] text-xl">{application.salary_range}/-</p>
                <button
                    className="bg-[#FFC800] p-2 rounded text-xs cursor-pointer"
                    onClick={handleApplyClick}
                >
                    Apply Now
                </button>
            </div>
        </div>
    );
}
