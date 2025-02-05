import React, { useState } from "react";
import { toast } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Toast styles
import InputField from "../Common/InputField";
import wavyPattern from "../../assets/images/wavy-circles.png";

export default function ForgotPasswordCard({ page, formDataSetter, formData, onSubmit }) {
  const [loading, setLoading] = useState(false); // Loader state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      await onSubmit(e); // Call the forgot password function
      toast.success("OTP sent successfully! Please check your email.");
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
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
              Enter your email to receive a password reset OTP.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-3/4 flex flex-col items-center">
            <div className="space-y-2 mb-6 text-right">
              <InputField
                args={{ placeholder: "Enter your Email", required: true }}
                value={formData.email}
                setter={(val) => formDataSetter((prevData) => ({ ...prevData, email: val }))}
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
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
