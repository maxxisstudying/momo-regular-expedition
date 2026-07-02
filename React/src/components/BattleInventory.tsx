import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { PlayerItemDto } from '../types';

interface BattleInventoryProps {
  potions: PlayerItemDto[];
  usedThisMatch: Record<number, number>;
  onUse: (potion: PlayerItemDto) => void;
  onClose: () => void;
}

const BattleInventory: React.FC<BattleInventoryProps> = ({
  potions,
  usedThisMatch,
  onUse,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-600 w-full max-w-sm max-h-[70vh] overflow-auto">
        <div className="p-3 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-slate-800">
          <h3 className="font-bold text-slate-200">Inventory</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <FaTimes />
          </button>
        </div>
        
        <div className="p-3 space-y-2">
          {potions.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No potions available</p>
          ) : (
            potions.map(potion => {
              const item = potion.shopItem;
              if (!item) return null;

              const maxUses = item.maxUsesPerMatch || 1;
              const usedCount = usedThisMatch[potion.shopItemId] || 0;
              const canUse = usedCount < maxUses && potion.quantity > 0;

              return (
                <button
                  key={potion.id}
                  onClick={() => canUse && onUse(potion)}
                  disabled={!canUse}
                  className={`w-full p-3 text-left rounded transition-colors ${
                    canUse
                      ? 'bg-slate-700/50 hover:bg-slate-700 text-slate-200'
                      : 'bg-slate-700/30 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.iconImage || '🧪'}</span>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-slate-400">
                          {item.healAmount > 0 && `+${item.healAmount} HP`}
                          {item.specialEffect && ` • ${item.specialEffect}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">x{potion.quantity}</p>
                      {maxUses > 1 && (
                        <p className="text-xs text-slate-500">
                          Used: {usedCount}/{maxUses}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="p-3 border-t border-slate-700">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BattleInventory;
