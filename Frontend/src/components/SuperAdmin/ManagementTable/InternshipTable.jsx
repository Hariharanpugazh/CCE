import React, { useState, useEffect } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import Pagination from "../../../components/Admin/pagination";

const InternshipTable = ({
  internships,
  selectedInternships,
  setSelectedInternships,
  handleAction,
  handleDelete,
  handleView,
  handleBulkApprove, // Ensure this prop is received
  handleBulkDelete, // Ensure this prop is received
  currentPage,
  itemsPerPage,
  handlePageChange,
}) => {
  const [sortOrder, setSortOrder] = useState(null); // 'asc' or 'desc'

  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedInternships().slice(startIndex, startIndex + itemsPerPage);
  };

  const handleSelectAll = () => {
    if (selectedInternships.length === getCurrentItems().length) {
      setSelectedInternships([]);
    } else {
      setSelectedInternships(
        getCurrentItems().map((internship) => internship._id)
      );
    }
  };

  const sortedInternships = () => {
    if (!sortOrder) return internships;
    return [...internships].sort((a, b) => {
      const dateA = new Date(a.internship_data.application_deadline);
      const dateB = new Date(b.internship_data.application_deadline);
      if (sortOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  useEffect(() => {
    setSelectedInternships((prevSelected) =>
      prevSelected.filter((id) =>
        getCurrentItems().some((internship) => internship._id === id)
      )
    );
  }, [currentPage, internships]);

  return (
    <div id="internships-section" className="mt-4">
      <div className="flex justify-between items-center mb-2 w-[95%]">
        <h2 className="text-lg font-semibold">Internship Approvals</h2>
        <div className="flex items-center pt-4 space-x-2 mr-62">
          <button
            className="px-2 py-1 bg-green-500 text-white rounded text-sm"
            onClick={() => handleBulkApprove("internship")} // Use the prop here
          >
            Approve all
          </button>
          <button
            className="px-2 py-1 bg-red-500 text-white rounded text-sm"
            onClick={() => handleBulkDelete("internship")} // Use the prop here
          >
            Delete all
          </button>
          <input
            type="checkbox"
            checked={selectedInternships.length === getCurrentItems().length}
            onChange={handleSelectAll}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="ml-1 text-sm">Select All</span>
        </div>
      </div>
      {internships.length === 0 ? (
        <p className="text-gray-600 text-sm">No internships to review.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg w-[80%]">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1 border-b border-gray-200">Select</th>
                <th className="px-2 py-1 border-b border-gray-200">Title</th>
                <th className="px-2 py-1 border-b border-gray-200">Company</th>
                <th className="px-2 py-1 border-b border-gray-200">
                  Staff Name
                </th>
                <th
                  className="px-2 py-1 border-b border-gray-200 cursor-pointer"
                  onClick={toggleSortOrder}
                >
                  Deadline
                  <span className="ml-2 text-xs">
                    {sortOrder === "desc" ? "↓" : "↑"}
                  </span>
                </th>
                <th className="px-2 py-1 border-b border-gray-200">Duration</th>
                <th className="px-2 py-1 border-b border-gray-200">Status</th>
                <th className="px-2 py-1 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentItems().map((internship) => {
                const data = internship.internship_data || {};
                return (
                  <tr
                    key={internship._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="text-center px-2 py-1">
                      <input
                        type="checkbox"
                        checked={selectedInternships.includes(internship._id)}
                        onChange={() =>
                          setSelectedInternships((prev) =>
                            prev.includes(internship._id)
                              ? prev.filter((id) => id !== internship._id)
                              : [...prev, internship._id]
                          )
                        }
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                    </td>
                    <td className="text-center px-2 py-1">
                      {data.title || "N/A"}
                    </td>
                    <td className="text-center px-2 py-1">
                      {data.company_name || "N/A"}
                    </td>
                    <td className="text-center px-2 py-1">
                      {internship.admin_name || "N/A"}
                    </td>
                    <td className="text-center px-2 py-1">
                      {data.application_deadline || "N/A"}
                    </td>
                    <td className="text-center px-2 py-1">
                      {data.duration || "N/A"}
                    </td>
                    <td className="text-center px-2 py-1 font-semibold">
                      {internship.is_publish === true ? (
                        <span className="text-green-800 px-1 py-0.5 rounded-full text-xs">
                          Approved
                        </span>
                      ) : internship.is_publish === false ? (
                        <span className="text-red-800 px-1 py-0.5 rounded-full text-xs">
                          Rejected
                        </span>
                      ) : (
                        <span className="text-yellow-800 px-1 py-0.5 rounded-full text-xs">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="text-center px-2 py-1">
                      <div className="flex justify-center space-x-1">
                        {internship.is_publish === null && (
                          <>
                            <IoMdCheckmark
                              className="text-green-500 cursor-pointer"
                              size={16}
                              onClick={() =>
                                handleAction(
                                  internship._id,
                                  "approve",
                                  "internship"
                                )
                              }
                            />
                            <FaXmark
                              className="text-red-500 cursor-pointer"
                              size={16}
                              onClick={() =>
                                handleAction(
                                  internship._id,
                                  "reject",
                                  "internship"
                                )
                              }
                            />
                          </>
                        )}
                        <FaEye
                          className="text-blue-500 cursor-pointer"
                          size={16}
                          onClick={() =>
                            handleView(internship._id, "internship")
                          }
                        />
                        <FaTrashAlt
                          className="text-red-500 cursor-pointer"
                          size={16}
                          onClick={() =>
                            handleDelete(internship._id, "internship")
                          }
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalItems={internships.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default InternshipTable;