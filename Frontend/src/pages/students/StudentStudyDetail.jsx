import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LoaderContext } from "../../components/Common/Loader"; // Import Loader Context
import { FaGoogle, FaYoutube, FaGoogleDrive } from 'react-icons/fa'; // Import icons
import ReactPlayer from 'react-player'; // Import ReactPlayer

// Utility function to extract YouTube video ID
const getYouTubeVideoId = (url) => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === 'youtu.be') {
      return parsedUrl.pathname.substring(1); // Extract from short URL
    } else {
      return parsedUrl.searchParams.get('v'); // Extract from full URL
    }
  } catch (error) {
    console.error('Invalid YouTube URL:', url);
    return null;
  }
};

export default function StudentStudyDetail() {
  const location = useLocation();
  const { card } = location.state;

  // Add state and handler functions for the new section
  const [selectedType, setSelectedType] = useState('Exam');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchStudyMaterials = async () => {
      setIsLoading(true); // Show loader when fetching data
      try {
        const response = await fetch('http://127.0.0.1:8000/api/all-study-material/');
        const data = await response.json();
        updateCategories(data.study_materials, selectedType);
      } catch (error) {
        console.error('Error fetching study materials:', error);
      } finally {
        setIsLoading(false); // Hide loader after data fetch
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
    <div className="w-full h-screen">
      <StudentPageNavbar />
      <div className='px-8'>
        <div className="flex flex-col justify-between py-6">
          <h1 className="text-xl font-semibold">Study Material</h1>

        </div>


        {/* Existing content */}
        <div className='flex justify-center'>
          <div className='relative border border-gray-300 p-6 w-full max-w-8xl mr- rounded-lg'> {/* Added rounded-lg for small curve */}
            <div className='flex justify-between items-center'>
              <h1 className="text-xl font-semibold">{card.title}</h1>
              <div className='flex space-x-4 ml-4'> {/* Increased space between icons and title */}
                {/* <FaGoogle className='text-[#4285F4] text-2xl' />  Increased icon size */} 
                {/* <FaYoutube className='text-[#FF0000] text-2xl' />  Increased icon size */} 
                {/* <FaGoogleDrive className='text-[#34A853] text-2xl' /> Increased icon size */}
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
            {/* Add YouTube video container */}
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
  );
}
