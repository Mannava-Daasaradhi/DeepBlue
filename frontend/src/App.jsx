import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import MissionSelect from './components/MissionSelect';

function App() {
  const [currentScreen, setCurrentScreen] = useState('menu'); // 'menu' or 'dashboard'
  const [activeMission, setActiveMission] = useState(null);

  const handleStartMission = (mission) => {
    setActiveMission(mission);
    setCurrentScreen('dashboard');
  };

  const handleBackToMenu = () => {
    setActiveMission(null);
    setCurrentScreen('menu');
  };

  return (
    <>
      {currentScreen === 'menu' && (
        <MissionSelect onSelectMission={handleStartMission} />
      )}
      
      {currentScreen === 'dashboard' && (
        <Dashboard 
          initialCode={activeMission?.starter_code} 
          onBack={handleBackToMenu}
        />
      )}
    </>
  );
}

export default App;