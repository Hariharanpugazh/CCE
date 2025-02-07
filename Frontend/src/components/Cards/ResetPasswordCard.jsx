import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Toast styles
import InputField from "../Common/InputField";
import wavyPattern from "../../assets/images/wavy-circles.png";

export default function ResetPasswordCard({ page, formDataSetter, formData, onSubmit }) {
  const [loading, setLoading] = useState(false); // Loader state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      await onSubmit(e); // Call the reset password function
      toast.success("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/"), 3000); // Redirect to login after 3 seconds
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden">
      {/* bg image */}
      <div className="h-full w-full absolute z-[-1] flex items-center top-[10%]">
        <img src={wavyPattern} alt="" className="" />
      </div>

      {/* card */}
      <div className="w-3/4 min-h-3/4 max-h-[85%] bg-white shadow-lg rounded-lg flex items-stretch p-2">
        {/* illustration */}
        <div className="flex-1 bg-yellow-100 rounded-lg"></div>

        {/* form */}
        <div className="flex-1 p-6 flex flex-col items-center justify-evenly">
          <div className="flex flex-col space-y-2 items-center">
            <p className="text-4xl font-medium">{page.displayName}</p>
            <p className="text-[#838383] text-sm w-3/4 text-center">
              Enter your new password and OTP sent to your email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-3/4 flex flex-col items-center">
            <div className="space-y-2 mb-6 text-right">
              {/* <InputField
                args={{ placeholder: "Enter your Email", required: true }}
                value={formData.email}
                setter={(val) => formDataSetter((prevData) => ({ ...prevData, email: val }))}
              />
              <InputField
                args={{ placeholder: "Enter OTP Token", required: true }}
                value={formData.token}
                setter={(val) => formDataSetter((prevData) => ({ ...prevData, token: val }))}
              /> */}
              <InputField
                args={{ placeholder: "Enter your New Password", required: true }}
                value={formData.newPassword}
                setter={(val) => formDataSetter((prevData) => ({ ...prevData, newPassword: val }))}
              />
              <InputField
                args={{ placeholder: "Confirm your New Password", required: true }}
                value={formData.confirmPassword}
                setter={(val) => formDataSetter((prevData) => ({ ...prevData, confirmPassword: val }))}
              />
            </div>

            {/* Button with Loader */}
            <button
              type="submit"
              className={`p-3 rounded-2xl w-full font-semibold ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#FECC00]"
              }`}
              disabled={loading}
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
