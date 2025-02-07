import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import JobCard from "../../components/Admin/JobCard"; // Import the JobCard component

export default function AdminDetailPage() {
    const { id } = useParams();
    const [admin, setAdmin] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAdminDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/admin-details/${id}/`);
                setAdmin(response.data.admin);
                setJobs(response.data.jobs);
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
                setMessage(`The account is now ${newStatus}.`);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            setError("Failed to update admin status.");
        }
        setLoading(false);
    };

    if (error) {
        return <p className="text-red-600">{error}</p>;
    }

    if (!admin) {
        return <p className="text-gray-600">Loading...</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <SuperAdminPageNavbar />
            <h2 className="text-2xl font-bold mb-4">Admin Details</h2>
            {message && <p className="text-blue-600 font-semibold">{message}</p>}
            <div className="mb-4">
                <p><strong>Name:</strong> {admin.name || "N/A"}</p>
                <p><strong>Email:</strong> {admin.email || "N/A"}</p>
                <p><strong>Department:</strong> {admin.department || "N/A"}</p>
                <p><strong>College Name:</strong> {admin.college_name || "N/A"}</p>
                <p>
                    <strong>Account Status:</strong>
                    <span
                        className={`font-bold ${
                            admin.status === "active" ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {admin.status}
                    </span>
                </p>
                <p><strong>Last Login:</strong> {admin.last_login ? new Date(admin.last_login).toLocaleString() : "Never"}</p>
                <p><strong>Date Created:</strong> {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : "Unknown"}</p>
                <div className="mt-4">
                    {admin.status === "active" ? (
                        <button
                            onClick={() => handleStatusChange("Inactive")}
                            disabled={loading}
                            className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                            {loading ? "Processing..." : "Inactive"}
                        </button>
                    ) : (
                        <button
                            onClick={() => handleStatusChange("active")}
                            disabled={loading}
                            className="px-4 py-2 bg-green-500 text-white rounded"
                        >
                            {loading ? "Processing..." : "Activate"}
                        </button>
                    )}
                </div>
            </div>

            {/* ✅ Display Job Details with JobCard */}
            <h3 className="text-xl font-bold mt-6 mb-2">Jobs Posted</h3>
            {jobs.length === 0 ? (
                <p className="text-gray-600">No jobs posted by this admin.</p>
            ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                        <JobCard key={job._id} job={job} />
                    ))}
                </div>
            )}
        </div>
    );
}
