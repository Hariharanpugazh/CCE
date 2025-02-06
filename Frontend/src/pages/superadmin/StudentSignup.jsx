import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignupCard from "../../components/Cards/SignupCard"; // Assuming you have a SignupCard component

export default function StudentSignup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        department: "",
        year: "",
        password: "",
        confirmPassword: "",
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, department, year, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/student-signup/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, department, year, password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Signup successful! Redirecting...");
                navigate("/student/dashboard"); // Redirect to student dashboard or login page
            } else {
                toast.error(data.error || "Signup failed");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <>
            <SignupCard
                formData={formData}
                formDataSetter={setFormData}
                onSubmit={handleSubmit}
            />
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
}