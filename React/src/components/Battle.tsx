import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { EnemyDto, BattleState, PlayerItemDto } from '../types';
import * as api from '../services/api';
import BattleInventory from './BattleInventory';
import AttackMeter from './AttackMeter';

const Battle: React.FC = () => {
  const navigate = useNavigate();
  const { roomNumber } = useParams<{ roomNumber: string }>();
  const { currentSlot, refreshCurrentSlot, keyBindings } = useGame();
  
  const [enemy, setEnemy] = useState<EnemyDto | null>(null);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [selectedAction, setSelectedAction] = useState(0); // 0: Attack, 1: Inventory, 2: Flee
  const [showInventory, setShowInventory] = useState(false);
  const [showAttackMeter, setShowAttackMeter] = useState(false);
  const [isEnemyTurn, setIsEnemyTurn] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showDefeat, setShowDefeat] = useState(false);
  const [battleResult, setBattleResult] = useState<any>(null);
  const [playerShake, setPlayerShake] = useState(false);
  const [enemyShake, setEnemyShake] = useState(false);
  const [playerPotions, setPlayerPotions] = useState<PlayerItemDto[]>([]);

  const room = parseInt(roomNumber || '1');

  useEffect(() => {
    if (!currentSlot) {
      navigate('/');
      return;
    }
    initBattle();
  }, [currentSlot, navigate, room]);

  const initBattle = async () => {
    if (!currentSlot) return;
    
    try {
      const enemyData = await api.getEnemyForRoom(currentSlot.id, room);
      setEnemy(enemyData);
      
      // Load player potions
      const potions = await api.getPlayerItemsByCategory(currentSlot.id, 'POTION');
      setPlayerPotions(potions);

      // Initialize battle state
      setBattleState({
        playerHp: currentSlot.totalHp,
        playerMaxHp: currentSlot.totalHp,
        enemyHp: enemyData.hp,
        enemyMaxHp: enemyData.hp,
        turn: 'player',
        battleLog: [`A wild ${enemyData.name} appears!`],
        isOver: false,
        victory: false,
        potionsUsedThisMatch: {},
        paralyzeTurns: 0,
        enemyParalyzeStacks: 0,
        emptyGunHits: 0,
        blanketSkipCharge: 0,
        barbarianHits: 0,
        barbarianDamageReduction: 0,
        dwarfKingHits: 0,
        dwarfKingCritReduction: 0,
        greenElixirUses: 0,
        yellowElixirHits: 0,
        redElixirAttacks: 0,
        greyPotionImmune: false,
        goldenHealNextTurn: false,
      });
    } catch (error) {
      console.error('Failed to init battle:', error);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!battleState || battleState.isOver || isEnemyTurn || showInventory || showAttackMeter) return;
    
    const key = e.key.toLowerCase();
    
    if (key === keyBindings.moveLeft) {
      setSelectedAction(prev => Math.max(0, prev - 1));
    } else if (key === keyBindings.moveRight) {
      setSelectedAction(prev => Math.min(2, prev + 1));
    } else if (key === keyBindings.select || key === 'enter') {
      if (selectedAction === 0) setShowAttackMeter(true);
      else if (selectedAction === 1) setShowInventory(true);
      else handleFlee();
    }
  }, [keyBindings, battleState, isEnemyTurn, showInventory, showAttackMeter, selectedAction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Actions are now handled directly in button onClick and handleKeyDown

  const calculateDamage = (multiplier: number): number => {
    if (!currentSlot || !enemy) return 0;
    
    let baseDamage = currentSlot.totalAttack;
    
    // Apply red elixir bonus
    if (battleState && battleState.redElixirAttacks > 0) {
      baseDamage *= 1.5;
      setBattleState(prev => prev ? { ...prev, redElixirAttacks: prev.redElixirAttacks - 1 } : prev);
    }
    
    // Apply attack multiplier from timing
    baseDamage *= multiplier;
    
    // Apply crit chance
    const critRoll = Math.random() * 100;
    if (critRoll < currentSlot.playerCritRate) {
      baseDamage *= 1.5;
      addToLog('CRITICAL HIT!');
    }
    
    // Subtract enemy defense
    let finalDamage = Math.max(1, baseDamage - enemy.defense);
    
    return Math.round(finalDamage);
  };

  const handleAttackComplete = (multiplier: number) => {
    setShowAttackMeter(false);
    
    if (!battleState || !enemy || !currentSlot) return;
    
    const damage = calculateDamage(multiplier);
    
    // Trigger enemy shake animation
    setEnemyShake(true);
    setTimeout(() => setEnemyShake(false), 300);
    
    const newEnemyHp = Math.max(0, battleState.enemyHp - damage);
    
    addToLog(`You dealt ${damage} damage!`);
    
    // Track weapon effects
    let newState = { ...battleState, enemyHp: newEnemyHp };
    
    // Rusty Blade - paralyze stacks
    if (currentSlot.equippedWeapon?.specialEffect === 'PARALYZE') {
      newState.enemyParalyzeStacks += 1;
      if (newState.enemyParalyzeStacks >= 5) {
        const paralyzeTurns = room >= 11 ? 2 : 4;
        newState.paralyzeTurns = paralyzeTurns;
        newState.enemyParalyzeStacks = 0;
        addToLog(`Enemy is paralyzed for ${paralyzeTurns} turns!`);
      }
    }
    
    // Empty Gun - extra turn
    if (currentSlot.equippedWeapon?.specialEffect === 'EXTRA_TURN') {
      newState.emptyGunHits += 1;
      if (newState.emptyGunHits >= 5) {
        newState.emptyGunHits = 0;
        addToLog('Extra turn activated!');
        setBattleState(newState);
        // Don't switch to enemy turn
        return;
      }
    }
    
    // Vampire Sword - lifesteal
    if (currentSlot.equippedWeapon?.specialEffect === 'LIFESTEAL') {
      const heal = Math.round(damage * 0.03);
      newState.playerHp = Math.min(newState.playerMaxHp, newState.playerHp + heal);
      if (heal > 0) addToLog(`Lifesteal: +${heal} HP`);
    }
    
    // Pure Nail - Howling Wraith
    if (currentSlot.equippedWeapon?.specialEffect === 'HOWLING_WRAITH') {
      if (Math.random() < 0.01) {
        const wraiths = damage * 5;
        newState.enemyHp = Math.max(0, newState.enemyHp - wraiths);
        addToLog(`Howling Wraith deals ${wraiths} void damage!`);
      }
    }
    
    setBattleState(newState);
    
    // Check enemy defeat
    if (newState.enemyHp <= 0) {
      handleVictory();
      return;
    }
    
    // Enemy turn
    setTimeout(() => enemyTurn(newState), 500);
  };

  const enemyTurn = (state: BattleState) => {
    if (!enemy || !currentSlot || state.isOver) return;
    
    setIsEnemyTurn(true);
    
    // Check paralysis
    if (state.paralyzeTurns > 0) {
      addToLog(`Enemy is paralyzed! (${state.paralyzeTurns - 1} turns left)`);
      setBattleState(prev => prev ? { ...prev, paralyzeTurns: prev.paralyzeTurns - 1 } : prev);
      setIsEnemyTurn(false);
      return;
    }
    
    // Check Blanket skip chance
    if (currentSlot.equippedDefense?.specialEffect === 'SKIP_TURN') {
      if (Math.random() < 0.05) {
        addToLog('Blanket protected you! Enemy turn skipped!');
        setIsEnemyTurn(false);
        return;
      }
    }
    
    // Check grey potion immunity
    if (state.greyPotionImmune) {
      addToLog('Grey Potion blocks the attack!');
      setBattleState(prev => prev ? { ...prev, greyPotionImmune: false } : prev);
      setIsEnemyTurn(false);
      return;
    }
    
    // Calculate enemy damage
    let enemyDamage = enemy.attack;
    
    // Apply enemy crit
    if (Math.random() * 100 < (enemy.critChance - state.dwarfKingCritReduction)) {
      const critOptions = JSON.parse(enemy.critDamageOptions || '[]');
      const critMultiplier = critOptions.length > 0 
        ? critOptions[Math.floor(Math.random() * critOptions.length)] 
        : 1.2;
      enemyDamage *= critMultiplier;
      addToLog('Enemy critical hit!');
    }
    
    // Apply damage reduction chance
    if (Math.random() * 100 < enemy.reduceDamageChance) {
      const reductionOptions = JSON.parse(enemy.damageReductionOptions || '[]');
      const reduction = reductionOptions.length > 0
        ? reductionOptions[Math.floor(Math.random() * reductionOptions.length)]
        : 0.5;
      enemyDamage *= reduction;
    }
    
    // Subtract player defense
    enemyDamage = Math.max(1, enemyDamage - currentSlot.totalDefense);
    
    // Apply barbarian damage reduction
    if (state.barbarianDamageReduction > 0) {
      enemyDamage *= (1 - state.barbarianDamageReduction);
    }
    
    // Apply yellow elixir reduction
    if (state.yellowElixirHits > 0) {
      enemyDamage *= 0.6;
      setBattleState(prev => prev ? { ...prev, yellowElixirHits: prev.yellowElixirHits - 1 } : prev);
    }
    
    // Thorned Armor reflect
    let reflectDamage = 0;
    if (currentSlot.equippedDefense?.specialEffect === 'REFLECT') {
      reflectDamage = Math.round(enemyDamage * 0.08);
    }
    
    enemyDamage = Math.round(enemyDamage);
    
    // Trigger player shake
    setPlayerShake(true);
    setTimeout(() => setPlayerShake(false), 300);
    
    const newPlayerHp = Math.max(0, state.playerHp - enemyDamage);
    let newEnemyHp = state.enemyHp;
    
    addToLog(`${enemy.name} deals ${enemyDamage} damage!`);
    
    if (reflectDamage > 0) {
      newEnemyHp = Math.max(0, newEnemyHp - reflectDamage);
      addToLog(`Thorns reflect ${reflectDamage} damage!`);
    }
    
    // Track barbarian chestplate
    let newBarbarianHits = state.barbarianHits;
    let newBarbarianReduction = state.barbarianDamageReduction;
    if (currentSlot.equippedDefense?.specialEffect === 'STACK_DEF') {
      newBarbarianHits += 1;
      if (newBarbarianHits >= 4) {
        newBarbarianHits = 0;
        newBarbarianReduction = Math.min(0.3, newBarbarianReduction + 0.03);
        addToLog('Barbarian armor: +3% damage reduction!');
      }
    }
    
    // Track dwarf king armor
    let newDwarfHits = state.dwarfKingHits;
    let newDwarfCritReduction = state.dwarfKingCritReduction;
    if (currentSlot.equippedDefense?.specialEffect === 'CRIT_REDUCE') {
      newDwarfHits += 1;
      if (newDwarfHits >= 3) {
        newDwarfHits = 0;
        newDwarfCritReduction = Math.min(enemy.critChance * 0.4, newDwarfCritReduction + 1.5);
        addToLog('Dwarf armor: Enemy crit reduced!');
      }
    }
    
    // Golden Heal next turn effect
    if (state.goldenHealNextTurn) {
      const healAmount = 20;
      setBattleState(prev => prev ? {
        ...prev,
        playerHp: Math.min(prev.playerMaxHp, newPlayerHp + healAmount),
        goldenHealNextTurn: false,
      } : prev);
      addToLog(`Golden Heal: +${healAmount} HP`);
    }
    
    setBattleState(prev => prev ? {
      ...prev,
      playerHp: newPlayerHp,
      enemyHp: newEnemyHp,
      barbarianHits: newBarbarianHits,
      barbarianDamageReduction: newBarbarianReduction,
      dwarfKingHits: newDwarfHits,
      dwarfKingCritReduction: newDwarfCritReduction,
    } : prev);
    
    // Check player defeat
    if (newPlayerHp <= 0) {
      handleDefeat();
      return;
    }
    
    // Check enemy defeat from reflect
    if (newEnemyHp <= 0) {
      handleVictory();
      return;
    }
    
    setIsEnemyTurn(false);
  };

  const handleVictory = async () => {
    if (!currentSlot || !battleState) return;
    
    setBattleState(prev => prev ? { ...prev, isOver: true, victory: true } : prev);
    
    try {
      const result = await api.processBattleVictory(currentSlot.id, room);
      setBattleResult(result);
      setShowVictory(true);
      await refreshCurrentSlot();
    } catch (error) {
      console.error('Failed to process victory:', error);
    }
  };

  const handleDefeat = () => {
    setBattleState(prev => prev ? { ...prev, isOver: true, victory: false } : prev);
    setShowDefeat(true);
  };

  const handleFlee = () => {
    addToLog('You fled from battle!');
    setTimeout(() => navigate('/hallway'), 1000);
  };

  const handleUsePotion = async (potion: PlayerItemDto) => {
    if (!currentSlot || !battleState) return;
    
    const maxUses = potion.shopItem?.maxUsesPerMatch || 1;
    const currentUses = battleState.potionsUsedThisMatch[potion.shopItemId] || 0;
    
    if (currentUses >= maxUses) {
      addToLog(`Cannot use more ${potion.shopItem?.name} this match!`);
      return;
    }
    
    try {
      await api.usePotion(currentSlot.id, potion.shopItemId);
      
      // Apply potion effect
      let newState = { ...battleState };
      newState.potionsUsedThisMatch[potion.shopItemId] = currentUses + 1;
      
      const item = potion.shopItem;
      if (!item) return;
      
      // Heal amount (with Wise Mage staff bonus)
      let healAmount = item.healAmount || 0;
      if (currentSlot.equippedWeapon?.specialEffect === 'BOOST_HEAL') {
        healAmount = Math.round(healAmount * 1.3);
      }
      
      if (healAmount > 0) {
        newState.playerHp = Math.min(newState.playerMaxHp, newState.playerHp + healAmount);
        addToLog(`Used ${item.name}: +${healAmount} HP`);
      }
      
      // Special effects
      if (item.specialEffect === 'IMMUNE_NEXT') {
        newState.greyPotionImmune = true;
        addToLog('Next enemy attack will be blocked!');
      }
      if (item.specialEffect === 'DAMAGE_BOOST') {
        newState.redElixirAttacks = 2;
        addToLog('Next 2 attacks deal 1.5x damage!');
      }
      if (item.specialEffect === 'DEFENSE_BOOST') {
        newState.yellowElixirHits = 3;
        addToLog('Next 3 hits take 40% less damage!');
      }
      if (item.specialEffect === 'EXTRA_ATTACK') {
        newState.greenElixirUses += 1;
        addToLog('You can attack twice this turn!');
      }
      if (item.specialEffect === 'GOLDEN_HEAL') {
        newState.goldenHealNextTurn = true;
        addToLog('Will heal 20 HP next turn!');
      }
      
      setBattleState(newState);
      setShowInventory(false);
      
      // Update potions list
      setPlayerPotions(prev => prev.map(p => 
        p.shopItemId === potion.shopItemId 
          ? { ...p, quantity: p.quantity - 1 }
          : p
      ).filter(p => p.quantity > 0));
      
    } catch (error) {
      console.error('Failed to use potion:', error);
    }
  };

  const addToLog = (message: string) => {
    setBattleState(prev => prev ? {
      ...prev,
      battleLog: [...prev.battleLog.slice(-4), message]
    } : prev);
  };

  if (!enemy || !battleState || !currentSlot) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Loading battle...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-700 to-slate-900 flex flex-col">
      {/* Battle Arena */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Enemy Section */}
        <div className="mb-8 text-center">
          <div className={`transition-transform duration-100 ${enemyShake ? 'animate-pulse scale-95' : ''}`}>
            <div className="w-32 h-32 mx-auto bg-slate-800 rounded-lg border-2 border-slate-600 flex items-center justify-center text-6xl mb-2">
              {enemy.spriteImage || '👹'}
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-200">{enemy.name}</h2>
          <div className="w-48 mx-auto mt-2">
            <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
              <div
                className="h-full bg-red-500 transition-all duration-300"
                style={{ width: `${(battleState.enemyHp / battleState.enemyMaxHp) * 100}%` }}
              />
            </div>
            <p className="text-sm text-slate-400 mt-1">{battleState.enemyHp} / {battleState.enemyMaxHp}</p>
          </div>
        </div>

        {/* Player Section */}
        <div className="text-center">
          <div className={`transition-transform duration-100 ${playerShake ? 'animate-pulse scale-95' : ''}`}>
            <div className="w-24 h-24 mx-auto bg-slate-800 rounded-lg border-2 border-blue-600 flex items-center justify-center text-4xl mb-2">
              {currentSlot.profileImage ? (
                <img src={currentSlot.profileImage} alt="" className="w-full h-full rounded-lg object-cover" />
              ) : '🧙'}
            </div>
          </div>
          <h2 className="text-lg font-bold text-slate-200">{currentSlot.playerName}</h2>
          <div className="w-48 mx-auto mt-2">
            <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${(battleState.playerHp / battleState.playerMaxHp) * 100}%` }}
              />
            </div>
            <p className="text-sm text-slate-400 mt-1">{battleState.playerHp} / {battleState.playerMaxHp}</p>
          </div>
        </div>
      </div>

      {/* Battle Log */}
      <div className="bg-slate-800/80 border-t border-slate-700 p-4">
        <div className="max-w-xl mx-auto h-20 overflow-y-auto">
          {battleState.battleLog.map((log, i) => (
            <p key={i} className="text-sm text-slate-400">{log}</p>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-slate-900 border-t border-slate-700 p-4">
        <div className="max-w-xl mx-auto flex justify-center gap-4">
          {['Attack', 'Inventory', 'Flee'].map((action, index) => (
            <button
              key={action}
              onClick={() => {
                setSelectedAction(index);
                if (index === 0) setShowAttackMeter(true);
                else if (index === 1) setShowInventory(true);
                else handleFlee();
              }}
              onMouseEnter={() => setSelectedAction(index)}
              disabled={isEnemyTurn || battleState.isOver}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                selectedAction === index
                  ? 'bg-blue-600 text-white scale-105'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              } ${(isEnemyTurn || battleState.isOver) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {action}
            </button>
          ))}
        </div>
        {isEnemyTurn && <p className="text-center text-slate-500 mt-2">Enemy's turn...</p>}
      </div>

      {/* Attack Meter Modal */}
      {showAttackMeter && (
        <AttackMeter
          onComplete={handleAttackComplete}
          baseAttack={currentSlot.totalAttack}
        />
      )}

      {/* Inventory Modal */}
      {showInventory && (
        <BattleInventory
          potions={playerPotions}
          usedThisMatch={battleState.potionsUsedThisMatch}
          onUse={handleUsePotion}
          onClose={() => setShowInventory(false)}
        />
      )}

      {/* Victory Modal */}
      {showVictory && battleResult && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg border border-green-600 p-6 w-full max-w-sm text-center">
            <h2 className="text-3xl font-bold text-green-400 mb-4">Victory!</h2>
            <div className="space-y-2 mb-6">
              {battleResult.firstClear && (
                <p className="text-yellow-400">🌟 First Clear Bonus!</p>
              )}
              <p className="text-slate-300">Coins: +{battleResult.coinsEarned} 🪙</p>
              {battleResult.orbsEarned > 0 && (
                <p className="text-purple-400">Orbs: +{battleResult.orbsEarned} 💎</p>
              )}
              {battleResult.orbFragmentsEarned > 0 && (
                <p className="text-purple-300">Fragments: +{battleResult.orbFragmentsEarned} ✨</p>
              )}
            </div>
            <button
              onClick={() => navigate('/hallway')}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Defeat Modal */}
      {showDefeat && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg border border-red-600 p-6 w-full max-w-sm text-center">
            <h2 className="text-3xl font-bold text-red-400 mb-4">Defeat</h2>
            <p className="text-slate-400 mb-6">You were defeated by {enemy.name}...</p>
            <button
              onClick={() => navigate('/hallway')}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg"
            >
              Return to Hallway
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Battle;
