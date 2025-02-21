import { useContext, useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { LoaderContext } from "../../components/Common/Loader";
import gridImg from '../../assets/images/Grid Lines.png';
import HorizontalApplicationCard from "../../components/Students/HorizApplicationCard";

const themeButton = "px-7 py-[6px] rounded w-fit text-sm bg-[#FFCC00] cursor-pointer";

export default function HomeDashboard() {
  const [jobs, setJobs] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [internships, setInternships] = useState([]);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [unconfirmedJob, setUnconfirmedJob] = useState(null);

  const { setIsLoading } = useContext(LoaderContext)

  useEffect(() => {
    0
    setIsLoading(true)
    const fetchData = async () => {
      try {
        const [jobsRes, achievementsRes, internshipsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/published-jobs/"),
          axios.get("http://localhost:8000/api/published-achievement/"),
          axios.get("http://localhost:8000/api/published-internship/")
        ]);

        setJobs(jobsRes.data.jobs);
        setAchievements(achievementsRes.data.achievements);
        setInternships(internshipsRes.data.internships);
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
        setIsLoading(false)
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        const token = Cookies.get("jwt");
        const userId = JSON.parse(atob(token.split(".")[1])).student_user;
        const response = await axios.get(`http://localhost:8000/api/applied-jobs/${userId}/`);
        const appliedJobs = response.data.jobs;

        const unconfirmed = appliedJobs.find(job => job.confirmed === null);
        if (unconfirmed) {
          // Fetch job details using the job ID
          const jobResponse = await axios.get(`http://localhost:8000/api/job/${unconfirmed.job_id}/`);
          const jobDetails = jobResponse.data.job;
          setUnconfirmedJob({ ...unconfirmed, job_data: jobDetails.job_data });
          setShowPopup(true);
        }
      } catch (error) {
        console.error("Error checking application status:", error);
      }
    };

    checkApplicationStatus();
  }, []);

  const handleConfirm = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;
      await axios.post('http://localhost:8000/api/confirm-job/', {
        studentId: userId,
        jobId: unconfirmedJob.job_id,
        confirmed: true
      });
      setShowPopup(false);
    } catch (error) {
      console.error("Error confirming job application:", error);
      alert("Unable to track application. Please try again later.");
    }
  };

  const handleCancel = async () => {
    try {
      const token = Cookies.get("jwt");
      const userId = JSON.parse(atob(token.split(".")[1])).student_user;
      await axios.post('http://localhost:8000/api/confirm-job/', {
        studentId: userId,
        jobId: unconfirmedJob.job_id,
        confirmed: false
      });
      setShowPopup(false);
    } catch (error) {
      console.error("Error marking job application as not confirmed:", error);
      alert("Unable to mark application as not confirmed. Please try again later.");
    }
  };

  const mentors = [
    { 'photo': "https://media.istockphoto.com/id/1300512215/photo/headshot-portrait-of-smiling-ethnic-businessman-in-office.jpg?s=612x612&w=0&k=20&c=QjebAlXBgee05B3rcLDAtOaMtmdLjtZ5Yg9IJoiy-VY=", 'name': "Joe" },
    { 'photo': "https://t3.ftcdn.net/jpg/06/39/64/14/360_F_639641415_lLjzVDVwL0RwdNrkURYFboc4N21YIXJR.jpg", 'name': "Samaratian" },
    { 'photo': "https://cdn2.f-cdn.com/files/download/38547697/ddc116.jpg", 'name': "Jane" },
    { 'photo': "https://media.istockphoto.com/id/1317804578/photo/one-businesswoman-headshot-smiling-at-the-camera.jpg?s=612x612&w=0&k=20&c=EqR2Lffp4tkIYzpqYh8aYIPRr-gmZliRHRxcQC5yylY=", 'name': "Emma" },
    { 'photo': "https://thumbs.dreamstime.com/b/profile-picture-caucasian-male-employee-posing-office-happy-young-worker-look-camera-workplace-headshot-portrait-smiling-190186649.jpg", 'name': "Shaun" },
    { 'photo': "https://cdn2.f-cdn.com/files/download/42322552/f58f50.jpg", 'name': "Ghale" }
  ]

  return (
    <div className="flex flex-col items-center">
      <header className="w-full relative">
        <img src={gridImg} alt="" className="absolute h-full w-full -z-1 object-cover" />

        <div className="w-full">
          <StudentPageNavbar transparent={true} />
        </div>

        <div className="w-full flex flex-col items-center text-center py-34 space-y-5">
          <p className="text-7xl font-semibold"> One Step Closer To <br /> Your <span className="text-[#FFCC00]"> Dream Job </span> </p>
          <p> let us help you find a job that suits you the best! </p>
          <button className={themeButton}> Explore </button>
        </div>

        <div className="relative w-full">
          <p className="w-full bg-[#FFCC00] p-4 px-0 rotate-[2deg] text-justify shadow-lg leading-snug custom-justify text-2xl">
            Build an entrepreneurial mindset through our Design Thinking Framework * Redesigning common mind and Business Towards Excellence
          </p>

          <p className="absolute -z-1 top-0 w-full bg-[#e4b600] p-6 py-9 rotate-[-2deg]"> </p>
        </div>
      </header>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#1e2939a8] z-60">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm Your Job Application</h2>
            <p className="mb-4">
              Did you complete your job application for "{unconfirmedJob?.job_data?.title}"?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirm}
                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition duration-300"
              >
                Yes, Confirm
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition duration-300"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
