import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardContent } from "../../components/ui/card";
import { motion } from 'framer-motion';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';



const SuperAdminProfile = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/150");

  const superAdmin = {
    _id: "67a2dc39eb9ad92f59c8ebef",
    name: "superadmin User",
    email: "superadmin@sns.com",
    department: "Administration",
    status: "Active",
    created_at: "2025-02-11T05:50:44.903+00:00",
    last_login: null,
    saved_jobs: [
      { id: 1, title: "System Administrator" },
      { id: 2, title: "Cloud Specialist" },
      { id: 3, title: "Security Analyst" },
    ],
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Navbar at the top */}
 

      {/* Profile content below the navbar */}
      <div className="flex items-center justify-center p-6">
        <motion.div
          className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="p-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center rounded-t-3xl">
            <div className="flex flex-col items-center relative">
              <img
                src={profileImage}
                alt="SuperAdmin Profile"
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
              <h1 className="text-3xl font-bold tracking-wide">{superAdmin.name}</h1>
              <p className="text-sm mt-2">Status: <span className="font-medium uppercase">{superAdmin.status}</span></p>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-1 text-center gap-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <h2 className="font-semibold text-xl mb-4">SuperAdmin Information</h2>
                <ul className="space-y-2 text-gray-800">
                  <li><strong className="font-medium">Department:</strong> {superAdmin.department}</li>
                  <li><strong className="font-medium">Email:</strong> {superAdmin.email}</li>
                  <li><strong className="font-medium">Created At:</strong> {new Date(superAdmin.created_at).toLocaleString()}</li>
                  <li>
                    <strong className="font-medium">Last Login:</strong>{" "}
                    {superAdmin.last_login ? new Date(superAdmin.last_login).toLocaleString() : "Never"}
                  </li>
                </ul>
              </div>
              {/* <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <h2 className="font-semibold text-xl mb-4">Saved Jobs</h2>
                <ul className="space-y-3">
                  {superAdmin.saved_jobs.map((job) => (
                    <li key={job.id} className="flex items-center space-x-3">
                      <Badge className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">Job</Badge>
                      <span className="text-gray-800 font-medium">{job.title}</span>
                    </li>
                  ))}
                </ul>
              </div> */}
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
              onClick={() => navigate('/superadmin-dashboard')}
            >
              Back
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminProfile;
