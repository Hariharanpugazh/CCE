import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardContent } from "../../components/ui/card";
import { motion } from 'framer-motion';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import axios from 'axios';
import Cookies from 'js-cookie';

const StudentProfile = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/150");
  const [student, setStudent] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const token = Cookies.get("jwt");
        const userId = JSON.parse(atob(token.split(".")[1])).student_user;
        const response = await axios.get(`http://localhost:8000/api/profile/${userId}/`);
        const studentData = response.data.data;
        setStudent(studentData);

        // Fetch details for each saved job
        const jobDetailsPromises = studentData.saved_jobs.map(jobId =>
          axios.get(`http://localhost:8000/api/job/${jobId}/`)
        );

        const jobDetails = await Promise.all(jobDetailsPromises);
        const jobTitles = jobDetails.map(job => job.data.job.job_data.title);
        setSavedJobs(jobTitles);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching student profile:", err);
        setError("Failed to load student profile.");
        setLoading(false);
      }
    };

    fetchStudentProfile();
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
      {/* Navbar at the top */}


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
                alt="Student Profile"
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
              <h1 className="text-3xl font-bold tracking-wide">{student.name}</h1>
              <p className="text-sm mt-2">Status: <span className="font-medium uppercase">{student.status}</span></p>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <h2 className="font-semibold text-xl mb-4">Student Information</h2>
                <ul className="space-y-2 text-gray-800">
                  <li><strong className="font-medium">Department:</strong> {student.department}</li>
                  <li><strong className="font-medium">Year:</strong> {student.year}</li>
                  <li><strong className="font-medium">Email:</strong> {student.email}</li>
                  <li><strong className="font-medium">Last Login:</strong> {new Date(student.last_login).toLocaleString()}</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <h2 className="font-semibold text-xl mb-4">Saved Jobs</h2>
                <ul className="space-y-3">
                  {savedJobs.map((jobTitle, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Badge className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">Job</Badge>
                      <span className="text-gray-800 font-medium">{jobTitle}</span>
                    </li>
                  ))}
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
              onClick={() => navigate('/home')}
            >
              Back
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentProfile;
