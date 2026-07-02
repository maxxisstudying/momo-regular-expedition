import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import MainMenu from './components/MainMenu';
import ModeSelect from './components/ModeSelect';
import Hallway from './components/Hallway';
import Shop from './components/Shop';
import CharmSelect from './components/CharmSelect';
import Battle from './components/Battle';
import Settings from './components/Settings';
import DevLogin from './auth/DevLogin';
import DevPanel from './auth/DevPanel';

const App: React.FC = () => {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/mode-select" element={<ModeSelect />} />
          <Route path="/hallway" element={<Hallway />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/charm-select/:roomNumber" element={<CharmSelect />} />
          <Route path="/battle/:roomNumber" element={<Battle />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/dev-login" element={<DevLogin />} />
          <Route path="/dev" element={<DevPanel />} />
        </Routes>
      </Router>
    </GameProvider>
  );
};

export default App;
