import { useEffect, useState } from "react";
import axios from "axios";
import StudentPageNavbar from "../../components/Students/StudentPageNavbar";
import StudentPageSearchBar from "../../components/Students/StudentPageSearchBar";
import PageHeader from "../../components/Common/StudentPageHeader";

export default function HomeDashboard() {
  const [jobs, setJobs] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [internships, setInternships] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
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
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      <StudentPageNavbar />
      <PageHeader page="Home Dashboard" />

      <div className="w-[80%] self-center">
        <StudentPageSearchBar />
      </div>

      {/* Jobs Section */}
      <section className="w-[80%] self-center mt-6">
        <h2 className="text-2xl font-bold mb-4">Job Opportunities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length === 0 ? <p>No jobs available at the moment.</p> :
            jobs.map((job) => (
              <div key={job._id} className="p-4 border rounded-lg shadow-md bg-white">
                <h3 className="text-xl font-bold">{job.job_data.title}</h3>
                <p>{job.job_data.company_name}</p>
                <p>{job.job_data.job_location}</p>
              </div>
            ))}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="w-[80%] self-center mt-6">
        <h2 className="text-2xl font-bold mb-4">Achievements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.length === 0 ? <p>No achievements available at the moment.</p> :
            achievements.map((achievement) => (
              <div key={achievement._id} className="p-4 border rounded-lg shadow-md bg-white flex flex-col items-center">
                <img src={`data:image/jpeg;base64,${achievement.photo}`} alt="Achievement" className="w-full h-48 object-cover rounded-md" />
                <h3 className="text-xl font-bold mt-2">{achievement.name}</h3>
                <p>{achievement.department}</p>
              </div>
            ))}
        </div>
      </section>

      {/* Internships Section */}
      <section className="w-[80%] self-center mt-6">
        <h2 className="text-2xl font-bold mb-4">Internship Opportunities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.length === 0 ? <p>No internships available at the moment.</p> :
            internships.map((internship) => (
              <div key={internship._id} className="p-4 border rounded-lg shadow-md bg-white">
                <h3 className="text-xl font-bold">{internship.title}</h3>
                <p>{internship.company_name}</p>
                <p>{internship.location}</p>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
