import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const InternshipPreview = () => {
    const { id } = useParams();
    const [internship, setInternship] = useState(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/internship/${id}/`)
            .then((response) => response.json())
            .then((data) => setInternship(data.internship))
            .catch((error) => console.error("Error fetching internship:", error));
    }, [id]);

    if (!internship) {
        return <p className="text-center text-lg font-semibold">Loading...</p>;
    }

    return (
        <div className="w-4/5 mx-auto bg-white shadow-lg rounded-lg p-8 my-10 border border-gray-200">
            <div className="border-b pb-4 mb-6">
                <h2 className="text-3xl font-bold text-gray-900">{internship.title}</h2>
                <p className="text-lg text-gray-700 mt-2">{internship.company_name}</p>
                <a
                    href={internship.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                >
                    Visit Company Website
                </a>
            </div>

            <div className="border-b pb-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Internship Overview</h3>
                <p className="text-gray-700"><strong>Location:</strong> {internship.location}</p>
                <p className="text-gray-700"><strong>Duration:</strong> {internship.duration}</p>
                <p className="text-gray-700"><strong>Stipend:</strong> {internship.stipend}</p>
                <p className="text-gray-700"><strong>Type:</strong> {internship.internship_type}</p>
            </div>

            <div className="border-b pb-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-700">{internship.job_description}</p>
            </div>

            <div className="border-b pb-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Skills Required</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                    {internship.skills_required.map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            <div className="text-center mt-8">
            <div className="text-center mt-8">
            <a
                href={internship.job_link} // Map the correct link from the backend response
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
            >
                Apply Now
            </a>
        </div>
            </div>
        </div>
    );
};

export default InternshipPreview;
