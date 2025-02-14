import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AchievementPreview = () => {
  const { id } = useParams();
  const [achievement, setAchievement] = useState(null);

  useEffect(() => {
    // Fetch achievement data from the backend
    fetch(`http://127.0.0.1:8000/api/achievement/${id}/`)
      .then(response => response.json())
      .then(data => setAchievement(data.achievement))
      .catch(error => console.error("Error fetching achievement:", error));
  }, [id]);

  if (!achievement) return <p className="text-center text-lg font-semibold">Loading...</p>;

  return (
    <div className="w-4/5 mx-auto bg-white shadow-lg rounded-lg p-8 my-10 border border-gray-200">
      {/* Achievement Title */}
      <div className="border-b pb-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-900">{achievement.name}</h2>
        <p className="text-lg text-gray-700 mt-2">{achievement.company_name}</p>
      </div>

      {/* Achievement Details */}
      <div className="border-b pb-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Achievement Details</h3>
        <p className="text-gray-700"><strong>Type:</strong> {achievement.achievement_type}</p>
        <p className="text-gray-700"><strong>Description:</strong> {achievement.achievement_description}</p>
        <p className="text-gray-700"><strong>Date:</strong> {new Date(achievement.date_of_achievement).toLocaleDateString()}</p>
        <p className="text-gray-700"><strong>Batch:</strong> {achievement.batch}</p>
      </div>

      {/* Photo */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Photo</h3>
        <img
          src={`data:image/jpeg;base64,${achievement.photo}`}
          alt={achievement.name}
          className="w-[400px] h-auto rounded-lg shadow-md"
        />
      </div>

      {/* Admin Info */}
      {/* <div className="border-b pb-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Admin Info</h3>
        <p className="text-gray-700"><strong>Created By:</strong> {achievement.created_by}</p>
        <p className="text-gray-700"><strong>Updated At:</strong> {new Date(achievement.updated_at).toLocaleString()}</p>
      </div> */}
    </div>
  );
};

export default AchievementPreview;
