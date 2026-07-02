import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrash, FaSave, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useGame } from '../context/GameContext';
import { ShopItemDto, EnemyDto, RoomRewardDto, GameConfigDto } from '../types';
import * as api from '../services/api';

type TabType = 'enemies' | 'shop' | 'rewards' | 'config';

const DevPanel: React.FC = () => {
  const navigate = useNavigate();
  const { isDevAuthenticated, setDevAuthenticated } = useGame();

  const [activeTab, setActiveTab] = useState<TabType>('enemies');
  const [enemies, setEnemies] = useState<EnemyDto[]>([]);
  const [shopItems, setShopItems] = useState<ShopItemDto[]>([]);
  const [rewards, setRewards] = useState<RoomRewardDto[]>([]);
  const [configs, setConfigs] = useState<GameConfigDto[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isDevAuthenticated) {
      navigate('/dev-login');
      return;
    }
    loadData();
  }, [isDevAuthenticated, navigate]);

  const loadData = async () => {
    try {
      const [enemyData, shopData, rewardData, configData] = await Promise.all([
        api.getAllEnemies(),
        api.getAllShopItemsAdmin(),
        api.getAllRewards(),
        api.getAllConfigs(),
      ]);
      setEnemies(enemyData);
      setShopItems(shopData);
      setRewards(rewardData);
      setConfigs(configData);
    } catch (error) {
      console.error('Failed to load dev data:', error);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleLogout = () => {
    setDevAuthenticated(false);
    navigate('/');
  };

  // Enemy handlers
  const updateEnemy = (id: number, field: keyof EnemyDto, value: any) => {
    setEnemies(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const saveEnemy = async (enemy: EnemyDto) => {
    setSaving(true);
    try {
      await api.updateEnemy(enemy);
    } catch (error) {
      console.error('Failed to save enemy:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteEnemy = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enemy?')) return;
    try {
      await api.deleteEnemy(id);
      setEnemies(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error('Failed to delete enemy:', error);
    }
  };

  // Shop item handlers
  const updateShopItem = (id: number, field: keyof ShopItemDto, value: any) => {
    setShopItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const saveShopItem = async (item: ShopItemDto) => {
    setSaving(true);
    try {
      await api.updateShopItem(item);
    } catch (error) {
      console.error('Failed to save shop item:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteShopItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.deleteShopItem(id);
      setShopItems(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      console.error('Failed to delete shop item:', error);
    }
  };

  // Reward handlers
  const updateReward = (id: number, field: keyof RoomRewardDto, value: any) => {
    setRewards(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const saveReward = async (reward: RoomRewardDto) => {
    setSaving(true);
    try {
      await api.updateReward(reward);
    } catch (error) {
      console.error('Failed to save reward:', error);
    } finally {
      setSaving(false);
    }
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: 'enemies', label: 'Enemies' },
    { key: 'shop', label: 'Shop Items' },
    { key: 'rewards', label: 'Room Rewards' },
    { key: 'config', label: 'Game Config' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <FaArrowLeft /> Back to Menu
          </button>
          <h1 className="text-2xl font-bold text-slate-200">Dev Panel</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto mt-4 flex gap-2 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-t font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-slate-700 text-slate-200 border-b-2 border-blue-500'
                  : 'bg-slate-800/50 text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Enemies Tab */}
          {activeTab === 'enemies' && (
            <div className="space-y-4">
              {enemies.map(enemy => (
                <div key={enemy.id} className="bg-slate-800/60 border border-slate-600 rounded-lg overflow-hidden">
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-700/50"
                    onClick={() => toggleExpand(enemy.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{enemy.spriteImage || '👹'}</span>
                      <div>
                        <h3 className="font-bold text-slate-200">Room {enemy.roomNumber}: {enemy.name}</h3>
                        <p className="text-sm text-slate-400">HP: {enemy.hp} | ATK: {enemy.attack} | DEF: {enemy.defense}</p>
                      </div>
                    </div>
                    {expandedItems.has(enemy.id) ? <FaChevronUp /> : <FaChevronDown />}
                  </div>

                  {expandedItems.has(enemy.id) && (
                    <div className="p-4 border-t border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs text-slate-400">Name</label>
                        <input
                          type="text"
                          value={enemy.name}
                          onChange={(e) => updateEnemy(enemy.id, 'name', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">HP</label>
                        <input
                          type="number"
                          value={enemy.hp}
                          onChange={(e) => updateEnemy(enemy.id, 'hp', parseInt(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Attack</label>
                        <input
                          type="number"
                          value={enemy.attack}
                          onChange={(e) => updateEnemy(enemy.id, 'attack', parseInt(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Defense</label>
                        <input
                          type="number"
                          value={enemy.defense}
                          onChange={(e) => updateEnemy(enemy.id, 'defense', parseInt(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Reduce Dmg Chance %</label>
                        <input
                          type="number"
                          value={enemy.reduceDamageChance}
                          onChange={(e) => updateEnemy(enemy.id, 'reduceDamageChance', parseFloat(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Crit Chance %</label>
                        <input
                          type="number"
                          value={enemy.critChance}
                          onChange={(e) => updateEnemy(enemy.id, 'critChance', parseFloat(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-slate-400">Dmg Reduction Options (JSON)</label>
                        <input
                          type="text"
                          value={enemy.damageReductionOptions}
                          onChange={(e) => updateEnemy(enemy.id, 'damageReductionOptions', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-slate-400">Crit Dmg Options (JSON)</label>
                        <input
                          type="text"
                          value={enemy.critDamageOptions}
                          onChange={(e) => updateEnemy(enemy.id, 'critDamageOptions', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                        />
                      </div>
                      <div className="col-span-4 flex justify-end gap-2">
                        <button
                          onClick={() => deleteEnemy(enemy.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-sm flex items-center gap-1"
                        >
                          <FaTrash /> Delete
                        </button>
                        <button
                          onClick={() => saveEnemy(enemy)}
                          disabled={saving}
                          className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-sm flex items-center gap-1"
                        >
                          <FaSave /> Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Shop Items Tab */}
          {activeTab === 'shop' && (
            <div className="space-y-4">
              {shopItems.map(item => (
                <div key={item.id} className="bg-slate-800/60 border border-slate-600 rounded-lg overflow-hidden">
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-700/50"
                    onClick={() => toggleExpand(item.id + 10000)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.iconImage || '📦'}</span>
                      <div>
                        <h3 className="font-bold text-slate-200">{item.name}</h3>
                        <p className="text-sm text-slate-400">{item.category} | {item.priceCoin} coins</p>
                      </div>
                    </div>
                    {expandedItems.has(item.id + 10000) ? <FaChevronUp /> : <FaChevronDown />}
                  </div>

                  {expandedItems.has(item.id + 10000) && (
                    <div className="p-4 border-t border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs text-slate-400">Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateShopItem(item.id, 'name', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Category</label>
                        <select
                          value={item.category}
                          onChange={(e) => updateShopItem(item.id, 'category', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                        >
                          <option value="WEAPON">WEAPON</option>
                          <option value="DEFENSE">DEFENSE</option>
                          <option value="POTION">POTION</option>
                          <option value="CHARM">CHARM</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Price (Coins)</label>
                        <input
                          type="number"
                          value={item.priceCoin}
                          onChange={(e) => updateShopItem(item.id, 'priceCoin', parseInt(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Attack Bonus</label>
                        <input
                          type="number"
                          value={item.attackBonus}
                          onChange={(e) => updateShopItem(item.id, 'attackBonus', parseInt(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Defense Bonus</label>
                        <input
                          type="number"
                          value={item.defenseBonus}
                          onChange={(e) => updateShopItem(item.id, 'defenseBonus', parseInt(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">HP Bonus</label>
                        <input
                          type="number"
                          value={item.hpBonus}
                          onChange={(e) => updateShopItem(item.id, 'hpBonus', parseInt(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Heal Amount</label>
                        <input
                          type="number"
                          value={item.healAmount}
                          onChange={(e) => updateShopItem(item.id, 'healAmount', parseInt(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Special Effect</label>
                        <input
                          type="text"
                          value={item.specialEffect || ''}
                          onChange={(e) => updateShopItem(item.id, 'specialEffect', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-slate-400">Description</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => updateShopItem(item.id, 'description', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm h-20"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item.active}
                          onChange={(e) => updateShopItem(item.id, 'active', e.target.checked)}
                        />
                        <span className="text-sm text-slate-300">Active</span>
                      </div>
                      <div className="col-span-4 flex justify-end gap-2">
                        <button
                          onClick={() => deleteShopItem(item.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-sm flex items-center gap-1"
                        >
                          <FaTrash /> Delete
                        </button>
                        <button
                          onClick={() => saveShopItem(item)}
                          disabled={saving}
                          className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-sm flex items-center gap-1"
                        >
                          <FaSave /> Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Rewards Tab */}
          {activeTab === 'rewards' && (
            <div className="space-y-4">
              {rewards.map(reward => (
                <div key={reward.id} className="bg-slate-800/60 border border-slate-600 rounded-lg p-4">
                  <h3 className="font-bold text-slate-200 mb-3">Room {reward.roomNumber}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs text-slate-400">First Clear Coins</label>
                      <input
                        type="number"
                        value={reward.firstClearCoins}
                        onChange={(e) => updateReward(reward.id, 'firstClearCoins', parseInt(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">First Clear Orbs</label>
                      <input
                        type="number"
                        value={reward.firstClearOrbs}
                        onChange={(e) => updateReward(reward.id, 'firstClearOrbs', parseInt(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Replay Coins</label>
                      <input
                        type="number"
                        value={reward.replayCoins}
                        onChange={(e) => updateReward(reward.id, 'replayCoins', parseInt(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Replay Fragments</label>
                      <input
                        type="number"
                        value={reward.replayOrbFragments}
                        onChange={(e) => updateReward(reward.id, 'replayOrbFragments', parseInt(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => saveReward(reward)}
                      disabled={saving}
                      className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-sm flex items-center gap-1"
                    >
                      <FaSave /> Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Config Tab */}
          {activeTab === 'config' && (
            <div className="space-y-4">
              {configs.map(config => (
                <div key={config.id} className="bg-slate-800/60 border border-slate-600 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-200">{config.configKey}</h3>
                      <p className="text-xs text-slate-500">{config.description}</p>
                    </div>
                    <input
                      type="text"
                      value={config.configValue}
                      onChange={(e) => {
                        setConfigs(prev => prev.map(c =>
                          c.id === config.id ? { ...c, configValue: e.target.value } : c
                        ));
                      }}
                      className="w-40 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-200 text-sm"
                    />
                    <button
                      onClick={async () => {
                        setSaving(true);
                        try {
                          await api.updateConfig(config);
                        } catch (e) {
                          console.error(e);
                        } finally {
                          setSaving(false);
                        }
                      }}
                      disabled={saving}
                      className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-sm"
                    >
                      <FaSave />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevPanel;
