import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MissionCard = ({ mission, onClick }) => {
  const difficultyColor = {
    Easy: 'text-green-400 border-green-500/30',
    Medium: 'text-amber-400 border-amber-500/30',
    Hard: 'text-red-400 border-red-500/30',
  }[mission.difficulty] || 'text-slate-400 border-slate-500/30';

  return (
    <div 
      onClick={() => onClick(mission)}
      className={`bg-slate-800 border ${difficultyColor} border-opacity-50 p-6 rounded-xl cursor-pointer hover:scale-105 transition-all hover:shadow-2xl hover:bg-slate-750 group relative overflow-hidden`}
    >
      {/* Subtle glow effect on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-current ${difficultyColor.split(' ')[0]}`}></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
          {mission.title}
        </h3>
        <span className={`text-xs px-2 py-1 rounded border ${difficultyColor} bg-slate-900 font-mono`}>
          {mission.difficulty}
        </span>
      </div>
      <p className="text-slate-400 text-sm mb-4 line-clamp-3 relative z-10">
        {mission.description}
      </p>
      <div className="flex gap-2 mt-4 text-xs text-slate-500 relative z-10">
        <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700">Logic</span>
        <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700">Syntax</span>
      </div>
    </div>
  );
};

const FilterButton = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 ${
            active 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
        }`}
    >
        {label}
    </button>
);

const MissionSelect = ({ onSelectMission }) => {
  const [allMissions, setAllMissions] = useState([]);
  const [filteredMissions, setFilteredMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Easy', 'Medium', 'Hard'

  useEffect(() => {
    // Fetch missions from backend
    // NOTE: Assuming backend returns a FLAT list now (thanks to your main.py fix)
    axios.get('http://127.0.0.1:8000/missions?is_premium=true') // Use premium=true to fetch ALL levels to show
      .then(res => {
        setAllMissions(res.data);
        setFilteredMissions(res.data); // Initially show all
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch missions", err);
        setLoading(false);
      });
  }, []);

  // Filter Logic
  useEffect(() => {
    if (activeFilter === 'All') {
        setFilteredMissions(allMissions);
    } else {
        setFilteredMissions(allMissions.filter(m => m.difficulty === activeFilter));
    }
  }, [activeFilter, allMissions]);

  if (loading) return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
          <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-blue-500 rounded-full mb-4"></div>
              <p>Loading Deep Blue Protocol...</p>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 p-8 font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4 tracking-tight">
          DEEP BLUE PROTOCOL
        </h1>
        <p className="text-slate-400 text-lg">Select a simulation to begin your training.</p>
        
        {/* FILTER TABS */}
        <div className="flex justify-center gap-3 mt-8">
            {['All', 'Easy', 'Medium', 'Hard'].map(filter => (
                <FilterButton 
                    key={filter} 
                    label={filter} 
                    active={activeFilter === filter} 
                    onClick={() => setActiveFilter(filter)} 
                />
            ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {filteredMissions.length > 0 ? (
            filteredMissions.map(mission => (
            <MissionCard key={mission.id} mission={mission} onClick={onSelectMission} />
            ))
        ) : (
            <div className="col-span-full text-center text-slate-500 py-10">
                No missions found for this difficulty level.
            </div>
        )}
      </div>
    </div>
  );
};

export default MissionSelect;