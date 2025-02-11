import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import StudentPageSearchBar from "../../components/Students/StudentPageSearchBar";
import PageHeader from "../../components/Common/StudentPageHeader";

const StudentStudyMaterial = () => {
    const [studymaterial, setStudymaterial] = useState([]);
    const [filter, setFilter] = useState("All");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("useEffect triggered");
        const fetchStudymaterials = async () => {
            try {
                console.log("Fetching study materials...");
                const response = await axios.get("http://127.0.0.1:8000/api/all-study-material/");
                console.log("API Response:", response.data);

                // Check if the response data structure is as expected
                if (response.data && Array.isArray(response.data.study_materials)) {
                    setStudymaterial(response.data.study_materials);
                } else {
                    throw new Error("Unexpected response structure");
                }
            } catch (err) {
                console.error("Error fetching study materials:", err);
                setError("Failed to load study materials. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudymaterials();
    }, []);

    const filteredMaterials = studymaterial.filter(material =>
        filter === "All" || material.study_material_data?.category === filter
    );

    return (
        <div>
            <StudentPageNavbar />
            <PageHeader
                page={{ displayName: "Study Material" }}
                filter={filter}
                setFilter={setFilter}
            />
            <StudentPageSearchBar filter={filter} setFilter={setFilter} />
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && <p className="text-center text-gray-600">Loading study materials...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {!loading && filteredMaterials.length > 0 ? (
                    filteredMaterials.map(material => (
                        <div
                            key={material._id}
                            className="border rounded-lg shadow-md p-4 mb-4 bg-white "
                        >
                            <p className="text-xl font-semibold text-gray-800">
                                <strong>Title:</strong> {material.study_material_data?.title}
                            </p>
                            <p className="text-gray-600 mt-2">
                                <strong>Description:</strong> {material.study_material_data?.description}
                            </p>
                            <p className="text-gray-700 mt-2">
                                <strong>Content:</strong> {material.study_material_data?.text_content}
                            </p>
                            {material.study_material_data?.link && (
                                <p className="mt-2">
                                    <strong>Additional Material:</strong>
                                    <a
                                        href={material.study_material_data.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        Link
                                    </a>
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    !loading && <p className="text-center text-gray-600">No study materials available.</p>
                )}
            </div>
        </div>

    );
};

export default StudentStudyMaterial;
