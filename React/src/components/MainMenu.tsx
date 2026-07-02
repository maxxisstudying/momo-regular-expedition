import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaCog } from 'react-icons/fa';
import { useGame } from '../context/GameContext';
import { SaveSlotDto } from '../types';
import * as api from '../services/api';

const MainMenu: React.FC = () => {
  const navigate = useNavigate();
  const { saveSlots, loadSlots, selectSlot, keyBindings, selectedMenuIndex, setSelectedMenuIndex } = useGame();
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const [showNewGameInput, setShowNewGameInput] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [showModeSelect, setShowModeSelect] = useState<{ slot: number; name: string } | null>(null);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState(0);

  const formatPlaytime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleSlotClick = (slotNumber: number, slot: SaveSlotDto | null) => {
    if (slot) {
      selectSlot(slot);
      navigate('/mode-select');
    } else {
      setShowNewGameInput(slotNumber);
      setPlayerName('');
    }
  };

  const handleCreateGame = () => {
    if (playerName.trim() && showNewGameInput) {
      setShowModeSelect({ slot: showNewGameInput, name: playerName.trim() });
      setShowNewGameInput(null);
    }
  };

  const handleModeSelect = async (hardMode: boolean) => {
    if (showModeSelect) {
      try {
        const newSlot = await api.createNewGame(
          showModeSelect.slot,
          showModeSelect.name,
          hardMode
        );
        await loadSlots();
        selectSlot(newSlot);
        setShowModeSelect(null);
        navigate('/mode-select');
      } catch (error) {
        console.error('Failed to create game:', error);
      }
    }
  };

  const handleDelete = async (slotNumber: number) => {
    try {
      await api.deleteSlot(slotNumber);
      await loadSlots();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete slot:', error);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    
    if (showDeleteConfirm !== null) {
      if (key === keyBindings.moveLeft || key === keyBindings.moveRight) {
        setDeleteConfirmIndex(prev => prev === 0 ? 1 : 0);
      } else if (key === keyBindings.select || key === 'enter') {
        if (deleteConfirmIndex === 0) {
          handleDelete(showDeleteConfirm);
        } else {
          setShowDeleteConfirm(null);
        }
      }
      return;
    }

    if (showNewGameInput !== null) {
      if (key === 'escape') {
        setShowNewGameInput(null);
      } else if (key === 'enter') {
        handleCreateGame();
      }
      return;
    }

    if (showModeSelect !== null) {
      if (key === keyBindings.moveUp || key === keyBindings.moveDown) {
        // Toggle between normal and hard
      } else if (key === 'escape') {
        setShowModeSelect(null);
      }
      return;
    }

    if (key === keyBindings.moveLeft) {
      setSelectedMenuIndex(Math.max(0, selectedMenuIndex - 1));
    } else if (key === keyBindings.moveRight) {
      setSelectedMenuIndex(Math.min(2, selectedMenuIndex + 1));
    } else if (key === keyBindings.select || key === 'enter') {
      const slot = saveSlots[selectedMenuIndex];
      handleSlotClick(selectedMenuIndex + 1, slot);
    }
  }, [keyBindings, saveSlots, selectedMenuIndex, showDeleteConfirm, showNewGameInput, showModeSelect, deleteConfirmIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Dev Mode Button */}
      <button
        onClick={() => navigate('/dev-login')}
        className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
      >
        <FaCog size={24} />
      </button>

      {/* Settings Button */}
      <button
        onClick={() => navigate('/settings')}
        className="absolute top-4 right-16 text-slate-500 hover:text-slate-300 transition-colors"
      >
        Settings
      </button>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-slate-200 mb-2 tracking-wider">
        Momo's Regular Expedition
      </h1>
      <p className="text-slate-400 mb-12">A Turn-Based Adventure</p>

      {/* Save Slots */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {[1, 2, 3].map((slotNum) => {
          const slot = saveSlots[slotNum - 1];
          const isHovered = hoveredSlot === slotNum || selectedMenuIndex === slotNum - 1;

          return (
            <div key={slotNum} className="flex flex-col items-center">
              <div
                className={`w-64 h-80 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  isHovered
                    ? 'border-blue-400 bg-slate-700/80 scale-105 shadow-lg shadow-blue-500/20'
                    : 'border-slate-600 bg-slate-800/60'
                }`}
                onMouseEnter={() => setHoveredSlot(slotNum)}
                onMouseLeave={() => setHoveredSlot(null)}
                onClick={() => handleSlotClick(slotNum, slot)}
              >
                {slot ? (
                  <div className="p-4 h-full flex flex-col">
                    <div className="text-center mb-2">
                      <div className="w-16 h-16 mx-auto rounded-full bg-slate-600 flex items-center justify-center text-2xl">
                        {slot.profileImage ? (
                          <img src={slot.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          '👤'
                        )}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-200 text-center truncate">
                      {slot.playerName}
                    </h3>
                    {slot.hardMode && (
                      <span className="text-xs text-red-400 text-center">HARD MODE</span>
                    )}
                    <div className="mt-4 space-y-2 text-sm text-slate-400">
                      <p>Room: {slot.currentRoom} / 13</p>
                      <p>Coins: {slot.coins}</p>
                      <p>Orbs: {slot.orbs}</p>
                      <p>Playtime: {formatPlaytime(slot.playtimeSeconds)}</p>
                    </div>
                    <div className="mt-auto">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${(slot.highestRoomCleared / 13) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1 text-center">
                        Progress: {Math.round((slot.highestRoomCleared / 13) * 100)}%
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <span className="text-4xl mb-2">+</span>
                    <span>New Game</span>
                    <span className="text-xs mt-1">Slot {slotNum}</span>
                  </div>
                )}
              </div>

              {/* Delete Button */}
              {slot && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(slotNum);
                    setDeleteConfirmIndex(0);
                  }}
                  className="mt-2 px-4 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors flex items-center gap-1"
                >
                  <FaTrash size={12} /> Delete
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* New Game Input Modal */}
      {showNewGameInput !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-600 w-80">
            <h3 className="text-xl font-bold text-slate-200 mb-4">Enter Your Name</h3>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-slate-200 focus:outline-none focus:border-blue-500"
              placeholder="Player Name"
              maxLength={20}
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCreateGame}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
              >
                Continue
              </button>
              <button
                onClick={() => setShowNewGameInput(null)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode Select Modal */}
      {showModeSelect !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-600 w-80">
            <h3 className="text-xl font-bold text-slate-200 mb-4 text-center">Select Difficulty</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleModeSelect(false)}
                className="w-full px-4 py-3 bg-slate-700 hover:bg-blue-600 text-slate-200 rounded transition-colors"
              >
                Normal Mode
              </button>
              <button
                onClick={() => handleModeSelect(true)}
                className="w-full px-4 py-3 bg-slate-700 hover:bg-red-600 text-slate-200 rounded transition-colors"
              >
                Hard Mode
                <span className="block text-xs text-slate-400">Enemy HP & ATK x2</span>
              </button>
            </div>
            <button
              onClick={() => setShowModeSelect(null)}
              className="w-full mt-4 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-300 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-600 w-80">
            <h3 className="text-xl font-bold text-slate-200 mb-2">Delete Save?</h3>
            <p className="text-slate-400 mb-4">
              Are you sure you want to delete this save data? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className={`flex-1 px-4 py-2 rounded transition-colors ${
                  deleteConfirmIndex === 0
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-red-600 hover:text-white'
                }`}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className={`flex-1 px-4 py-2 rounded transition-colors ${
                  deleteConfirmIndex === 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                No, Keep
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainMenu;
