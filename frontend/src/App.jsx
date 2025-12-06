import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import MissionSelect from './components/MissionSelect';
import LoginModal from './components/LoginModal';

function App() {
  const [user, setUser] = useState(null); // { id, username, is_premium }
  const [currentScreen, setCurrentScreen] = useState('menu'); 
  const [activeMission, setActiveMission] = useState(null);

  // Check LocalStorage on load
  useEffect(() => {
    const savedUser = localStorage.getItem('deepblue_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('deepblue_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('deepblue_user');
    setCurrentScreen('menu');
  };

  const handleStartMission = (mission) => {
    setActiveMission(mission);
    setCurrentScreen('dashboard');
  };

  const handleBackToMenu = () => {
    setActiveMission(null);
    setCurrentScreen('menu');
  };

  // If not logged in, show Modal
  if (!user) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return (
    <>
      {/* Global Header (Optional) */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
        <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">
          CMD: <span className="text-blue-400">{user.username}</span>
        </span>
        <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300">
          LOGOUT
        </button>
      </div>

      {currentScreen === 'menu' && (
        <MissionSelect onSelectMission={handleStartMission} />
      )}
      
      {currentScreen === 'dashboard' && (
        <Dashboard 
          user={user} // Pass Real User Data
          initialCode={activeMission?.starter_code} 
          missionId={activeMission?.id}
          missionDesc={activeMission?.description}
          onBack={handleBackToMenu}
        />
      )}
    </>
  );
}

export default App;