import React, { useState } from 'react';
import MissionSelect from './MissionSelect';
import ProblemList from './problems/ProblemList';

const MainMenu = ({ user, onSelectMission, onLogout }) => {
  const [viewMode, setViewMode] = useState('missions'); 

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        
        {/* Logo Area */}
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tracking-tight">
            DEEP BLUE
          </h1>

          {/* View Switcher Tabs */}
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setViewMode('missions')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                viewMode === 'missions'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              🚀 Missions
            </button>
            <button
              onClick={() => setViewMode('problems')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                viewMode === 'problems'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              Problems
            </button>
          </div>
        </div>

        {/* User Profile / Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs text-slate-500 uppercase font-bold">Commander</span>
            <span className="text-sm text-blue-300 font-mono">{user.username}</span>
          </div>
          <button 
            onClick={onLogout}
            className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 relative">
        {viewMode === 'missions' ? (
          <div className="animate-fade-in">
             <MissionSelect onSelectMission={onSelectMission} />
          </div>
        ) : (
          <div className="animate-fade-in">
            <ProblemList user={user} onSelectMission={onSelectMission} />
          </div>
        )}
      </div>

    </div>
  );
};

export default MainMenu;