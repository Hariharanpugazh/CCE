import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoryInput = ({ value, onChange, selectedType }) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token && inputValue) {
      axios.get(`http://localhost:8000/api/get-categories/?type=${selectedType}&query=${inputValue}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        setSuggestions(response.data.categories);
      }).catch((err) => {
        console.error("Failed to fetch categories:", err);
      });
    } else {
      setSuggestions([]);
    }
  }, [inputValue, selectedType]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  const handleSelect = (category) => {
    setInputValue(category);
    onChange(category);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="Type to search categories"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto">
          {suggestions.map((category, index) => (
            <li
              key={index}
              onClick={() => handleSelect(category)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
            >
              {category}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function StudyMaterialForm() {
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    description: "",
    category: "",
    links: [{ type: "", link: "", topic: "" }],
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLinkChange = (index, e) => {
    const { name, value } = e.target;
    const newLinks = [...formData.links];
    newLinks[index][name] = value;
    setFormData((prevData) => ({
      ...prevData,
      links: newLinks,
    }));
  };

  const addLinkField = () => {
    setFormData((prevData) => ({
      ...prevData,
      links: [...prevData.links, { type: "", link: "" }],
    }));
  };

  const removeLinkField = (index) => {
    const newLinks = [...formData.links];
    newLinks.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      links: newLinks,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("jwt");
      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }

      const isValidLink = (link) => {
        const youtubeRegex = /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)(\/.+)?$/;
        const driveRegex = /^https:\/\/drive\.google\.com\/file\/d\/[-\w]+\/view\?usp=sharing$/;
        return youtubeRegex.test(link) || driveRegex.test(link);
      };

      for (const link of formData.links) {
        if (link.type === "YouTube" && !isValidLink(link.link)) {
          toast.error("Invalid YouTube link.");
          return;
        }
        if (link.type === "Drive" && !isValidLink(link.link)) {
          toast.error("Invalid Google Drive link.");
          return;
        }
      }

      const response = await axios.post(
        "http://localhost:8000/api/post-study-material/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message, {
        autoClose: 2000,
        onClose: () => window.location.reload(),
      });

      setFormData({
        type: "",
        title: "",
        description: "",
        category: "",
        links: [{ type: "", link: "", topic: "" }],
      });
      setSelectedType(null);
      setShowModal(true);
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    }
  };

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token && selectedType) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(payload.role);
    }
  }, [selectedType]);

  const handleTypeSelect = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      type: type,
    }));
    setSelectedType(type);
    setShowModal(false);
  };

  const options = [
    { type: "exam", title: "Exam", description: "Select this for exam-related materials.", icon: "📚" },
    { type: "Subject", title: "Subject", description: "Select this for subject-related materials.", icon: "📓" },
    { type: "topic", title: "Topic", description: "Select this for topic-specific materials.", icon: "📂" },
  ];

  const handleClose = () => {
    setShowModal(false);
    setSelectedType(null);
    setFormData({
      type: "",
      title: "",
      description: "",
      category: "",
      links: [{ type: "", link: "", topic: "" }],
    });
    navigate(-1); // Navigate to the previous page
  };
  return (
    <div className="flex justify-stretch">
      <ToastContainer />
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}

      {message && (
        <div className="fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg">
          {message}
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg">
          {error}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-[9999]">
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    onClick={handleClose}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold leading-6 text-gray-900">
                    Select Material Type
                  </h3>
                </div>

                <div className="mt-5 grid gap-4">
                  {options.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => handleTypeSelect(option.type)}
                      className="group relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white p-4 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <div className="flex-shrink-0 text-2xl">{option.icon}</div>
                      <div className="min-w-0 flex-1 text-left">
                        <h3 className="font-medium text-gray-900">{option.title}</h3>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </div>
                      <span className="pointer-events-none absolute right-4 text-gray-300 group-hover:text-gray-400">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showModal && selectedType && (
        <div className="flex-1 px-6 py-14">
          <h2 className="text-3xl font-bold mb-4 text-center">Post Study Material</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
              ></textarea>
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold">Category</label>
              <CategoryInput
                value={formData.category}
                onChange={(value) => setFormData((prevData) => ({ ...prevData, category: value }))}
                selectedType={selectedType}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Source Links</label>
              {formData.links.map((link, index) => (
                <div key={index} className="flex items-center gap-4 mb-4">
                  <select
                    name="type"
                    value={link.type}
                    onChange={(e) => handleLinkChange(index, e)}
                    required
                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Link Type</option>
                    <option value="Drive">Drive</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="text"
                    name="link"
                    value={link.link}
                    onChange={(e) => handleLinkChange(index, e)}
                    required
                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter link"
                  />
                  <input
                    type="text"
                    name="topic"
                    value={link.topic}
                    onChange={(e) => handleLinkChange(index, e)}
                    required
                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter topic"
                  />
                  {formData.links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLinkField(index)}
                      className="text-red-600"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addLinkField}
                className="text-blue-600 font-semibold"
              >
                + Add Link
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700"
            >
              Submit Study Material
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
