import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaMinus, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useGame } from '../context/GameContext';
import { ShopItemDto } from '../types';
import * as api from '../services/api';

type TabType = 'WEAPON' | 'DEFENSE' | 'POTION' | 'CHARM' | 'TRADING';

const Shop: React.FC = () => {
  const navigate = useNavigate();
  const { currentSlot, refreshCurrentSlot, shopItems, loadShopItems } = useGame();
  const [activeTab, setActiveTab] = useState<TabType>('WEAPON');
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [tradeQuantity, setTradeQuantity] = useState({ fragments: 1, coins: 1 });
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (!currentSlot) {
      navigate('/');
    }
    loadShopItems();
  }, [currentSlot, navigate, loadShopItems]);

  const getItemsByCategory = (category: TabType): ShopItemDto[] => {
    return shopItems.filter(item => item.category === category && item.active);
  };

  const getQuantity = (itemId: number): number => {
    return quantities[itemId] || 1;
  };

  const setQuantity = (itemId: number, qty: number) => {
    setQuantities(prev => ({ ...prev, [itemId]: Math.max(1, qty) }));
  };

  const toggleDescription = (itemId: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handlePurchase = async (item: ShopItemDto) => {
    if (!currentSlot || purchasing) return;

    const qty = item.permanent ? 1 : getQuantity(item.id);
    const totalCost = item.priceCoin * qty;

    if (currentSlot.coins < totalCost) {
      alert('Not enough coins!');
      return;
    }

    // Check if already owns permanent item
    if (item.permanent) {
      const alreadyOwns = currentSlot.items.some(pi => pi.shopItemId === item.id);
      if (alreadyOwns) {
        alert('You already own this item!');
        return;
      }
    }

    setPurchasing(true);
    try {
      await api.purchaseItem(currentSlot.id, item.id, qty);
      await refreshCurrentSlot();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  const handleTrade = async (type: 'FRAGMENTS_TO_ORB' | 'COINS_TO_ORB') => {
    if (!currentSlot || purchasing) return;

    const qty = type === 'FRAGMENTS_TO_ORB' ? tradeQuantity.fragments : tradeQuantity.coins;

    setPurchasing(true);
    try {
      await api.performTrade(currentSlot.id, type, qty);
      await refreshCurrentSlot();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Trade failed');
    } finally {
      setPurchasing(false);
    }
  };

  const isOwned = (itemId: number): boolean => {
    return currentSlot?.items.some(pi => pi.shopItemId === itemId) || false;
  };

  const getOwnedQuantity = (itemId: number): number => {
    const playerItem = currentSlot?.items.find(pi => pi.shopItemId === itemId);
    return playerItem?.quantity || 0;
  };

  if (!currentSlot) return null;

  const tabs: { key: TabType; label: string }[] = [
    { key: 'WEAPON', label: 'Weapons' },
    { key: 'DEFENSE', label: 'Defense' },
    { key: 'POTION', label: 'Potions' },
    { key: 'CHARM', label: 'Charms' },
    { key: 'TRADING', label: 'Trading' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/hallway')}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <FaArrowLeft /> Back to Hallway
          </button>
          <h1 className="text-2xl font-bold text-slate-200">Shop</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-yellow-400">🪙 {currentSlot.coins}</span>
            <span className="text-purple-400">💎 {currentSlot.orbs}</span>
            <span className="text-purple-300">✨ {currentSlot.orbFragments}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto mt-4 flex gap-2 overflow-x-auto">
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
        <div className="max-w-4xl mx-auto">
          {activeTab === 'TRADING' ? (
            /* Trading Tab */
            <div className="space-y-4">
              {/* Fragments to Orb */}
              <div className="bg-slate-800/60 border border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-200">Orb Fragments → Orb</h3>
                    <p className="text-sm text-slate-400">Exchange 10 fragments for 1 orb</p>
                    <p className="text-xs text-slate-500 mt-1">You have: {currentSlot.orbFragments} fragments</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTradeQuantity(prev => ({ ...prev, fragments: Math.max(1, prev.fragments - 1) }))}
                        className="w-8 h-8 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
                      >
                        <FaMinus className="mx-auto" />
                      </button>
                      <input
                        type="number"
                        value={tradeQuantity.fragments}
                        onChange={(e) => setTradeQuantity(prev => ({ ...prev, fragments: Math.max(1, parseInt(e.target.value) || 1) }))}
                        className="w-16 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-center text-slate-200"
                        min={1}
                      />
                      <button
                        onClick={() => setTradeQuantity(prev => ({ ...prev, fragments: prev.fragments + 1 }))}
                        className="w-8 h-8 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
                      >
                        <FaPlus className="mx-auto" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleTrade('FRAGMENTS_TO_ORB')}
                      disabled={currentSlot.orbFragments < tradeQuantity.fragments * 10 || purchasing}
                      className={`px-4 py-2 rounded font-bold transition-colors ${
                        currentSlot.orbFragments >= tradeQuantity.fragments * 10
                          ? 'bg-purple-600 hover:bg-purple-500 text-white'
                          : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Trade ({tradeQuantity.fragments * 10} ✨ → {tradeQuantity.fragments} 💎)
                    </button>
                  </div>
                </div>
              </div>

              {/* Coins to Orb */}
              <div className="bg-slate-800/60 border border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-200">Coins → Orb</h3>
                    <p className="text-sm text-slate-400">Exchange 5000 coins for 1 orb</p>
                    <p className="text-xs text-slate-500 mt-1">You have: {currentSlot.coins} coins</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTradeQuantity(prev => ({ ...prev, coins: Math.max(1, prev.coins - 1) }))}
                        className="w-8 h-8 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
                      >
                        <FaMinus className="mx-auto" />
                      </button>
                      <input
                        type="number"
                        value={tradeQuantity.coins}
                        onChange={(e) => setTradeQuantity(prev => ({ ...prev, coins: Math.max(1, parseInt(e.target.value) || 1) }))}
                        className="w-16 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-center text-slate-200"
                        min={1}
                      />
                      <button
                        onClick={() => setTradeQuantity(prev => ({ ...prev, coins: prev.coins + 1 }))}
                        className="w-8 h-8 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
                      >
                        <FaPlus className="mx-auto" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleTrade('COINS_TO_ORB')}
                      disabled={currentSlot.coins < tradeQuantity.coins * 5000 || purchasing}
                      className={`px-4 py-2 rounded font-bold transition-colors ${
                        currentSlot.coins >= tradeQuantity.coins * 5000
                          ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                          : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Trade ({(tradeQuantity.coins * 5000).toLocaleString()} 🪙 → {tradeQuantity.coins} 💎)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Item Grid */
            <div className="grid gap-4">
              {getItemsByCategory(activeTab).map(item => {
                const owned = isOwned(item.id);
                const ownedQty = getOwnedQuantity(item.id);
                const isExpanded = expandedItems.has(item.id);
                const qty = getQuantity(item.id);
                const totalCost = item.priceCoin * qty;

                return (
                  <div
                    key={item.id}
                    className="bg-slate-800/60 border border-slate-600 rounded-lg overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        {/* Item Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{item.iconImage || '📦'}</span>
                            <div>
                              <h3 className="font-bold text-slate-200">{item.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-slate-400">
                                {item.attackBonus > 0 && <span className="text-orange-400">+{item.attackBonus} ATK</span>}
                                {item.defenseBonus > 0 && <span className="text-blue-400">+{item.defenseBonus} DEF</span>}
                                {item.hpBonus > 0 && <span className="text-red-400">+{item.hpBonus} HP</span>}
                                {item.healAmount > 0 && <span className="text-green-400">+{item.healAmount} Heal</span>}
                              </div>
                              {owned && item.permanent && (
                                <span className="text-xs text-green-400">✓ Owned</span>
                              )}
                              {ownedQty > 0 && !item.permanent && (
                                <span className="text-xs text-green-400">Owned: {ownedQty}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Purchase Controls */}
                        <div className="flex items-center gap-3">
                          {!item.permanent && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setQuantity(item.id, qty - 1)}
                                className="w-8 h-8 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
                              >
                                <FaMinus className="mx-auto" />
                              </button>
                              <input
                                type="number"
                                value={qty}
                                onChange={(e) => setQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-12 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-center text-slate-200 text-sm"
                                min={1}
                              />
                              <button
                                onClick={() => setQuantity(item.id, qty + 1)}
                                className="w-8 h-8 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
                              >
                                <FaPlus className="mx-auto" />
                              </button>
                            </div>
                          )}
                          <button
                            onClick={() => handlePurchase(item)}
                            disabled={(owned && item.permanent) || currentSlot.coins < totalCost || purchasing}
                            className={`px-4 py-2 rounded font-bold transition-colors whitespace-nowrap ${
                              (owned && item.permanent)
                                ? 'bg-green-800 text-green-400 cursor-not-allowed'
                                : currentSlot.coins >= totalCost
                                ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            {owned && item.permanent
                              ? 'Owned'
                              : `${totalCost.toLocaleString()} 🪙`}
                          </button>
                        </div>
                      </div>

                      {/* Description Toggle */}
                      <button
                        onClick={() => toggleDescription(item.id)}
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-400 mt-2"
                      >
                        Description {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>

                    {/* Expanded Description */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0">
                        <p className="text-sm text-slate-400 bg-slate-700/50 p-3 rounded">
                          {item.description || 'No description available.'}
                        </p>
                        {item.specialEffect && (
                          <p className="text-xs text-purple-400 mt-2">
                            Special Effect: {item.specialEffect}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {getItemsByCategory(activeTab).length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  No items available in this category
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
