import React, { useState, useRef } from 'react';
import { FaTimes, FaEdit, FaCheck, FaTimes as FaCancel } from 'react-icons/fa';
import { useGame } from '../context/GameContext';
import * as api from '../services/api';

interface PlayerProfileProps {
  onClose: () => void;
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({ onClose }) => {
  const { currentSlot, refreshCurrentSlot } = useGame();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(currentSlot?.playerName || '');
  const [showWeaponSelect, setShowWeaponSelect] = useState(false);
  const [showDefenseSelect, setShowDefenseSelect] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentSlot) return null;

  const formatPlaytime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const handleNameSave = async () => {
    if (newName.trim() && currentSlot) {
      try {
        await api.updatePlayerName(currentSlot.id, newName.trim());
        await refreshCurrentSlot();
        setIsEditingName(false);
      } catch (error) {
        console.error('Failed to update name:', error);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentSlot) {
      // For demo, we'll use a base64 data URL
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          await api.updateProfileImage(currentSlot.id, reader.result as string);
          await refreshCurrentSlot();
        } catch (error) {
          console.error('Failed to update profile image:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEquipWeapon = async (itemId: number | null) => {
    if (currentSlot) {
      try {
        await api.equipItem(currentSlot.id, 'WEAPON', itemId);
        await refreshCurrentSlot();
        setShowWeaponSelect(false);
      } catch (error) {
        console.error('Failed to equip weapon:', error);
      }
    }
  };

  const handleEquipDefense = async (itemId: number | null) => {
    if (currentSlot) {
      try {
        await api.equipItem(currentSlot.id, 'DEFENSE', itemId);
        await refreshCurrentSlot();
        setShowDefenseSelect(false);
      } catch (error) {
        console.error('Failed to equip defense:', error);
      }
    }
  };

  const ownedWeapons = currentSlot.items.filter(
    item => item.shopItem?.category === 'WEAPON'
  );
  const ownedDefense = currentSlot.items.filter(
    item => item.shopItem?.category === 'DEFENSE'
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-600 w-full max-w-lg max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-slate-200">Player Profile</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Profile Image & Name */}
          <div className="flex items-start gap-4">
            {/* Profile Image */}
            <div className="relative group">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-4xl cursor-pointer overflow-hidden border-2 border-slate-600 hover:border-blue-500 transition-colors"
              >
                {currentSlot.profileImage ? (
                  <img src={currentSlot.profileImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  '👤'
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <span className="text-xs text-white">Change</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Name & Edit */}
            <div className="flex-1">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 px-3 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 focus:outline-none focus:border-blue-500"
                    maxLength={20}
                    autoFocus
                  />
                  <button onClick={handleNameSave} className="text-green-400 hover:text-green-300">
                    <FaCheck />
                  </button>
                  <button onClick={() => setIsEditingName(false)} className="text-red-400 hover:text-red-300">
                    <FaCancel />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-slate-200">{currentSlot.playerName}</h3>
                  <button
                    onClick={() => {
                      setNewName(currentSlot.playerName);
                      setIsEditingName(true);
                    }}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    <FaEdit />
                  </button>
                </div>
              )}
              {currentSlot.hardMode && (
                <span className="text-sm text-red-400">HARD MODE</span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-700/50 p-3 rounded">
              <p className="text-sm text-slate-400">HP</p>
              <p className="text-xl font-bold text-red-400">{currentSlot.totalHp}</p>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <p className="text-sm text-slate-400">Attack</p>
              <p className="text-xl font-bold text-orange-400">{currentSlot.totalAttack}</p>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <p className="text-sm text-slate-400">Defense</p>
              <p className="text-xl font-bold text-blue-400">{currentSlot.totalDefense}</p>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <p className="text-sm text-slate-400">Crit Rate</p>
              <p className="text-xl font-bold text-yellow-400">{currentSlot.playerCritRate.toFixed(1)}%</p>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <p className="text-sm text-slate-400">Coins</p>
              <p className="text-xl font-bold text-yellow-500">{currentSlot.coins}</p>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <p className="text-sm text-slate-400">Orbs</p>
              <p className="text-xl font-bold text-purple-400">{currentSlot.orbs}</p>
            </div>
          </div>

          {/* Playtime */}
          <div className="bg-slate-700/50 p-3 rounded">
            <p className="text-sm text-slate-400">Total Playtime</p>
            <p className="text-lg font-bold text-slate-200">{formatPlaytime(currentSlot.playtimeSeconds)}</p>
          </div>

          {/* Equipment */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-300">Equipment</h4>
            
            {/* Weapon */}
            <div
              onClick={() => setShowWeaponSelect(true)}
              className="p-3 bg-slate-700/50 rounded cursor-pointer hover:bg-slate-700 transition-colors"
            >
              <p className="text-sm text-slate-400">Weapon</p>
              {currentSlot.equippedWeapon ? (
                <p className="text-slate-200">{currentSlot.equippedWeapon.name} (+{currentSlot.equippedWeapon.attackBonus} ATK)</p>
              ) : (
                <p className="text-slate-500">None equipped - Click to equip</p>
              )}
            </div>

            {/* Defense */}
            <div
              onClick={() => setShowDefenseSelect(true)}
              className="p-3 bg-slate-700/50 rounded cursor-pointer hover:bg-slate-700 transition-colors"
            >
              <p className="text-sm text-slate-400">Defense</p>
              {currentSlot.equippedDefense ? (
                <p className="text-slate-200">{currentSlot.equippedDefense.name} (+{currentSlot.equippedDefense.defenseBonus} DEF)</p>
              ) : (
                <p className="text-slate-500">None equipped - Click to equip</p>
              )}
            </div>
          </div>
        </div>

        {/* Weapon Select Modal */}
        {showWeaponSelect && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-lg border border-slate-600 w-full max-w-sm">
              <div className="p-3 border-b border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-slate-200">Select Weapon</h3>
                <button onClick={() => setShowWeaponSelect(false)} className="text-slate-400 hover:text-slate-200">
                  <FaTimes />
                </button>
              </div>
              <div className="p-3 space-y-2 max-h-60 overflow-auto">
                <button
                  onClick={() => handleEquipWeapon(null)}
                  className="w-full p-2 text-left bg-slate-700/50 hover:bg-slate-700 rounded text-slate-300"
                >
                  None (Unequip)
                </button>
                {ownedWeapons.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleEquipWeapon(item.shopItemId)}
                    className={`w-full p-2 text-left rounded ${
                      currentSlot.equippedWeaponId === item.shopItemId
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700/50 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {item.shopItem?.name} (+{item.shopItem?.attackBonus} ATK)
                  </button>
                ))}
                {ownedWeapons.length === 0 && (
                  <p className="text-slate-500 text-center py-4">No weapons owned</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Defense Select Modal */}
        {showDefenseSelect && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-lg border border-slate-600 w-full max-w-sm">
              <div className="p-3 border-b border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-slate-200">Select Defense</h3>
                <button onClick={() => setShowDefenseSelect(false)} className="text-slate-400 hover:text-slate-200">
                  <FaTimes />
                </button>
              </div>
              <div className="p-3 space-y-2 max-h-60 overflow-auto">
                <button
                  onClick={() => handleEquipDefense(null)}
                  className="w-full p-2 text-left bg-slate-700/50 hover:bg-slate-700 rounded text-slate-300"
                >
                  None (Unequip)
                </button>
                {ownedDefense.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleEquipDefense(item.shopItemId)}
                    className={`w-full p-2 text-left rounded ${
                      currentSlot.equippedDefenseId === item.shopItemId
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700/50 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {item.shopItem?.name} (+{item.shopItem?.defenseBonus} DEF)
                  </button>
                ))}
                {ownedDefense.length === 0 && (
                  <p className="text-slate-500 text-center py-4">No defense items owned</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerProfile;
