import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import { FaBook, FaGraduationCap, FaFolderOpen } from 'react-icons/fa';

const StudyMaterialCards = () => {
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("jwt");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
            setUserRole(!payload.student_user ? payload.role : "student"); // Assuming the payload has a 'role' field
        }
    }, []);

    const handleCardClick = (type) => {
        navigate(`/topics/${type}`);
    };

    const cardData = [
        { type: "Exam", icon: FaBook },
        { type: "Subject", icon: FaGraduationCap },
        { type: "Topic", icon: FaFolderOpen },
    ];

    return (
        <div className="flex flex-col  min-h-screen">
            {userRole === "admin" && <AdminPageNavbar />}
            {userRole === "superadmin" && <SuperAdminPageNavbar />}
            {userRole === "student" && <StudentPageNavbar />}

            {/* Study Material Cards Grid with 3 cards */}
            <div className="w-full max-w-screen-lg mt-50 grid grid-cols-1 md:grid-cols-3 gap-8 p-4 self-center">    
                {cardData.map(({ type, icon: Icon }) => (
                    <div
                        key={type}
                        className="border rounded-lg shadow-lg p-6 bg-white flex flex-col items-center text-center w-full cursor-pointer hover:shadow-xl transition-transform transform hover:scale-105"
                        onClick={() => handleCardClick(type)}
                    >
                        <Icon className="text-4xl text-blue-500 mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{type}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudyMaterialCards;
