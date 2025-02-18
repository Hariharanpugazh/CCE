import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import JobCard from "../../components/Admin/JobCard"; // Import the JobCard component
import Pagination from "../../components/Admin/pagination";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

export default function AdminDetailPage() {
    const { id } = useParams();
    const [admin, setAdmin] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const ITEMS_PER_PAGE = 6;
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        department: "",
        college_name: "",
    });
    const [currentPage, setCurrentPage] = useState(1); // Move this outside of the render logic

    useEffect(() => {
        const fetchAdminDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/admin-details/${id}/`);
                setAdmin(response.data.admin);
                setJobs(response.data.jobs);
                setFormData({
                    name: response.data.admin.name,
                    email: response.data.admin.email,
                    department: response.data.admin.department,
                    college_name: response.data.admin.college_name,
                });
            } catch (err) {
                console.error("Error fetching admin details:", err);
                setError("Failed to load admin details.");
            }
        };

        fetchAdminDetails();
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        if (!admin) return;
    
        setLoading(true);
        setMessage("");
    
        try {
            const response = await axios.post(`http://localhost:8000/api/admin-status/${id}/`, {
                status: newStatus,
            });
    
            if (response.status === 200) {
                setAdmin((prevAdmin) => ({ ...prevAdmin, status: newStatus }));
                toast.success(`The account is now ${newStatus}.`, {
                    position: "bottom-right", // Position of the toast
                    autoClose: 3000, // Duration to display the toast (in ms)
                    hideProgressBar: true, // Hide progress bar
                });
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update admin status.", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: true,
            });
        }
        setLoading(false);
    };
    

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage(""); // Optional: You may no longer need to use this for setting messages.
    
        try {
            const response = await axios.put(`http://localhost:8000/api/admin/${id}/edit/`, formData);
    
            if (response.status === 200) {
                setAdmin((prevAdmin) => ({ ...prevAdmin, ...formData }));
                toast.success("Admin details updated successfully.", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
                setEditMode(false);
            }
        } catch (error) {
            console.error("Error updating admin details:", error);
            toast.error("Failed to update admin details.", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: true,
            });
        }
        setLoading(false);
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const generateCSV = () => {
        const csvRows = [];

        let last_login = admin.last_login ? new Date(admin.last_login).toLocaleString() : "Never"
        last_login = last_login.replace(/,/g, " "); // Replace all commas with spaces

        // Add admin details
        const adminHeaders = ["Name", "Email", "Department", "College Name", "Status", "Last Login", "Date Created"];
        const adminValues = [
            admin.name,
            admin.email,
            admin.department,
            admin.college_name,
            admin.status,
            last_login,
            admin.created_at ? new Date(admin.created_at).toLocaleDateString() : "Unknown"

        ];

        console.log(admin.last_login);
        console.log(admin.created_at);

        csvRows.push(adminHeaders.join(","));
        csvRows.push(adminValues.join(","));

        // Add job details
        if (jobs.length > 0) {
            const jobHeaders = ["Job Title", "Company", "Location", "Published Date"];
            csvRows.push("\n" + jobHeaders.join(","));

            jobs.forEach(job => {
                let location = job.job_location;
                location = location.replace(/,/g, " "); // Replace all commas with spaces
                const jobValues = [
                    job.title,
                    job.company_name,
                    location,
                    job.updated_at ? new Date(job.updated_at).toLocaleDateString() : "Unknown" // Use updated_at as published_at
                ];
                csvRows.push(jobValues.join(","));
            });
        }

        // Ensure no trailing comma or newline at the end
        return csvRows.join("\n").trim();
    };

    const downloadCSV = () => {
        const csvData = generateCSV();
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "admin_details.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Calculate jobs to display on the current page
    const indexOfLastJob = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstJob = indexOfLastJob - ITEMS_PER_PAGE;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

    if (error) {
        return <p className="text-red-600">{error}</p>;
    }

    if (!admin) {
        return <p className="text-gray-600">Loading...</p>;
    }

    return (
        <div className="">
            <SuperAdminPageNavbar />
            <div className="container ml-60 mt-5 w-3/4 p-4">
                <h2 className="text-3xl font-semibold text-gray-900 mb-4">Admin Details</h2>
                {message && <p className="text-blue-600 font-semibold">{message}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {editMode ? (
                        <>
                            <label className="block">
                                <span className="text-gray-700 font-medium">Name</span>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-yellow-400"
                                />
                            </label>
                            <label className="block">
                                <span className="text-gray-700 font-medium">Email</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-yellow-400"
                                />
                            </label>
                            <label className="block">
                                <span className="text-gray-700 font-medium">Department</span>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-yellow-400"
                                />
                            </label>
                            <label className="block">
                                <span className="text-gray-700 font-medium">College Name</span>
                                <input
                                    type="text"
                                    name="college_name"
                                    value={formData.college_name}
                                    onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                                    className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-yellow-400"
                                />
                            </label>
                        </>
                    ) : (
                        <>
                            <p className="text-lg">
                                <strong className="text-gray-800">Name:</strong> {admin.name || "N/A"}
                            </p>
                            <p className="text-lg">
                                <strong className="text-gray-800">Email:</strong> {admin.email || "N/A"}
                            </p>
                            <p className="text-lg">
                                <strong className="text-gray-800">Department:</strong> {admin.department || "N/A"}
                            </p>
                            <p className="text-lg">
                                <strong className="text-gray-800">College Name:</strong> {admin.college_name || "N/A"}
                            </p>
                            <p className="text-lg">
                                <strong className="text-gray-800">Account Status:</strong>{" "}
                                <span className={`font-bold ${admin.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                                    {admin.status}
                                </span>
                            </p>
                            <p className="text-lg">
                                <strong className="text-gray-800">Last Login:</strong> {admin.last_login ? new Date(admin.last_login).toLocaleString() : "Never"}
                            </p>
                            <p className="text-lg">
                                <strong className="text-gray-800">Date Created:</strong> {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : "Unknown"}
                            </p>
                        </>
                    )}
                </div>

                {/* Buttons Section */}
                <div className="mt-6 flex flex-wrap gap-4">
                    {/* Inactive/Activate Button */}
                    {admin.status === "Active" ? (
                        <button
                            onClick={() => handleStatusChange("Inactive")}
                            disabled={loading}
                            className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition-all duration-200"
                        >
                            {loading ? "Processing..." : "Inactive"}
                        </button>
                    ) : (
                        <button
                            onClick={() => handleStatusChange("Active")}
                            disabled={loading}
                            className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition-all duration-200"
                        >
                            {loading ? "Processing..." : "Activate"}
                        </button>
                    )}

                    {editMode ? (
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-all duration-200"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    ) : (
                        <button
                            onClick={handleEdit}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow hover:bg-yellow-600 transition-all duration-200"
                        >
                            Edit
                        </button>
                    )}

                    <button
                        onClick={downloadCSV}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-all duration-200"
                    >
                        Download CSV
                    </button>
                </div>

                {/* Job Post Section with Pagination */}
                <h3 className="text-xl font-bold mt-6 mb-2">Jobs Posted</h3>
                {jobs.length === 0 ? (
                    <p className="text-gray-600">No jobs posted by this admin.</p>
                ) : (
                    <>
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {currentJobs.map((job) => (
                                <JobCard key={job._id} job={job} />
                            ))}
                        </div>

                        {/* Pagination Component */}
                        <Pagination
                            currentPage={currentPage}
                            totalItems={jobs.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
