import { useState } from 'react';
import Navbar from './components/Navbar';
import UserInputForm from './components/UserInputForm';
import RoadmapDisplay from './components/RoadmapDisplay';
import './App.css';

function App() {
  const [formData, setFormData] = useState(null);
  const [roadmap, setRoadmap] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form) => {
    try {
      setFormData(form);
      setLoading(true);
      setRoadmap(''); 
      const response = await fetch('https://aimockinterviewapp-1.onrender.com/api/RoadMap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          skills: form.skills.split(',').map(s => s.trim()),
          experienceInYears: parseInt(form.experience),
          careerGoal: form.goal,
          durationInMonths: parseInt(form.duration),
        }),
      });
      
      if (!response.ok) throw new Error("Failed to generate PDF");

      const data = await response.json();
      setRoadmap(data.roadmapText || 'No roadmap generated.');
      if (!response.ok) throw new Error("Failed to generate PDF");
      console.log("✅ PDF downloaded successfully!");
    } 
    catch (err) {
      console.error(err);
      setRoadmap('Error generating roadmap.');
    }
    finally {
    setLoading(false);
    }
  };
  const handleDownload = async () => {
  try {
    const response = await fetch('https://aimockinterviewapp-1.onrender.com/api/RoadMap/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        roadmapText: roadmap, // send the generated roadmap
      }),
    });

    if (!response.ok) throw new Error('Failed to download PDF');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'career_roadmap.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <>
      <Navbar />
      <UserInputForm onSubmit={handleSubmit} />
            {/* ✅ Show spinner only while loading */}
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Generating your roadmap, please wait...</p>
        </div>
      )}

    {roadmap && !loading && (
      <div className = "downloadButtonContainer">
              <button className = "downloadButton" onClick={handleDownload}>
                ⬇️ Download PDF
              </button>
       </div>
  )}
        {!loading && <RoadmapDisplay roadmap={roadmap} />}
    </>
  );
}

export default App;
