import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormInputField } from '../../components/Common/InputField';

export default function AchievementPostForm() {
  const [formData, setFormData] = useState({
    name: "",
    achievement_description: "",
    achievement_type: "",
    company_name: "",
    date_of_achievement: "",
    batch: "",
    photo: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    const decodedToken = jwtDecode(token);
    if (decodedToken.role !== "superadmin" && decodedToken.role !== "admin") {
      toast.error("You do not have permission to access this page.");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    setUserRole(payload.role);
    if (payload.role === "admin") {
      setUserId(payload.admin_user);
    } else if (payload.role === "superadmin") {
      setUserId(payload.superadmin_user);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        setFormData({ ...formData, photo: file });
        setImagePreview(URL.createObjectURL(file));
      } else {
        toast.error("Only JPG and PNG images are allowed.");
        setFormData({ ...formData, photo: null });
        setImagePreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate date
    const selectedDate = new Date(formData.date_of_achievement);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

    if (selectedDate > today) {
      toast.error("Date of achievement cannot be in the future.");
      setLoading(false);
      return;
    }

    // Validate batch field format
    const batchPattern = /^[0-9]{4} - [0-9]{4}$/;
    if (!batchPattern.test(formData.batch)) {
      toast.error("Batch should be in the format YYYY - YYYY. (e.g. 2020 - 2024)");
      setLoading(false);
      return;
    }

    // Check if all fields are filled
    if (
      !formData.name ||
      !formData.achievement_description ||
      !formData.achievement_type ||
      !formData.company_name ||
      !formData.date_of_achievement ||
      !formData.batch ||
      !formData.photo
    ) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get("jwt");

      if (!token) {
        toast.error("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("achievement_description", formData.achievement_description);
      formDataObj.append("achievement_type", formData.achievement_type);
      formDataObj.append("company_name", formData.company_name);
      formDataObj.append("date_of_achievement", formData.date_of_achievement);
      formDataObj.append("batch", formData.batch);
      formDataObj.append("photo", formData.photo);
      formDataObj.append("userId", userId);
      formDataObj.append("role", userRole);

      const response = await axios.post(
        "http://localhost:8000/api/upload_achievement/",
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message, {
        autoClose: 2000,
        onClose: () => {
          if (userRole === "admin") {
            navigate("/admin/home");
          } else if (userRole === "superadmin") {
            navigate("/superadmin-dashboard");
          }
        },
      });

      setFormData({
        name: "",
        achievement_description: "",
        achievement_type: "",
        company_name: "",
        date_of_achievement: "",
        batch: "",
        photo: null,
      });
      setImagePreview(null);
      setLoading(false);
    } catch (err) {
      console.error("Error submitting achievement:", err);
      toast.error(err.response?.data?.error || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen min-w-screen items-stretch">
      <ToastContainer />
      {userRole === "admin" && <AdminPageNavbar className="fixed left-0 top-0 h-full" />}
      {userRole === "superadmin" && <SuperAdminPageNavbar className="fixed left-0 top-0 h-full" />}

      <div className="flex-1 w-full rounded-lg flex items-center p-6 h-full self-center">
        {/* Adjusted margin-left to account for the fixed navbar */}
        <div className="flex-1 w-full p-4 bg-white rounded-xl flex flex-col mt-8 h-full">
          <div className="flex justify-between items-center mb-5">
            <p className="mt-6 ml-1 text-2xl text-black">Post an Achievement</p>
            <button
              onClick={() => navigate(-1)}
              className="px-3 p-1.5 border rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
          <hr className="border border-gray-300 mb-4" />

          <form onSubmit={handleSubmit} className="space-y-6 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInputField
                label="Name"
                required={true}
                args={{ placeholder: "Enter the name here", value: formData.name }}
                setter={(val) => setFormData((prev) => ({ ...prev, name: val }))}
              />

              <FormInputField
                label="Company/Organization Name"
                required={true}
                args={{ placeholder: "Enter the company/organization name here", value: formData.company_name }}
                setter={(val) => setFormData((prev) => ({ ...prev, company_name: val }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full space-y-2">
                <label className="block text-sm text-black">
                  Achievement Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="achievement_type"
                  value={formData.achievement_type}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-4 py-2 mb-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="">Select Achievement Type</option>
                  <option value="Job Placement">Job Placement</option>
                  <option value="Internship">Internship</option>
                  <option value="Certification">Certification</option>
                  <option value="Exam Cracked">Exam Cracked</option>
                </select>
              </div>

              <FormInputField
                label="Date of Achievement"
                required={true}
                args={{ type: "date", value: formData.date_of_achievement }}
                setter={(val) => setFormData((prev) => ({ ...prev, date_of_achievement: val }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              <div className="flex flex-col md:flex-col md:items-center">
                <FormInputField
                  label="Batch"
                  required={true}
                  args={{ placeholder: "Enter the batch here (e.g. 2020 - 2024)", value: formData.batch }}
                  setter={(val) => setFormData((prev) => ({ ...prev, batch: val }))}
                />

                <div className="border-dashed border-2 border-gray-400 rounded-xl pt-4 pb-2 px-2 text-center bg-white mt-4 w-full ">
                  <label
                    htmlFor="photo"
                    className="cursor-pointer text-blue-600 font-semibold text-xl hover:underline"
                  >
                    {imagePreview ? "Change Image " : "Upload an Achievement Photo"}
                  </label>
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/jpeg, image/png"
                    onChange={handleImageChange}
                    className="mt-2"
                    required
                  />
                  {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview}
                        alt="Uploaded"
                        className="mx-auto rounded-lg shadow-md"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full flex flex-col space-y-2">
                <label className="block text-sm text-black">
                  Achievement Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="achievement_description"
                  value={formData.achievement_description}
                  onChange={handleChange}
                  required
                  className="w-full flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400 overflow-y-auto resize-none"
                  rows="5"
                  maxLength={300}
                  placeholder="Enter the achievement description here (Max 300 characters)"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="w-full md:w-1/3 bg-yellow-500 text-black font-semibold py-3 rounded-lg hover:bg-yellow-600 transition-colors"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Post Achievement"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
