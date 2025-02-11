import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardContent } from "../../components/ui/card";
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import axios from 'axios';
import Cookies from 'js-cookie';

const AdminProfile = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/150");
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = Cookies.get("jwt");
        const userId = JSON.parse(atob(token.split(".")[1])).admin_user;
        const response = await axios.get(`http://localhost:8000/api/get-admin/${userId}/`);
        const adminData = response.data.data;
        setAdmin(adminData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching admin profile:", err);
        setError("Failed to load admin profile.");
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Profile content below the navbar */}
      <div className="flex items-center justify-center p-6">
        <motion.div
          className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="p-8 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-center rounded-t-3xl">
            <div className="flex flex-col items-center relative">
              <img
                src={profileImage}
                alt="Admin Profile"
                className="w-32 h-32 rounded-full border-4 border-white mb-4 shadow-lg"
              />
              {editMode && (
                <div className="absolute bottom-0 right-0">
                  <input
                    type="file"
                    accept="image/*"
                    className="opacity-0 absolute w-full h-full cursor-pointer"
                    onChange={handleImageChange}
                  />
                  <label className="bg-gray-800 text-white text-xs py-1 px-2 rounded-lg cursor-pointer">
                    Change
                  </label>
                </div>
              )}
              <h1 className="text-3xl font-bold tracking-wide">{admin.name}</h1>
              <p className="text-sm mt-2">Status: <span className="font-medium uppercase">{admin.status}</span></p>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-1 text-center gap-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <h2 className="font-semibold text-xl mb-4">Admin Information</h2>
                <ul className="space-y-2 text-gray-800">
                  <li><strong className="font-medium">Department:</strong> {admin.department || 'N/A'}</li>
                  <li><strong className="font-medium">College Name:</strong> {admin.college_name || 'N/A'}</li>
                  <li><strong className="font-medium">Email:</strong> {admin.email}</li>
                  <li><strong className="font-medium">Created At:</strong> {new Date(admin.created_at).toLocaleString()}</li>
                  <li>
                    <strong className="font-medium">Last Login:</strong>{" "}
                    {admin.last_login ? new Date(admin.last_login).toLocaleString() : "Inactive"}
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>

          <div className="p-6 bg-gray-100 text-center rounded-b-3xl">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md mr-4"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Save Changes" : "Edit Profile"}
            </Button>
            <Button
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg shadow-md"
              onClick={() => navigate('/admin/home')}
            >
              Back
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminProfile;
