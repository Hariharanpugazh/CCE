import React, { useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import Pagination from "../../../components/Admin/pagination";

const JobTable = ({
  jobs,
  selectedJobs,
  setSelectedJobs,
  handleAction,
  handleDelete,
  handleView,
  currentPage,
  itemsPerPage,
  handlePageChange,
}) => {

  const [sortOrder, setSortOrder] = useState("desc"); 
  const getCurrentItems = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleSelectAll = () => {
    if (selectedJobs.length === jobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(jobs.map((job) => job._id));
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

    // Sorting logic for the deadline column
    const sortJobsByDeadline = (jobs) => {
      return jobs.sort((a, b) => {
        const deadlineA = new Date(a.job_data.application_deadline);
        const deadlineB = new Date(b.job_data.application_deadline);
        return sortOrder === "desc" ? deadlineB - deadlineA : deadlineA - deadlineB;
      });
    };
  
    const toggleSortOrder = () => {
      setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"));
    };
  
  return (
    <div id="jobs-section" className="mt-4">
      <div className="flex justify-between items-center mb-2 w-[95%]">
        <h2 className="text-lg font-semibold">Job Approvals</h2>
        <div className="flex items-center pt-5 space-x-2 mr-62">
          <button
            className="px-2 py-1 bg-green-500 text-white rounded text-sm"
            onClick={() => handleBulkApprove("job")}
          >
            Approve all
          </button>
          <button
            className="px-2 py-1 bg-red-500 text-white rounded text-sm"
            onClick={() => handleBulkDelete("job")}
          >
            Delete all
          </button>
          <input
            type="checkbox"
            checked={selectedJobs.length === jobs.length}
            onChange={handleSelectAll}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="ml-1 text-sm">Select All</span>
        </div>
      </div>
      {jobs.length === 0 ? (
        <p className="text-gray-600 text-sm">No jobs to review.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg w-[80%]">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1 border-b border-gray-200">Select</th>
                <th className="px-2 py-1 border-b border-gray-200">Title</th>
                <th className="px-2 py-1 border-b border-gray-200">Company</th>
                <th className="px-2 py-1 border-b border-gray-200">Staff Name</th>
                <th
                  className="px-2 py-1 border-b border-gray-200 cursor-pointer"
                  onClick={toggleSortOrder} // Toggle sort on click
                >
                  Deadline
                  <span className="ml-2 text-xs">
                    {sortOrder === "desc" ? "↓" : "↑"}
                  </span>
                </th>
                <th className="px-2 py-1 border-b border-gray-200">Status</th>
                <th className="px-2 py-1 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
            {getCurrentItems(sortJobsByDeadline(jobs)).map((job) => (
                <tr key={job._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="text-center px-2 py-1">
                    <input
                      type="checkbox"
                      checked={selectedJobs.includes(job._id)}
                      onChange={() =>
                        setSelectedJobs((prev) =>
                          prev.includes(job._id)
                            ? prev.filter((id) => id !== job._id)
                            : [...prev, job._id]
                        )
                      }
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                  </td>
                  <td className="text-center px-2 py-1">{job.job_data.title}</td>
                  <td className="text-center px-2 py-1">{job.job_data.company_name}</td>
                  <td className="text-center px-2 py-1">{job.admin_name}</td>
                  <td className="text-center px-2 py-1">{job.job_data.application_deadline}</td>
                  <td className="text-center px-2 py-1 font-semibold">
                    {job.is_publish === true ? (
                      <span className="text-green-800 px-1 py-0.5 rounded-full text-xs">
                        Approved
                      </span>
                    ) : job.is_publish === false ? (
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
                      {job.is_publish === null && (
                        <>
                          <IoMdCheckmark
                            className="text-green-500 cursor-pointer"
                            size={16}
                            onClick={() => handleAction(job._id, "approve", "job")}
                          />
                          <FaXmark
                            className="text-red-500 cursor-pointer"
                            size={16}
                            onClick={() => handleAction(job._id, "reject", "job")}
                          />
                        </>
                      )}
                      <FaEye
                        className="text-blue-500 cursor-pointer"
                        size={16}
                        onClick={() => handleView(job._id, "job")}
                      />
                      <FaTrashAlt
                        className="text-red-500 cursor-pointer"
                        size={16}
                        onClick={() => handleDelete(job._id, "job")}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalItems={jobs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default JobTable;