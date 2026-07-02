import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaStore, FaUser, FaGem, FaCog } from 'react-icons/fa';
import { GiLockedDoor, GiDoorway } from 'react-icons/gi';
import { FaDoorOpen } from 'react-icons/fa';
import { useGame } from '../context/GameContext';
import PlayerProfile from './PlayerProfile';
import OrbUpgradePanel from './OrbUpgradePanel';

const Hallway: React.FC = () => {
  const navigate = useNavigate();
  const { currentSlot, keyBindings, stopPlaytimeTracking, refreshCurrentSlot } = useGame();
  const [selectedRoom, setSelectedRoom] = useState(currentSlot?.currentRoom || 1);
  const [showProfile, setShowProfile] = useState(false);
  const [showOrbUpgrade, setShowOrbUpgrade] = useState(false);

  useEffect(() => {
    if (!currentSlot) {
      navigate('/');
    }
  }, [currentSlot, navigate]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (showProfile || showOrbUpgrade) return;
    
    const key = e.key.toLowerCase();
    
    if (key === keyBindings.moveUp) {
      setSelectedRoom(prev => Math.max(1, prev - 1));
    } else if (key === keyBindings.moveDown) {
      setSelectedRoom(prev => Math.min(13, prev + 1));
    } else if (key === keyBindings.select || key === 'enter') {
      if (currentSlot && selectedRoom <= currentSlot.currentRoom) {
        navigate(`/charm-select/${selectedRoom}`);
      }
    } else if (key === 'escape') {
      handleGoToMenu();
    }
  }, [keyBindings, currentSlot, selectedRoom, navigate, showProfile, showOrbUpgrade]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleGoToMenu = () => {
    stopPlaytimeTracking();
    navigate('/');
  };

  const handleRoomClick = (roomNumber: number) => {
    if (currentSlot && roomNumber <= currentSlot.currentRoom) {
      setSelectedRoom(roomNumber);
      navigate(`/charm-select/${roomNumber}`);
    }
  };

  const getRoomStatus = (roomNumber: number): 'locked' | 'current' | 'cleared' => {
    if (!currentSlot) return 'locked';
    if (roomNumber > currentSlot.currentRoom) return 'locked';
    const record = currentSlot.roomClearRecords.find(r => r.roomNumber === roomNumber);
    if (record?.firstCleared) return 'cleared';
    return 'current';
  };

  if (!currentSlot) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col">
      {/* Top Bar - Fixed */}
      <div className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Left - Menu Button */}
          <button
            onClick={handleGoToMenu}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors"
          >
            <FaHome /> Main Menu
          </button>

          {/* Center - Title */}
          <h1 className="text-2xl font-bold text-slate-200">The Hallway</h1>

          {/* Right - Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOrbUpgrade(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded transition-colors"
            >
              <FaGem /> Upgrade
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors"
            >
              <FaStore /> Shop
            </button>
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors"
            >
              <FaUser /> {currentSlot.playerName}
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <FaCog size={20} />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="max-w-4xl mx-auto mt-3 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-red-400">❤️</span>
            <span className="text-slate-300">{currentSlot.totalHp} HP</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange-400">⚔️</span>
            <span className="text-slate-300">{currentSlot.totalAttack} ATK</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">🛡️</span>
            <span className="text-slate-300">{currentSlot.totalDefense} DEF</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">🪙</span>
            <span className="text-slate-300">{currentSlot.coins}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">💎</span>
            <span className="text-slate-300">{currentSlot.orbs} Orbs</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-300">✨</span>
            <span className="text-slate-300">{currentSlot.orbFragments} Fragments</span>
          </div>
        </div>
      </div>

      {/* Rooms List - Vertical */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-md mx-auto space-y-3">
          {[...Array(13)].map((_, i) => {
            const roomNumber = i + 1;
            const status = getRoomStatus(roomNumber);
            const isSelected = selectedRoom === roomNumber;
            const isBoss = roomNumber >= 7 && roomNumber <= 10;
            const isFinalBoss = roomNumber >= 11;

            return (
              <div
                key={roomNumber}
                onClick={() => status !== 'locked' && handleRoomClick(roomNumber)}
                onMouseEnter={() => status !== 'locked' && setSelectedRoom(roomNumber)}
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                  status === 'locked'
                    ? 'border-slate-700 bg-slate-800/40 cursor-not-allowed opacity-50'
                    : isSelected
                    ? 'border-blue-400 bg-slate-700/80 scale-102 shadow-lg shadow-blue-500/20 cursor-pointer'
                    : 'border-slate-600 bg-slate-800/60 hover:border-slate-500 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Room Icon */}
                  <div className={`text-3xl ${
                    status === 'locked' ? 'text-slate-600' :
                    status === 'cleared' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {status === 'locked' ? <GiLockedDoor /> :
                     status === 'cleared' ? <FaDoorOpen /> : <GiDoorway />}
                  </div>

                  {/* Room Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold ${
                        status === 'locked' ? 'text-slate-500' : 'text-slate-200'
                      }`}>
                        Room {roomNumber}
                      </h3>
                      {isFinalBoss && <span className="text-xs px-2 py-0.5 bg-red-900/50 text-red-400 rounded">FINAL BOSS</span>}
                      {isBoss && !isFinalBoss && <span className="text-xs px-2 py-0.5 bg-orange-900/50 text-orange-400 rounded">BOSS</span>}
                      {status === 'cleared' && <span className="text-xs px-2 py-0.5 bg-green-900/50 text-green-400 rounded">CLEARED</span>}
                    </div>
                    <p className="text-sm text-slate-500">
                      {status === 'locked' ? 'Locked' :
                       status === 'cleared' ? 'Replay for coins' : 'Ready to enter'}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  {status !== 'locked' && isSelected && (
                    <div className="text-blue-400">→</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls Hint */}
      <div className="sticky bottom-0 bg-slate-900/95 border-t border-slate-700 p-2 text-center text-slate-500 text-sm">
        Use {keyBindings.moveUp.toUpperCase()}/{keyBindings.moveDown.toUpperCase()} to navigate rooms, {keyBindings.select === ' ' ? 'SPACE' : keyBindings.select.toUpperCase()} to enter
      </div>

      {/* Player Profile Modal */}
      {showProfile && (
        <PlayerProfile 
          onClose={() => {
            setShowProfile(false);
            refreshCurrentSlot();
          }} 
        />
      )}

      {/* Orb Upgrade Modal */}
      {showOrbUpgrade && (
        <OrbUpgradePanel 
          onClose={() => {
            setShowOrbUpgrade(false);
            refreshCurrentSlot();
          }} 
        />
      )}
    </div>
  );
};

export default Hallway;
