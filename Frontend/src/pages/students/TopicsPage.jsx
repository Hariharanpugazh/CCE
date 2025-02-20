import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";

const TopicsPage = () => {
    const { type } = useParams();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = Cookies.get("jwt");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
            setUserRole(!payload.student_user ? payload.role : "student"); // Assuming the payload has a 'role' field
               

            // Fetch categories from backend based on selected material type
            axios.get(`http://localhost:8000/api/get-categories/?type=${type}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                setCategories(response.data.categories);
            }).catch((err) => {
                setError("Failed to fetch categories.");
                console.error("Failed to fetch categories:", err);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [type]);

    return (
        <div className="flex flex-col  min-h-screen">
            {userRole === "admin" && <AdminPageNavbar />}
            {userRole === "superadmin" && <SuperAdminPageNavbar />}
            {userRole === "student" && <StudentPageNavbar />}

            <div className="w-full max-w-screen-lg mt-6 p-4 self-center">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">{type.charAt(0).toUpperCase() + type.slice(1)} Categories</h1>
                {loading && <p className="text-center text-gray-600">Loading categories...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories.map((category, index) => (
                        <div key={index} className="border rounded-lg shadow-lg p-6 bg-white text-center">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">{category}</h2>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopicsPage;
