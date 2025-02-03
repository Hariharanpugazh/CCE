import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie
import LoginCard from "../components/Login/LoginCard";
import { AppPages } from "../utils/constants";

export default function StudentLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/api/stud/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Set JWT token as a cookie
                Cookies.set("jwt", data.token.jwt, { expires: 1 }); // Expires in 1 day
                navigate("/student-dashboard"); // Redirect to student dashboard
            } else {
                alert(data.error || "Login failed");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <LoginCard
            page={AppPages.studentLogin}
            formData={formData}
            formDataSetter={setFormData}
            onSubmit={handleSubmit}
        />
    );
}
