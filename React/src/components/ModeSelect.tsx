import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useGame } from '../context/GameContext';

const ModeSelect: React.FC = () => {
  const navigate = useNavigate();
  const { currentSlot, keyBindings, startPlaytimeTracking } = useGame();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!currentSlot) {
      navigate('/');
    }
  }, [currentSlot, navigate]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    
    if (key === keyBindings.moveUp || key === keyBindings.moveDown) {
      setSelectedIndex(prev => (prev === 0 ? 1 : 0));
    } else if (key === keyBindings.select || key === 'enter') {
      if (selectedIndex === 0) {
        startPlaytimeTracking();
        navigate('/hallway');
      }
      // selectedIndex === 1 is "Coming Soon"
    } else if (key === 'escape') {
      navigate('/');
    }
  }, [keyBindings, selectedIndex, navigate, startPlaytimeTracking]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!currentSlot) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2"
      >
        <FaArrowLeft /> Back
      </button>

      {/* Player Info */}
      <div className="absolute top-4 right-4 text-right text-slate-400">
        <p className="text-slate-200 font-bold">{currentSlot.playerName}</p>
        <p className="text-sm">Room {currentSlot.currentRoom} / 13</p>
        {currentSlot.hardMode && <p className="text-xs text-red-400">HARD MODE</p>}
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-slate-200 mb-8">Select Mode</h1>

      {/* Mode Options */}
      <div className="space-y-4 w-64">
        {/* Story Mode */}
        <button
          onClick={() => {
            startPlaytimeTracking();
            navigate('/hallway');
          }}
          onMouseEnter={() => setSelectedIndex(0)}
          className={`w-full p-6 rounded-lg border-2 transition-all duration-200 ${
            selectedIndex === 0
              ? 'border-blue-400 bg-slate-700/80 scale-105 shadow-lg shadow-blue-500/20'
              : 'border-slate-600 bg-slate-800/60 hover:border-slate-500'
          }`}
        >
          <h2 className="text-xl font-bold text-slate-200">Story Mode</h2>
          <p className="text-sm text-slate-400 mt-1">
            Journey through 13 rooms of adventure
          </p>
        </button>

        {/* Endless Mode (Coming Soon) */}
        <button
          disabled
          onMouseEnter={() => setSelectedIndex(1)}
          className={`w-full p-6 rounded-lg border-2 transition-all duration-200 cursor-not-allowed opacity-60 ${
            selectedIndex === 1
              ? 'border-slate-500 bg-slate-700/40'
              : 'border-slate-700 bg-slate-800/40'
          }`}
        >
          <h2 className="text-xl font-bold text-slate-500">Endless Mode</h2>
          <p className="text-sm text-slate-500 mt-1">Coming Soon</p>
        </button>
      </div>

      {/* Controls Hint */}
      <div className="absolute bottom-4 text-slate-500 text-sm">
        <p>Use {keyBindings.moveUp.toUpperCase()}/{keyBindings.moveDown.toUpperCase()} to navigate, {keyBindings.select === ' ' ? 'SPACE' : keyBindings.select.toUpperCase()} to select</p>
      </div>
    </div>
  );
};

export default ModeSelect;
