import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function AdminDetailPage() {
    const { id } = useParams();
    const [admin, setAdmin] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAdminDetails = async () => {
            try {
                console.log(`Fetching admin details for ID: ${id}`);
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

    if (error) {
        return <p className="text-red-600">{error}</p>;
    }

    if (!admin) {
        return <p className="text-gray-600">Loading...</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Admin Details</h2>
            <div className="mb-4">
                <p><strong>Name:</strong> {admin.name || 'N/A'}</p>
                <p><strong>Email:</strong> {admin.email || 'N/A'}</p>
                <p><strong>Account Status:</strong> 
                    <span className={`font-bold ${admin.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        {admin.status}
                    </span>
                </p>
                <p><strong>Last Login:</strong> {admin.last_login}</p>
            </div>
            
            <h3 className="text-xl font-bold mb-2">Jobs Posted</h3>
            {jobs.length === 0 ? (
                <p className="text-gray-600">No jobs posted by this admin.</p>
            ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                        <div key={job._id} className="border p-4 rounded shadow">
                            <h4 className="text-lg font-semibold mb-2">{job.title}</h4>
                            <p><strong>Company:</strong> {job.company_name}</p>
                            <p><strong>Location:</strong> {job.job_location}</p>
                            <p><strong>Salary:</strong> {job.salary_range}</p>
                            <p><strong>Experience:</strong> {job.experience_level}</p>
                            <p><strong>Description:</strong> {job.job_description}</p>
                            <p><strong>Responsibilities:</strong> {job.key_responsibilities}</p>
                            <p><strong>Skills:</strong> {job.required_skills ? job.required_skills.join(', ') : 'N/A'}</p>
                            <p><strong>Education:</strong> {job.education_requirements}</p>
                            <p><strong>Benefits:</strong> {job.benefits}</p>
                            <p><strong>Schedule:</strong> {job.work_schedule}</p>
                            <p><strong>Application Deadline:</strong> {new Date(job.application_deadline).toLocaleDateString()}</p>
                            <p><strong>Contact Email:</strong> {job.contact_email}</p>
                            <p><strong>Contact Phone:</strong> {job.contact_phone}</p>
                            <a href={job.job_link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                Apply Here
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
