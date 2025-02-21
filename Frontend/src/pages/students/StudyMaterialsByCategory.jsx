import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";

const StudyMaterialsByCategory = () => {
    const { category } = useParams();
    const [studyMaterials, setStudyMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = Cookies.get("jwt");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserRole(payload.role);

            // Fetch study materials from backend based on selected category
            axios.get(`http://localhost:8000/api/study-materials-by-category/?category=${category}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                setStudyMaterials(response.data.study_materials);
            }).catch((err) => {
                setError("Failed to fetch study materials.");
                console.error("Failed to fetch study materials:", err);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [category]);

    return (
        <div className="flex flex-col items-center min-h-screen">
            {userRole === "admin" && <AdminPageNavbar />}
            {userRole === "superadmin" && <SuperAdminPageNavbar />}
            {userRole === "student" && <StudentPageNavbar />}

            <div className="w-full max-w-screen-lg mt-6 p-4">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Study Materials for {category}</h1>
                {loading && <p className="text-center text-gray-600">Loading study materials...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {studyMaterials.map((material) => (
                        <div key={material._id} className="border rounded-lg shadow-lg p-6 bg-white text-center">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">{material.title}</h2>
                            <p className="text-gray-600 mb-4">{material.description}</p>
                            {material.links.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline font-semibold block mb-2"
                                >
                                    {link.type} Link: {link.link}
                                </a>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudyMaterialsByCategory;
