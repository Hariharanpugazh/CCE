import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminListPage({ filter, sortConfig, requestSort }) {
    const [admins, setAdmins] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Fetch admin details from the backend
    useEffect(() => {
        const fetchAdminDetails = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/admins-list/");
                setAdmins(response.data.admins); // Set admin details
            } catch (err) {
                console.error("Error fetching admin details:", err);
                setError("Failed to load admin details.");
            }
        };

        fetchAdminDetails();
    }, []);

    // Filter and sort admins
    const filteredAdmins = admins
        .filter((admin) =>
            (admin.name && admin.name.toLowerCase().includes(filter.toLowerCase())) ||
            (admin.email && admin.email.toLowerCase().includes(filter.toLowerCase())) ||
            (admin.role && admin.role.toLowerCase().includes(filter.toLowerCase()))
        )
        .sort((a, b) => {
            if (!sortConfig.key) return 0;
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

    // Handle admin card click
    const handleAdminClick = (adminId) => {
        navigate(`/admin-details/${adminId}`);
    };

    return (
        <div className="container text-center mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Admin List</h2>
            {error ? (
                <p className="text-red-600">{error}</p>
            ) : filteredAdmins.length === 0 ? (
                <p className="text-gray-600">No admin details match your search.</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th
                                className="py-2 px-4 border-b cursor-pointer"
                                onClick={() => requestSort('name')}
                            >
                                Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                            </th>
                            <th
                                className="py-2 px-4 border-b cursor-pointer"
                                onClick={() => requestSort('email')}
                            >
                                Email {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                            </th>
                            {/* <th
                                className="py-2 px-4 border-b cursor-pointer"
                                onClick={() => requestSort('role')}
                            >
                                Role {sortConfig.key === 'role' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                            </th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAdmins.map((admin) => (
                            <tr
                                key={admin._id}
                                onClick={() => handleAdminClick(admin._id)}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                <td className="py-2 px-4 border-b">{admin.name || 'N/A'}</td>
                                <td className="py-2 px-4 border-b">{admin.email || 'N/A'}</td>
                                {/* <td className="py-2 px-4 border-b">{admin.role || 'N/A'}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}