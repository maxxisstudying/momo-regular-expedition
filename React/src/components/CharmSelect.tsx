import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import { useGame } from '../context/GameContext';
import { PlayerItemDto } from '../types';
import * as api from '../services/api';

const CharmSelect: React.FC = () => {
  const navigate = useNavigate();
  const { roomNumber } = useParams<{ roomNumber: string }>();
  const { currentSlot, refreshCurrentSlot } = useGame();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [ownedCharms, setOwnedCharms] = useState<PlayerItemDto[]>([]);

  useEffect(() => {
    if (!currentSlot) {
      navigate('/');
      return;
    }
    loadOwnedCharms();
  }, [currentSlot, navigate]);

  const loadOwnedCharms = async () => {
    if (currentSlot) {
      try {
        const charms = await api.getPlayerItemsByCategory(currentSlot.id, 'CHARM');
        setOwnedCharms(charms);
      } catch (error) {
        console.error('Failed to load charms:', error);
      }
    }
  };

  const handleEquipCharm = async (charmItemId: number | null) => {
    if (!currentSlot || selectedSlot === null) return;

    try {
      await api.setCharm(currentSlot.id, selectedSlot, charmItemId);
      await refreshCurrentSlot();
      setSelectedSlot(null);
    } catch (error) {
      console.error('Failed to equip charm:', error);
    }
  };

  const handleStartBattle = () => {
    navigate(`/battle/${roomNumber}`);
  };

  if (!currentSlot) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/hallway')}
        className="absolute top-4 left-4 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2"
      >
        <FaArrowLeft /> Back
      </button>

      <h1 className="text-3xl font-bold text-slate-200 mb-2">Prepare for Battle</h1>
      <p className="text-slate-400 mb-8">Room {roomNumber}</p>

      {/* Charm Slots */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-300 mb-4 text-center">Equip Charms (Up to 3)</h2>
        <div className="flex gap-4">
          {[1, 2, 3].map(slotIndex => {
            const charmSlot = currentSlot.charmSlots.find(cs => cs.slotIndex === slotIndex);
            const charm = charmSlot?.charmItem;

            return (
              <div
                key={slotIndex}
                onClick={() => setSelectedSlot(slotIndex)}
                className={`w-24 h-24 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center justify-center ${
                  selectedSlot === slotIndex
                    ? 'border-blue-400 bg-slate-700/80 scale-105'
                    : 'border-slate-600 bg-slate-800/60 hover:border-slate-500'
                }`}
              >
                {charm ? (
                  <>
                    <span className="text-2xl">{charm.iconImage || '✨'}</span>
                    <span className="text-xs text-slate-300 mt-1 text-center px-1 truncate w-full">
                      {charm.name}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl text-slate-600">+</span>
                    <span className="text-xs text-slate-500">Slot {slotIndex}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Charm Selection Modal */}
      {selectedSlot !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg border border-slate-600 w-full max-w-sm max-h-[70vh] overflow-auto">
            <div className="p-3 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-slate-800">
              <h3 className="font-bold text-slate-200">Select Charm for Slot {selectedSlot}</h3>
              <button onClick={() => setSelectedSlot(null)} className="text-slate-400 hover:text-slate-200">
                <FaTimes />
              </button>
            </div>
            <div className="p-3 space-y-2">
              <button
                onClick={() => handleEquipCharm(null)}
                className="w-full p-3 text-left bg-slate-700/50 hover:bg-slate-700 rounded text-slate-300"
              >
                None (Remove Charm)
              </button>
              {ownedCharms.map(item => {
                const isEquipped = currentSlot.charmSlots.some(
                  cs => cs.charmItemId === item.shopItemId && cs.slotIndex !== selectedSlot
                );
                const isCurrentSlot = currentSlot.charmSlots.find(
                  cs => cs.slotIndex === selectedSlot
                )?.charmItemId === item.shopItemId;

                return (
                  <button
                    key={item.id}
                    onClick={() => !isEquipped && handleEquipCharm(item.shopItemId)}
                    disabled={isEquipped}
                    className={`w-full p-3 text-left rounded ${
                      isCurrentSlot
                        ? 'bg-blue-600 text-white'
                        : isEquipped
                        ? 'bg-slate-700/30 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-700/50 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.shopItem?.iconImage || '✨'}</span>
                      <span>{item.shopItem?.name}</span>
                      {isEquipped && <span className="text-xs">(In another slot)</span>}
                    </div>
                    {item.shopItem?.description && (
                      <p className="text-xs text-slate-400 mt-1">{item.shopItem.description}</p>
                    )}
                  </button>
                );
              })}
              {ownedCharms.length === 0 && (
                <p className="text-slate-500 text-center py-4">
                  No charms owned. Buy some from the shop!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Current Stats */}
      <div className="mb-8 p-4 bg-slate-800/60 rounded-lg border border-slate-600">
        <h3 className="font-bold text-slate-300 mb-2 text-center">Your Stats</h3>
        <div className="flex gap-6 text-sm">
          <div className="text-center">
            <p className="text-red-400 text-xl font-bold">{currentSlot.totalHp}</p>
            <p className="text-slate-500">HP</p>
          </div>
          <div className="text-center">
            <p className="text-orange-400 text-xl font-bold">{currentSlot.totalAttack}</p>
            <p className="text-slate-500">ATK</p>
          </div>
          <div className="text-center">
            <p className="text-blue-400 text-xl font-bold">{currentSlot.totalDefense}</p>
            <p className="text-slate-500">DEF</p>
          </div>
          <div className="text-center">
            <p className="text-yellow-400 text-xl font-bold">{currentSlot.playerCritRate.toFixed(1)}%</p>
            <p className="text-slate-500">CRIT</p>
          </div>
        </div>
      </div>

      {/* Start Battle Button */}
      <button
        onClick={handleStartBattle}
        className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white text-xl font-bold rounded-lg transition-colors shadow-lg shadow-red-500/30"
      >
        Enter Room {roomNumber}
      </button>
    </div>
  );
};

export default CharmSelect;
