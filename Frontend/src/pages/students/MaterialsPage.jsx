import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";

const MaterialsPage = () => {
    const { topic } = useParams();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = Cookies.get("jwt");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserRole(payload.role);

            // Fetch materials from backend based on selected topic
            axios.get(`http://localhost:8000/api/materials-by-topic/?topic=${topic}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                setMaterials(response.data.materials);
            }).catch((err) => {
                setError("Failed to fetch materials.");
                console.error("Failed to fetch materials:", err);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [topic]);

    return (
        <div className="flex flex-col min-h-screen">
            {userRole === "admin" && <AdminPageNavbar />}
            {userRole === "superadmin" && <SuperAdminPageNavbar />}
            {userRole === "student" && <StudentPageNavbar />}

            <div className="w-full max-w-screen-lg mt-6 p-4 self-center">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Materials for {topic}</h1>
                {loading && <p className="text-center text-gray-600">Loading materials...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {materials.map((material, index) => (
                        <div key={index} className="border rounded-lg shadow-lg p-6 bg-white text-center">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">{material.title}</h2>
                            <p className="text-gray-600 mb-4">{material.description}</p>
                            {material.links.map((link, idx) => (
                                <div key={idx} className="mb-2">
                                    <p className="font-semibold">{link.topic}</p>
                                    <a
                                        href={link.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        {link.link}
                                    </a>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MaterialsPage;
