import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import AdminPageNavbar from "../../components/Admin/AdminNavBar";
import SuperAdminPageNavbar from "../../components/SuperAdmin/SuperAdminNavBar";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LoaderContext } from "../../components/Common/Loader";
import { FaGoogle, FaYoutube, FaGoogleDrive } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Utility function to extract YouTube video ID
const getYouTubeVideoId = (url) => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === 'youtu.be') {
      return parsedUrl.pathname.substring(1);
    } else {
      return parsedUrl.searchParams.get('v');
    }
  } catch (error) {
    console.error('Invalid YouTube URL:', url);
    return null;
  }
};

export default function StudentStudyDetail() {
  const location = useLocation();
  const { card } = location.state;

  const [selectedType, setSelectedType] = useState('Exam');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(!decodedToken.student_user ? decodedToken.role : "student");
    }
  }, []);

  useEffect(() => {
    const fetchStudyMaterials = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/all-study-material/');
        const data = await response.json();
        updateCategories(data.study_materials, selectedType);
      } catch (error) {
        console.error('Error fetching study materials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudyMaterials();
  }, [setIsLoading, selectedType]);

  const updateCategories = (materials, type) => {
    const filteredMaterials = materials.filter(material => material.type === type);
    const uniqueCategories = [...new Set(filteredMaterials.map(item => item.category))].sort();
    setCategories(uniqueCategories);
    if (uniqueCategories.length > 0) {
      setSelectedCategory(uniqueCategories[0]);
    }
  };

  const changeType = (direction) => {
    const types = ['Exam', 'Subject', 'Topic'];
    const currentIndex = types.indexOf(selectedType);
    let newIndex = currentIndex + direction;

    if (newIndex < 0) {
      newIndex = types.length - 1;
    } else if (newIndex >= types.length) {
      newIndex = 0;
    }

    setSelectedType(types[newIndex]);
  };

  useEffect(() => {
    updateCategories(card.links, selectedType);
  }, [selectedType, card.links]);

  return (
    <div className="flex">
      {userRole === "admin" && <AdminPageNavbar />}
      {userRole === "superadmin" && <SuperAdminPageNavbar />}
      <div className="flex flex-col flex-1">
      {userRole === "student" && <StudentPageNavbar />}
        <div className='px-8'>
        <div className="flex flex-col justify-between py-6">
          <h1 className="text-xl font-semibold">Study Material</h1>
        </div>

        <div className='flex justify-center'>
          <div className='relative border border-gray-300 p-6 w-full max-w-8xl mr- rounded-lg'>
            <div className='flex justify-between items-center'>
              <h1 className="text-xl font-semibold">{card.title}</h1>
              <div className='flex space-x-4 ml-4'>
                {/* Icons can be uncommented if needed */}
                {/* <FaGoogle className='text-[#4285F4] text-2xl' /> */}
                {/* <FaYoutube className='text-[#FF0000] text-2xl' /> */}
                {/* <FaGoogleDrive className='text-[#34A853] text-2xl' /> */}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-7">{card.description}</p>
            <div className="mt-4">
              {card.links.map((link, index) => (
                <a
                  key={index}
                  href="#"
                  onClick={() => setSelectedVideo(link.link)}
                  className="text-blue-500 hover:underline block mt-1"
                >
                  {link.topic} ({link.type})
                </a>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              {card.links
                .filter(link => link.type === 'YouTube')
                .map((link, index) => {
                  const videoId = getYouTubeVideoId(link.link);
                  if (!videoId) return null;
                  return (
                    <ReactPlayer
                      key={index}
                      url={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                      controls
                      width="80%"
                      height="400px"
                    />
                  );
                })}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
