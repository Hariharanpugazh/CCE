import React from "react";
import { IoMdCheckmark } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import Pagination from "../../../components/Admin/pagination";

const AchievementTable = ({
  achievements,
  selectedAchievements,
  setSelectedAchievements,
  handleAction,
  handleDelete,
  handleView,
  currentPage,
  itemsPerPage,
  handlePageChange,
}) => {
  const getCurrentItems = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleSelectAll = () => {
    if (selectedAchievements.length === achievements.length) {
      setSelectedAchievements([]);
    } else {
      setSelectedAchievements(achievements.map((achievement) => achievement._id));
    }
  };

  const handleBulkDelete = async (type) => {
    const ids =
      type === "job"
        ? selectedJobs
        : type === "achievement"
        ? selectedAchievements
        : selectedInternships;

    if (window.confirm(`Are you sure you want to delete all selected ${type}s?`)) {
      try {
        const promises = ids.map((id) => handleDelete(id, type));
        await Promise.all(promises);
        setMessage(`All selected ${type}s have been deleted.`);
      } catch (err) {
        console.error(`Error bulk deleting ${type}s:`, err);
        setError(`Failed to bulk delete ${type}s.`);
      }
    }
  };
  
  return (
    <div id="achievements-section" className="mt-4">
      <div className="flex justify-between items-center mb-2 w-[79%]">
        <h2 className="text-lg font-semibold">Achievement Approvals</h2>
        <div className="flex items-center pt-4 space-x-2">
          <button
            className="px-2 py-1 bg-green-500 text-white rounded text-sm"
            onClick={() => handleBulkApprove("achievement")}
          >
            Approve all
          </button>
          <button
            className="px-2 py-1 bg-red-500 text-white rounded text-sm"
            onClick={() => handleBulkDelete("achievement")}
          >
            Delete all
          </button>
          <input
            type="checkbox"
            checked={selectedAchievements.length === achievements.length}
            onChange={handleSelectAll}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="ml-1 text-sm">Select All</span>
        </div>
      </div>
      {achievements.length === 0 ? (
        <p className="text-gray-600 text-sm">No achievements to review.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg w-[80%]">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1 border-b border-gray-200">Select</th>
                <th className="px-2 py-1 border-b border-gray-200">Name</th>
                <th className="px-2 py-1 border-b border-gray-200">Type</th>
                <th className="px-2 py-1 border-b border-gray-200">Company</th>
                <th className="px-2 py-1 border-b border-gray-200">Batch</th>
                <th className="px-2 py-1 border-b border-gray-200">Status</th>
                <th className="px-2 py-1 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentItems(achievements).map((achievement) => (
                <tr key={achievement._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="text-center px-2 py-1">
                    <input
                      type="checkbox"
                      checked={selectedAchievements.includes(achievement._id)}
                      onChange={() =>
                        setSelectedAchievements((prev) =>
                          prev.includes(achievement._id)
                            ? prev.filter((id) => id !== achievement._id)
                            : [...prev, achievement._id]
                        )
                      }
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                  </td>
                  <td className="text-center px-2 py-1">{achievement.name}</td>
                  <td className="text-center px-2 py-1">{achievement.achievement_type}</td>
                  <td className="text-center px-2 py-1">{achievement.company_name}</td>
                  <td className="text-center px-2 py-1">{achievement.batch}</td>
                  <td className="text-center px-2 py-1 font-semibold">
                    {achievement.is_publish === null ? (
                      <span className="bg-yellow-200 text-yellow-800 px-1 py-0.5 rounded-full text-xs">
                        Pending
                      </span>
                    ) : achievement.is_publish === true ? (
                      <span className="text-green-800 px-1 py-0.5 rounded-full text-xs">
                        Approved
                      </span>
                    ) : (
                      <span className="text-red-800 px-1 py-0.5 rounded-full text-xs">
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="text-center px-2 py-1">
                    <div className="flex justify-center space-x-1">
                      {achievement.is_publish === null && (
                        <>
                          <IoMdCheckmark
                            className="text-green-500 cursor-pointer"
                            size={16}
                            onClick={() => handleAction(achievement._id, "approve", "achievement")}
                          />
                          <FaXmark
                            className="text-red-500 cursor-pointer"
                            size={16}
                            onClick={() => handleAction(achievement._id, "reject", "achievement")}
                          />
                        </>
                      )}
                      <FaEye
                        className="text-blue-500 cursor-pointer"
                        size={16}
                        onClick={() => handleView(achievement._id, "achievement")}
                      />
                      <FaTrashAlt
                        className="text-red-500 cursor-pointer"
                        size={16}
                        onClick={() => handleDelete(achievement._id, "achievement")}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalItems={achievements.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AchievementTable;
