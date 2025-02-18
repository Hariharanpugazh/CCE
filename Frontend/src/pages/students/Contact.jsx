import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import { jwtDecode } from "jwt-decode";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    student_id: "",
    student_email: "",
    content: "",
  });
  const [isSending, setIsSending] = useState(false);
  console.log(formData);
  const token = Cookies.get("jwt");
  const decodedTok = jwtDecode(token);
console.log("DEcoded Token:", decodedTok);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const studentId = decodedToken.student_user;
        const studentEmail = localStorage.getItem("student.email");
        setFormData((prevData) => ({
          ...prevData,
          student_id: studentId,
          student_email: studentEmail || "",
        }));
      } catch (error) {
        console.error("Invalid token format.");
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/contact-us/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success("Message sent successfully!");
        setTimeout(() => {
          window.location.reload(); // Refresh page after success
        }, 1500);
      } else {
        toast.error(response.data.error || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Failed to send message. Try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <StudentPageNavbar />
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white p-6">
        <div className="md:w-1/2 text-left p-6">
          <h2 className="text-3xl font-bold mb-4">Get in touch with us today!</h2>
          <p className="text-gray-600 mb-6">
            Whatever you need, whenever you need, our team is here to help and support you every step of the way.
          </p>
          <div className="mb-4">
            <p className="font-semibold">📧 Message Us</p>
            <p className="text-gray-600">support@gmail.com</p>
          </div>
          <div>
            <p className="font-semibold">📞 Call Us</p>
            <p className="text-gray-600">+91 98765 54321</p>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="md:w-1/2 bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="hidden"
              name="student_id"
              value={formData.student_id}
              readOnly
            />
            <input
              type="text"
              name="student_email"
              value={formData.student_email}
              onChange={handleChange}
              placeholder="E-mail Id"
              className="w-full p-3 border rounded-lg bg-yellow-100"
              readOnly
            />
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="How can we help..."
              className="w-full p-3 border rounded-lg bg-yellow-100 h-32"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-yellow-400 text-black font-bold p-3 rounded-lg"
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default ContactForm;
