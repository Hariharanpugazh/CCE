import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import LoginCard from "../../components/Login/LoginCard";
import ForgotPasswordCard from "../../components/Login/ForgotPasswordCard";
import ResetPasswordCard from "../../components/Login/ResetPasswordCard";
import { AppPages } from "../../utils/constants";

export default function AdminLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        newPassword: "",
        confirmPassword: "",
        token: "",
    });
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isResetPassword, setIsResetPassword] = useState(false);
    const navigate = useNavigate();

    // Clear cookies when entering the login page
    useEffect(() => {
        Cookies.remove("jwt");
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/api/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                Cookies.set("jwt", data.tokens.jwt, { expires: 1, path: "/" });
                navigate("/admin/internships");
            } else {
                alert(data.error || "Login failed");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    const handleForgotPassword = () => {
        setIsForgotPassword(true);
    };

    const handleResetPassword = () => {
        setIsResetPassword(true);
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        const email = formData.email;

        try {
            const response = await fetch("http://localhost:8000/api/forgot-password/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                setIsForgotPassword(false);
                setIsResetPassword(true); // Navigate to ResetPasswordCard
            } else {
                alert(data.error || "Something went wrong!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to send reset email. Please try again.");
        }
    };

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        const { email, token, newPassword, confirmPassword } = formData;

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/reset-password/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, token, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                navigate("/admin");
            } else {
                alert(data.error || "Something went wrong!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to reset password. Please try again.");
        }
    };

    if (isForgotPassword) {
        return (
            <ForgotPasswordCard
                page={AppPages.forgotPassword}
                formData={formData}
                formDataSetter={setFormData}
                onSubmit={handleForgotPasswordSubmit}
            />
        );
    }

    if (isResetPassword) {
        return (
            <ResetPasswordCard
                page={AppPages.resetPassword}
                formData={formData}
                formDataSetter={setFormData}
                onSubmit={handleResetPasswordSubmit}
            />
        );
    }

    return (
        <LoginCard
            page={AppPages.adminLogin}
            formData={formData}
            formDataSetter={setFormData}
            onSubmit={handleSubmit}
            onForgotPassword={handleForgotPassword}
            onResetPassword={handleResetPassword}
        />
    );
}
