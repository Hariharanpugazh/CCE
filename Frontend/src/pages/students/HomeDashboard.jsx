import { useContext, useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import StudentPageSearchBar from "../../components/Students/StudentPageSearchBar";
import PageHeader from "../../components/Common/StudentPageHeader";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { LoaderContext } from "../../components/Common/Loader";
import bgHero from "../../assets/images/hero-bg.jpg";
import gridImg from '../../assets/images/Grid.png';
import HorizontalApplicationCard from "../../components/Students/HorizApplicationCard";

const themeButton = "px-7 py-[6px] rounded-lg w-fit text-sm bg-[#FFC800] cursor-pointer";

function HeroSection() {
  const phrases = [
    "Find & Apply for Your Dream Role Today!",
    "Your Next Career Move Starts Here!",
    "Discover Exciting Opportunities & Apply Now!",
    "Step Into Your Future – Find Your Perfect Job!"
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        setFade(true);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full h-[600px] flex items-center justify-center text-center relative overflow-hidden">
      <img src={bgHero} alt="Hero Background" className="absolute w-full h-full object-cover" />
      <div className="absolute inset-0 bg-[#00000087]"></div>
      <div className="relative z-10 w-full max-w-3xl">
        <div
          className={`text-5xl font-bold text-white transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"
            }`}
        >
          {phrases[currentPhraseIndex]}
        </div>
        <p className="text-2xl text-gray-200 mt-2">
          Explore the latest job openings across top industries. Apply now to advance your career!
        </p>
      </div>
    </section>
  );
}

function AboutCCEHeader() {
  return (
    <header className="flex flex-col items-center py-24 relative justify-center">
      <img src={gridImg} alt="" className="absolute object-contain w-[800px] aspect-video -z-1" />
      <div className="flex flex-col items-center">
        <p className="text-5xl"> Center for </p>
        <p className="text-5xl"> Competitive Exams </p>

        <p className="my-3">
          Turning Aspirants into Achievements
        </p>
        <button className={themeButton} onClick={() => window.location.href = "jobs"}> Explore Jobs </button>
      </div>
    </header>
  );
}

function AboutCCEContent() {
  return (
    <section className="flex flex-col items-center justify-self-center text-justify relative overflow-hidden w-[90%]">
      <img src={gridImg} alt="" className="absolute translate-x-[-70%] object-contain w-[800px] aspect-video" />
      <img src={gridImg} alt="" className="absolute translate-x-[70%] object-contain w-[800px] aspect-video" />
      <p className="text-4xl"> About CCE </p>
      <p className="my-5 text-sm w-[100%]">
        At SNS Institutions, we constantly endeavor to identify the potential
        opportunities for our students to elevate their personality and
        professional competence, which in turn will enhance their socio-economic
        status. To strengthen our endeavor further, a unique center by name
        “Center for Competitive Exams” has been created, which will function
        under the command and control of the Dr Nalin Vimal Kumar, Technical
        Director, SNS Institutions, with an aim to guide and assist students to
        get placed in Indian Armed Forces, Paramilitary Forces, Union & State
        Public Service Commission (UPSC & TNPSC), Defence Research & Development
        Organisation (DRDO) Labs, Council of Scientific & Industrial Research
        (CSIR) Labs, Indian Space Research Organisation (ISRO), Department
        of Science & Technology (DST), Indian Engineering Services, Defence Public
        Sector Undertakings (DPSUs), Central Public Sector Undertakings (CPSUs)
        and State Public Sector Undertakings (SPSUs), in addition to various
        Micro Small & Medium Enterprise (MSME) clusters and Private companies
        associated with the aforesaid organisations. In addition, the center
        will also endeavor to identify opportunities for pursuing Internship &
        Research in renowned Institutions and Organizations. To steer the
        activities in the right direction, Commander (Dr.) D K Karthik (Retd.)
        has been hired and appointed as Professor & Head-Center for Competitive
        Exams, SNS Institutions.
      </p>
    </section>
  );
}

const Footer = () => {
  return (
    <footer className="w-full flex justify-center items-center min-h-[30vh] border border-gray-300 mt-20">
      <div className="container p-10">
        <div className="flex">
          <div className="w-2/5">
            <h3 className="text-3xl mb-5">Centre for Competitive Exams</h3>
            <div className="w-3/4">
              <p className="text-sm">CCE focuses on constantly endeavor to identify the potential opportunities for our students to elevate their personality and professional competence, which in turn will enhance their socio-economic status</p>
              <hr className="border-1 border-black my-5" />
              <p className="text-sm mb-5">SNS Kalvi Nagar, Sathy Mani Road NH-209,<br />Vazhiyampalayam, Saravanampatti, Coimbatore,<br />Tamil Nadu<br />641035</p>
              <div className="flex space-x-7">
                <i className="bi bi-linkedin text-2xl"></i>
                <i className="bi bi-youtube text-2xl"></i>
                <i className="bi bi-instagram text-2xl"></i>
                <i className="bi bi-twitter text-2xl"></i>
              </div>
            </div>
          </div>
          <div className="w-3/5 flex justify-between pl-20">
            <div>
              <p className="font-bold mb-10">Products</p>
              <ul className="space-y-3">
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-10">Resources</p>
              <ul className="space-y-3">
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-10">Company</p>
              <ul className="space-y-3">
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-10">Support</p>
              <ul className="space-y-3">
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
                <li><p className="text-xs">Product</p></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="my-10 space-y-5 ">
          <hr className="border-1 border-black" />
          <p className="text-sm">&copy; {new Date().getFullYear()} SNS iHub Workplace. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  )
}

function AchievementCard({ image, name, department }) {
  return (
    <div className="relative w-60 h-80 rounded-xl overflow-hidden shadow-lg">
      <img src={`data:image/jpeg;base64,${image}`} alt={name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-[#00000087]"></div>
      <div className="absolute bottom-4 left-4 text-white">
        <p className="text-2xl"> {name} </p>
        <p className="text-xl"> {department} </p>
      </div>
    </div>
  );
}

function AchievementSlider({ achievements }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % achievements.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [achievements.length]);

  return (
    <div className="relative flex items-center justify-center w-full max-w-xl mx-auto">
      <button
        onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + achievements.length) % achievements.length)}
        className="absolute left-0 bg-gray-800 text-white p-2 rounded-full z-10"
      >
        ❮
      </button>
      <div className="w-60 h-80 overflow-hidden relative flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="absolute"
          >
            <AchievementCard
              image={achievements[currentIndex].photo}
              name={achievements[currentIndex].name}
              department={achievements[currentIndex].department}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <button
        onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % achievements.length)}
        className="absolute right-0 bg-gray-800 text-white p-2 rounded-full z-10"
      >
        ❯
      </button>
    </div>
  );
}

function FAQSection() {
  const faqs = [
    {
      question: "Can I enroll in multiple courses at once?",
      answer:
        "Absolutely! You can enroll in multiple courses simultaneously and access them at your convenience.",
    },
    {
      question: "What kind of support can I expect from instructors?",
      answer:
        "Instructors provide guidance through live Q&A sessions, discussion forums, and direct messaging.",
    },
    {
      question: "Are the courses self-paced or do they have specific start and end dates?",
      answer:
        "Most courses are self-paced, but some have scheduled start and end dates depending on the program.",
    },
    {
      question: "Are there any prerequisites for the courses?",
      answer:
        "Some advanced courses may require prior knowledge, but most beginner-friendly courses have no prerequisites.",
    },
    {
      question: "Can I download the course materials for offline access?",
      answer:
        "Yes, many courses offer downloadable resources such as PDFs and recorded lectures for offline access.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-[80%] mx-auto p-6 flex justify-between mt-18">
      <div>
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        <p className="text-gray-600 mt-2">
          Still have any questions? Contact our team via{" "}
          <a href="mailto:snscce@snsgroups.com" className="text-blue-600">
            snscce@snsgroups.com
          </a>
        </p>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-400 rounded-lg overflow-hidden">
            <button
              className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-100 transition"
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-lg">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>
            {openIndex === index && (
              <div className="p-4 bg-gray-50 text-gray-700">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomeDashboard() {
  const [jobs, setJobs] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [internships, setInternships] = useState([]);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [unconfirmedJob, setUnconfirmedJob] = useState(null);

  const { setIsLoading } = useContext(LoaderContext)

  useEffect(() => {0
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
      <div className="w-full">
        <StudentPageNavbar />
      </div>

      <HeroSection />

      <section className="w-[80%] self-center mt-6 items-center flex flex-col mt-16">
        <p className="text-3xl">Job Opportunities</p>
        <p className="text mb-4 mb-12 text-center">Search all the open positions on the web. Get your own personalized salary estimate. <br />Read reviews on over 30000+ companies worldwide.</p>
        <div className="flex flex-col gap-6 w-full mb-10">
          {jobs.length === 0 ? <p>No jobs available at the moment.</p> :
            jobs.map((job) => (
              <HorizontalApplicationCard application={{ ...job, ...job.job_data }} key={job._id} handleCardClick={() => { }} isSaved={undefined} />
            ))}
        </div>
        <button className={themeButton} onClick={() => window.location.href = "jobs"}> Explore Jobs </button>
      </section>

      <section className="w-[80%] self-center mt-6 items-center flex flex-col mt-14">
        <p className="text-3xl">Internship Opportunities</p>
        <p className="text mb-4 mb-12 text-center">Unlock your potential with an internship that fuels your growth! Gain hands-on experience <br /> work with industry experts, and take the first step toward an exciting career.</p>
        <div className="flex flex-col gap-6 w-full mb-10">
          {internships.length === 0 ? <p>No internships available at the moment.</p> :
            internships.map((intern) => (
              <HorizontalApplicationCard key={intern.id} application={{ ...intern }} handleCardClick={() => { console.log(intern) }} isSaved={undefined} />
            ))}
        </div>
        <button className={themeButton} onClick={() => window.location.href = "internships"}> Explore Internships </button>
      </section>

      <AboutCCEHeader />
      <AboutCCEContent />

      <section className="w-[80%] self-center mt-6 items-center flex flex-col mt-18">
        <p className="text-3xl">Our Team and Mentors</p>
        <p className="text mb-4 mb-12 text-center">Our team of dedicated mentors and industry experts is here to guide you every step of the way. <br /> With years of experience and a passion for innovation, we are committed to helping you unlock your full potential.</p>
        <div className="flex space-x-5 flex-wrap space-y-4 justify-center">
          {mentors.length === 0 ? <p>No achievements available at the moment.</p> :
            mentors.map((mentor) => (
              <div className="relative w-60 h-80 rounded-xl overflow-hidden shadow-lg flex-1 min-w-[250px] max-w-[600px]">
                <img src={mentor.photo} alt={mentor.photo} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#00000087]"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-2xl"> {mentor.name} </p>
                  <p className="text"> {"SNS CCE"} </p>
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className="w-[90%] self-center mt-6 items-center flex flex-col mt-20">
        <p className="text-3xl">Achievement and Milestones</p>
        <p className="text mb-4 mb-12 text-center">Achievements are not just milestones; they are reflections of dedication, passion, and perseverance. <br />Here, we celebrate those who dare to dream big, break barriers, and make a difference.</p>
        <div className="flex space-x-5 mb-10">
          {achievements.length === 0 ? <p>No achievements available at the moment.</p> :
            achievements.map((achievement) => (
              <AchievementCard image={achievement.photo} name={achievement.name} department={achievement.department} />
            ))}
        </div>
        <button className={themeButton} onClick={() => window.location.href = "achievements"}> View all Achievements </button>
      </section>

      <FAQSection />

      <Footer />

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
