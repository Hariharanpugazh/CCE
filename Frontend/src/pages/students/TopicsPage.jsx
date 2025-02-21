import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";

const TopicsPage = () => {
    const { category } = useParams();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("jwt");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserRole(payload.role);

            // Fetch topics from backend based on selected category
            axios.get(`http://localhost:8000/api/topics-by-category/?category=${category}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                setTopics(response.data.topics);
            }).catch((err) => {
                setError("Failed to fetch topics.");
                console.error("Failed to fetch topics:", err);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [category]);

    const handleTopicClick = (topic) => {
        navigate(`/materials/${encodeURIComponent(topic)}`);
    };

    return (
        <div className="flex flex-col min-h-screen">
            {userRole === "admin" && <AdminPageNavbar />}
            {userRole === "superadmin" && <SuperAdminPageNavbar />}
            {userRole === "student" && <StudentPageNavbar />}

            <div className="w-full max-w-screen-lg mt-6 p-4 self-center">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Topics in {category}</h1>
                {loading && <p className="text-center text-gray-600">Loading topics...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {topics.map((topic, index) => (
                        <div
                            key={index}
                            className="border rounded-lg shadow-lg p-6 bg-white text-center cursor-pointer hover:shadow-xl transition-transform transform hover:scale-105"
                            onClick={() => handleTopicClick(topic)}
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">{topic}</h2>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopicsPage;
