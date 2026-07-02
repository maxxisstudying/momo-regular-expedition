import React, { useState, useEffect } from 'react';
import { FaTimes, FaHeart, FaFistRaised, FaBolt } from 'react-icons/fa';
import { useGame } from '../context/GameContext';
import * as api from '../services/api';
import { UpgradeInfoResponse } from '../types';

interface OrbUpgradePanelProps {
  onClose: () => void;
}

const OrbUpgradePanel: React.FC<OrbUpgradePanelProps> = ({ onClose }) => {
  const { currentSlot, refreshCurrentSlot } = useGame();
  const [upgradeInfo, setUpgradeInfo] = useState<UpgradeInfoResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUpgradeInfo();
  }, [currentSlot]);

  const loadUpgradeInfo = async () => {
    if (currentSlot) {
      try {
        const info = await api.getUpgradeInfo(currentSlot.id);
        setUpgradeInfo(info);
      } catch (error) {
        console.error('Failed to load upgrade info:', error);
      }
    }
  };

  const handleUpgrade = async (type: 'HEALTH' | 'ATTACK' | 'CRIT_RATE') => {
    if (!currentSlot || loading) return;
    
    setLoading(true);
    try {
      await api.performUpgrade(currentSlot.id, type);
      await refreshCurrentSlot();
      await loadUpgradeInfo();
    } catch (error) {
      console.error('Failed to upgrade:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentSlot || !upgradeInfo) return null;

  const upgrades = [
    {
      type: 'HEALTH' as const,
      name: 'Health',
      icon: <FaHeart className="text-red-400" />,
      level: upgradeInfo.healthLevel,
      cost: upgradeInfo.healthCost,
      bonus: '+5 HP per level',
      color: 'red',
    },
    {
      type: 'ATTACK' as const,
      name: 'Attack',
      icon: <FaFistRaised className="text-orange-400" />,
      level: upgradeInfo.attackLevel,
      cost: upgradeInfo.attackCost,
      bonus: '+3 ATK per level',
      color: 'orange',
    },
    {
      type: 'CRIT_RATE' as const,
      name: 'Crit Rate',
      icon: <FaBolt className="text-yellow-400" />,
      level: upgradeInfo.critRateLevel,
      cost: upgradeInfo.critRateCost,
      bonus: '+0.5% Crit per level',
      color: 'yellow',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-600 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-slate-200">Orb Upgrades</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Current Orbs */}
        <div className="p-4 bg-purple-900/30 border-b border-slate-700">
          <p className="text-center">
            <span className="text-purple-400 text-2xl">💎</span>
            <span className="text-2xl font-bold text-purple-300 ml-2">{upgradeInfo.currentOrbs}</span>
            <span className="text-slate-400 ml-2">Orbs Available</span>
          </p>
        </div>

        {/* Upgrade Options */}
        <div className="p-4 space-y-4">
          {upgrades.map((upgrade) => {
            const canAfford = upgradeInfo.currentOrbs >= upgrade.cost;
            const isFree = upgrade.cost === 0;

            return (
              <div
                key={upgrade.type}
                className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{upgrade.icon}</span>
                    <div>
                      <h3 className="font-bold text-slate-200">{upgrade.name}</h3>
                      <p className="text-sm text-slate-400">Level {upgrade.level}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUpgrade(upgrade.type)}
                    disabled={!canAfford || loading}
                    className={`px-4 py-2 rounded font-bold transition-colors ${
                      canAfford
                        ? 'bg-purple-600 hover:bg-purple-500 text-white'
                        : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isFree ? 'FREE' : `${upgrade.cost} 💎`}
                  </button>
                </div>
                <p className="text-sm text-slate-400">{upgrade.bonus}</p>
                {upgrade.level >= 20 && (
                  <p className="text-xs text-purple-400 mt-1">Level 20+ requires 2 orbs per upgrade</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Info */}
        <div className="p-4 border-t border-slate-700 text-center text-sm text-slate-500">
          <p>First upgrade for each stat is FREE!</p>
          <p>After level 20, upgrades cost 2 orbs.</p>
        </div>
      </div>
    </div>
  );
};

export default OrbUpgradePanel;
