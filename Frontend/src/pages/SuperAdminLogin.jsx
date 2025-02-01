import { useState } from "react";
import LoginCard from "../components/Login/LoginCard";
import { AppPages } from "../utils/constants";

export default function SuperAdminLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <LoginCard page={AppPages.superUserLogin} formData={formData} formDataSetter={setFormData} onSubmit={handleSubmit}/>
    )
}