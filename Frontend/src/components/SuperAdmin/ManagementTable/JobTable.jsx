import React, { useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { FaXmark } from "react-icons/fa6";
import { FaCloudUploadAlt } from "react-icons/fa"; // Example publish icon
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
  const [showPopup, setShowPopup] = useState(false);
  const [popupJobId, setPopupJobId] = useState(null);

  const getCurrentItems = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePublishClick = (jobId) => {
    setPopupJobId(jobId);
    setShowPopup(true);
  };

  const handlePopupAction = (action) => {
    handleAction(popupJobId, action, "job");
    setShowPopup(false);
  };

  return (
    <div id="jobs-section" className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Job Approvals</h2>
        <div className="flex items-center space-x-4">
          <button
            className="px-3 py-1 bg-green-500 text-white rounded"
            onClick={() => handleBulkApprove("job")}
          >
            Approve all
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded"
            onClick={() => handleBulkDelete("job")}
          >
            Delete all
          </button>
          <input
            type="checkbox"
            checked={selectedJobs.length === jobs.length}
            onChange={() => handleSelectAll("job")}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2">Select All</span>
        </div>
      </div>
      {jobs.length === 0 ? (
        <p className="text-gray-600">No jobs to review.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 border border-gray-200">Select</th>
                <th className="px-4 py-2 border border-gray-200">Title</th>
                <th className="px-4 py-2 border border-gray-200">Company</th>
                <th className="px-4 py-2 border border-gray-200">Staff Name</th>
                <th className="px-4 py-2 border border-gray-200">Deadline</th>
                <th className="px-4 py-2 border border-gray-200">Status</th>
                <th className="px-4 py-2 border border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentItems(jobs).map((job, index) => (
                <tr
                  key={job._id}
                  className={`border-b border-gray-200 hover:bg-gray-100 ${
                    index % 2 === 0 ? "bg-gray-100" : ""
                  }`}
                >
                  <td className="px-4 py-2 border border-gray-200">
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
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </td>
                  <td className="px-4 py-2 border border-gray-200">{job.job_data.title}</td>
                  <td className="px-4 py-2 border border-gray-200">{job.job_data.company_name}</td>
                  <td className="px-4 py-2 border border-gray-200">{job.admin_name}</td>
                  <td className="px-4 py-2 border border-gray-200">{job.job_data.application_deadline}</td>
                  <td className="px-4 py-2 font-semibold border border-gray-200 flex items-center">
                    {job.is_publish === true ? (
                      <>
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        <span className=" text-black  px-2 py-1 rounded-full">
                          Approved
                        </span>
                      </>
                    ) : job.is_publish === false ? (
                      <>
                        <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                        <span className="text-black px-2 py-1 rounded-full">
                          Rejected
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="inline-block w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                        <span className="text-black px-2 py-1 rounded-full">
                          Pending
                        </span>
                      </>
                    )}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    <div className="flex space-x-2">
                      {job.is_publish === null && (
                        <img
                        src="/Confirm.svg"
                        alt="Publish"
                        className="text-blue-500 cursor-pointer"
                        style={{ width: '20px', height: '20px' }}
                        onClick={() => handlePublishClick(job._id)}
                      />
                      )}
                      <img
                        src="/Edit.svg"
                        alt="View"
                        className="text-blue-500 cursor-pointer"
                        style={{ width: '20px', height: '20px' }}
                        onClick={() => handleView(job._id, "job")}
                      />
                      <img
                        src="/Delete.svg"
                        alt="Delete"
                        className="text-red-500 cursor-pointer"
                        style={{ width: '20px', height: '20px' }}
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
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50" style={{ zIndex: 1000 }}>
          <div className="bg-white p-6 rounded-lg ">
            <h3 className="text-lg font-semibold mb-4">Publish Job</h3>
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => handlePopupAction("approve")}
              >
                Approve
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => handlePopupAction("reject")}
              >
                Reject
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTable;
