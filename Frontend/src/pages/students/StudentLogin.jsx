import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie
import { ToastContainer, toast } from "react-toastify"; // Import Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import LoginCard from "../../components/Login/LoginCard";
import ForgotPasswordCard from "../../components/Login/ForgotPasswordCard";
import ResetPasswordCard from "../../components/Login/ResetPasswordCard";
import { AppPages } from "../../utils/constants";

export default function StudentLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isResetPassword, setIsResetPassword] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [lockoutTime, setLockoutTime] = useState(0);
    const navigate = useNavigate();

    // Timer for lockout countdown
    useEffect(() => {
        if (lockoutTime > 0) {
            const interval = setInterval(() => {
                setLockoutTime((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(interval);
        } else {
            setIsLocked(false);
        }
    }, [lockoutTime]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLocked) return;

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
                toast.success("Login successful! Redirecting...");
                navigate("/home"); // Redirect to student dashboard
            } else {
                if (data.error.includes("Too many failed attempts")) {
                    setIsLocked(true);
                    setLockoutTime(120); // 5-minute lockout
                }
                toast.error(data.error || "Login failed");
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error("Something went wrong. Please try again.");
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
                toast.success(data.message);
            } else {
                toast.error(data.error || "Something went wrong!");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to send reset email. Please try again.");
        }
    };

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        // Handle reset password logic here
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
        <>
            <LoginCard
                page={AppPages.studentLogin}
                formData={formData}
                formDataSetter={setFormData}
                onSubmit={handleSubmit}
                onForgotPassword={handleForgotPassword}
                onResetPassword={handleResetPassword}
                isLocked={isLocked}
                lockoutTime={lockoutTime}
            />
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
}
