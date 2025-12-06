import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import MainMenu from './components/MainMenu'; // Use MainMenu instead of direct MissionSelect
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

  // Add this function to update user state after upgrade (if needed)
  const handleUserUpgrade = () => {
      const updatedUser = { ...user, is_premium: true };
      setUser(updatedUser);
      localStorage.setItem('deepblue_user', JSON.stringify(updatedUser));
  };

  // If not logged in, show Modal
  if (!user) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return (
    <>
      {/* Note: Global Header removed. MainMenu handles navigation. */}

      {currentScreen === 'menu' && (
        <MainMenu 
          user={user} 
          onSelectMission={handleStartMission} 
          onLogout={handleLogout}
        />
      )}
      
      {currentScreen === 'dashboard' && (
        <Dashboard 
          user={user} 
          initialCode={activeMission?.starter_code} 
          missionId={activeMission?.id}
          missionDesc={activeMission?.description}
          onBack={handleBackToMenu}
          onUpgrade={handleUserUpgrade}
        />
      )}
    </>
  );
}

export default App;