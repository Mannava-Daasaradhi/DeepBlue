import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MissionCard = ({ mission, onClick }) => {
  // Difficulty Color Coding
  const difficultyColor = {
    Easy: 'text-green-400 border-green-500/30',
    Medium: 'text-amber-400 border-amber-500/30',
    Hard: 'text-red-400 border-red-500/30',
  }[mission.difficulty];

  return (
    <div 
      onClick={() => onClick(mission)}
      className={`bg-slate-800 border ${difficultyColor} border-opacity-50 p-6 rounded-xl cursor-pointer hover:scale-105 transition-transform hover:shadow-2xl hover:bg-slate-750 group`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
          {mission.title}
        </h3>
        <span className={`text-xs px-2 py-1 rounded border ${difficultyColor} bg-slate-900`}>
          {mission.difficulty}
        </span>
      </div>
      <p className="text-slate-400 text-sm mb-4 line-clamp-3">
        {mission.description}
      </p>
      <div className="flex gap-2 mt-4 text-xs text-slate-500">
        <span className="bg-slate-900 px-2 py-1 rounded">Role: Architect</span>
        <span className="bg-slate-900 px-2 py-1 rounded">Role: Translator</span>
      </div>
    </div>
  );
};

const MissionSelect = ({ onSelectMission }) => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch missions from backend
    axios.get('http://127.0.0.1:8000/missions')
      .then(res => {
        setMissions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch missions", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-white text-center mt-20">Loading Missions...</div>;

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
          DEEP BLUE PROTOCOL
        </h1>
        <p className="text-slate-400">Select a mission to begin your training.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {missions.map(mission => (
          <MissionCard key={mission.id} mission={mission} onClick={onSelectMission} />
        ))}
      </div>
    </div>
  );
};

export default MissionSelect;