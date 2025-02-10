import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [internships, setInternships] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = Cookies.get("jwt");
        const response = await axios.get("http://localhost:8000/api/manage-jobs/", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    const fetchStudyMaterials = async () => {
      try {
        const token = Cookies.get("jwt");
        const response = await axios.get("http://localhost:8000/api/manage-study-materials/", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setStudyMaterials(response.data.study_materials);
      } catch (error) {
        console.error("Error fetching study materials:", error);
      }
    };

    const fetchInternships = async () => {
      try {
        const token = Cookies.get("jwt");
        const response = await axios.get("http://localhost:8000/api/manage-internships/", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setInternships(response.data.internships);
      } catch (error) {
        console.error("Error fetching internships:", error);
      }
    };

    fetchJobs();
    fetchStudyMaterials();
    fetchInternships();
  }, []);

  const handleEditClick = (id, type) => {
    navigate(type === "job" ? `/job-edit/${id}` : type === "study" ? `/study-edit/${id}` : `/internship-edit/${id}`);
  };

  const renderCard = (item, type) => (
    <div key={item._id} className="border rounded-lg shadow-md p-4 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">
            {type === "job" ? item.job_data.title : type === "study" ? item.study_material_data.title : item.internship_data.title}
          </h2>
          <span className={`px-2 py-1 text-sm font-semibold rounded ${item.is_publish ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {item.is_publish ? "Published" : "Pending"}
          </span>
        </div>
        <p className="text-gray-600">
          <strong>{type === "study" ? "Category:" : "Company:"}</strong> {type === "study" ? item.study_material_data.category : item.job_data?.company_name || item.internship_data?.company_name}
        </p>
      </div>
      <button
        onClick={() => handleEditClick(item._id, type)}
        className="text-blue-500 mt-4 self-start border border-blue-500 px-4 py-1 rounded hover:bg-blue-500 hover:text-white transition"
      >
        Edit
      </button>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <AdminPageNavbar />

      <h1 className="text-3xl pt-5 text-center font-bold mb-4">Manage Jobs, Study Materials & Internships</h1>

      <h2 className="text-2xl font-semibold mb-4">Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => renderCard(job, "job"))}
      </div>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Internships</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {internships.map((internship) => renderCard(internship, "internship"))}
      </div>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">Study Materials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {studyMaterials.map((study) => renderCard(study, "study"))}
      </div>


    </div>
  );
};

export default ManageJobs;
