import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminListPage from "./AdminListPage";

export default function ManagementHomePage() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    const handleCreateUser = () => {
        // Navigate to the create user page or trigger create user action
        navigate('/admin-signup');
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="container mx-auto p-4 text-center">
            <h1 className="text-3xl font-bold mb-6">Management Home Page</h1>
            <div className="space-x-4 mb-6">
                <button
                    onClick={handleCreateUser}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Create New Admin
                </button>
            </div>
            <input
                type="text"
                placeholder="Search admins..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border p-2 mb-4 rounded"
            />
            <AdminListPage filter={filter} sortConfig={sortConfig} requestSort={requestSort} />
        </div>
    );
}