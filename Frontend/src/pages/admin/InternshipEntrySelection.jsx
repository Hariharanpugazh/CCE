import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import Cookies from "js-cookie";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";

const InternshipEntrySelection = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [internshipData, setInternshipData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    sessionStorage.removeItem("internshipData");

    const token = Cookies.get("jwt");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(payload.role);
    }
  }, []);

  // Handle Manual Entry Navigation
  const handleManualEntry = () => {
    navigate("/internpost");
  };

  // File Upload Handler
  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setProgress(5); // Start progress bar effect

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/upload-internship-image/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });

      if (response.data && response.data.data) {
        setProgress(100); // Completed
        setInternshipData(response.data.data);

        // Save AI-extracted data to sessionStorage
        sessionStorage.setItem("internshipData", JSON.stringify(response.data.data));

        // Simulate confetti effect after successful processing
        setTimeout(() => {
          document.getElementById("confetti").classList.add("animate-fadeIn");
        }, 300);
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to process image. Try again.");
      setUploading(false);
    }
  };

  // Drag-and-Drop Handler using react-dropzone
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (!file.type.startsWith("image/")) {
        setError("Invalid file type. Please upload an image.");
        return;
      }
      setError("");
      setSelectedFile(file);
      handleFileUpload(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Enter Internship Details</h1>
        <p className="text-gray-600 mt-2">Choose your preferred method to enter internship details.</p>
      </div>

      {/* Drag & Drop File Upload Box */}
      <div
        {...getRootProps()}
        className={`w-full max-w-md p-8 border-2 border-dashed rounded-xl shadow-lg transition-all duration-300 ${
          isDragActive ? "border-green-500 bg-green-50" : "border-gray-300 bg-white"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          {isDragActive ? (
            <p className="text-green-600 font-semibold">Drop the file here...</p>
          ) : (
            <p className="text-gray-700">Drag & drop an image here, or click to select a file</p>
          )}
          {selectedFile && (
            <p className="text-sm text-gray-600">Selected File: {selectedFile.name}</p>
          )}
          <svg
            className="text-gray-400 w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
        </div>
      </div>

      <p className="mt-4 text-gray-500">OR</p>

      {/* Manual Entry Button */}
      <button
        onClick={handleManualEntry}
        className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition mt-6"
      >
        Enter Manually
      </button>

      {/* Show Enhanced Loading Progress */}
      {uploading && (
        <div className="w-full max-w-md mt-8 flex flex-col items-center">
          <p className="text-lg text-gray-700 font-semibold mb-2">Processing Image...</p>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{progress}% Completed</p>
        </div>
      )}

      {/* Confetti Celebration when Processing Completes :tada: */}
      {progress === 100 && (
        <div id="confetti" className="hidden animate-fadeIn">
          <p className="text-green-600 text-lg font-semibold mt-4">Processing Complete! :tada:</p>
        </div>
      )}

      {/* Confirmation Button to Navigate */}
      {internshipData && (
        <div className="mt-8 w-full max-w-md">
          <p className="text-center text-gray-700">AI processing completed! Review and proceed.</p>
          <button
            onClick={() => navigate("/internpost")}
            className="mt-4 bg-purple-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-purple-700 transition w-full"
          >
            Confirm & Proceed
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default InternshipEntrySelection;
