import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import LoginCard from "../components/Login/LoginCard";
import { AppPages } from "../utils/constants";

export default function SuperAdminLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    // Clear cookies when entering the login page
    useEffect(() => {
        Cookies.remove("jwt");
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/api/superadmin_login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                Cookies.set("jwt", data.tokens.jwt, { expires: 1, path: "/" });
                navigate("/superadmin-dashboard");
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
            page={AppPages.superUserLogin}
            formData={formData}
            formDataSetter={setFormData}
            onSubmit={handleSubmit}
        />
    );
}
