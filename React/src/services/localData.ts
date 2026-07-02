import {
  SaveSlotDto,
  ShopItemDto,
  PlayerItemDto,
  EnemyDto,
  BattleResultDto,
  UpgradeInfoResponse,
  RoomRewardDto,
  GameConfigDto,
} from '../types';

// ====================== STORAGE HELPERS ======================

const STORAGE_KEY = 'momo_game_data';

interface GameData {
  saveSlots: SaveSlotDto[];
  nextSlotId: number;
  nextItemId: number;
}

function loadData(): GameData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch { /* fall through */ }
  }
  return { saveSlots: [], nextSlotId: 1, nextItemId: 1 };
}

function saveData(data: GameData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ====================== SEED DATA ======================

export const SHOP_ITEMS: ShopItemDto[] = [
  // WEAPONS
  { id:1,name:"Rusty Blade",category:"WEAPON",description:"An old blade carrying Clostridium tetani bacteria. Stack 5 hits to paralyze the enemy for 4 turns (2 turns on room 11-13 bosses).",priceCoin:400,priceOrb:0,iconImage:"🗡️",attackBonus:20,defenseBonus:0,hpBonus:0,healAmount:0,specialEffect:"PARALYZE",effectParams:'{"stacksNeeded":5,"paralyzeTurns":4,"bossParalyzeTurns":2}',permanent:true,maxUsesPerMatch:0,active:true },
  { id:2,name:"Empty Gun",category:"WEAPON",description:"A mysterious gun. After hitting 5 times, gain an extra turn.",priceCoin:480,priceOrb:0,iconImage:"🔫",attackBonus:28,defenseBonus:0,hpBonus:0,healAmount:0,specialEffect:"EXTRA_TURN",effectParams:'{"hitsNeeded":5}',permanent:true,maxUsesPerMatch:0,active:true },
  { id:3,name:"Wise Mage's Staff",category:"WEAPON",description:"A staff imbued with healing magic. Boosts potion healing by 1.3x.",priceCoin:350,priceOrb:0,iconImage:"🪄",attackBonus:15,defenseBonus:0,hpBonus:0,healAmount:0,specialEffect:"BOOST_HEAL",effectParams:'{"healMultiplier":1.3}',permanent:true,maxUsesPerMatch:0,active:true },
  { id:4,name:"Greed Dagger",category:"WEAPON",description:"Increases coin drop by 1.2x and 18% chance for bonus orbs.",priceCoin:380,priceOrb:0,iconImage:"🔪",attackBonus:18,defenseBonus:0,hpBonus:0,healAmount:0,specialEffect:"GREED_BOOST",effectParams:'{"coinMultiplier":1.2,"orbChance":0.18}',permanent:true,maxUsesPerMatch:0,active:true },
  { id:5,name:"Pure Nail",category:"WEAPON",description:"A legendary nail. 1% chance to release Howling Wraith for 5x damage.",priceCoin:510,priceOrb:0,iconImage:"📌",attackBonus:31,defenseBonus:0,hpBonus:0,healAmount:0,specialEffect:"HOWLING_WRAITH",effectParams:'{"chance":0.01,"damageMultiplier":5}',permanent:true,maxUsesPerMatch:0,active:true },
  { id:6,name:"Vampire Sword",category:"WEAPON",description:"Dark blade that steals 3% of damage dealt as HP.",priceCoin:400,priceOrb:0,iconImage:"⚔️",attackBonus:20,defenseBonus:0,hpBonus:0,healAmount:0,specialEffect:"LIFESTEAL",effectParams:'{"lifestealPercent":0.03}',permanent:true,maxUsesPerMatch:0,active:true },
  // DEFENSE
  { id:7,name:"Blanket",category:"DEFENSE",description:"A cozy blanket. 5% chance to skip enemy turn.",priceCoin:340,priceOrb:0,iconImage:"🛏️",attackBonus:0,defenseBonus:14,hpBonus:0,healAmount:0,specialEffect:"SKIP_TURN",effectParams:'{"skipChance":0.05}',permanent:true,maxUsesPerMatch:0,active:true },
  { id:8,name:"Thorned Armor",category:"DEFENSE",description:"Reflects 8% of damage taken back to the enemy.",priceCoin:380,priceOrb:0,iconImage:"🛡️",attackBonus:0,defenseBonus:18,hpBonus:0,healAmount:0,specialEffect:"REFLECT",effectParams:'{"reflectPercent":0.08}',permanent:true,maxUsesPerMatch:0,active:true },
  { id:9,name:"Barbarian Chestplate",category:"DEFENSE",description:"Every 4 enemy hits reduces incoming damage by 3% (stacking).",priceCoin:380,priceOrb:0,iconImage:"🦺",attackBonus:0,defenseBonus:18,hpBonus:0,healAmount:0,specialEffect:"STACK_DEF",effectParams:'{"hitsNeeded":4,"reductionPerStack":0.03}',permanent:true,maxUsesPerMatch:0,active:true },
  { id:10,name:"Dwarf King's Armor",category:"DEFENSE",description:"Every 3 enemy hits reduces their crit chance by 1.5% (cap 40%).",priceCoin:350,priceOrb:0,iconImage:"👑",attackBonus:0,defenseBonus:15,hpBonus:0,healAmount:0,specialEffect:"CRIT_REDUCE",effectParams:'{"hitsNeeded":3,"reductionPerStack":1.5,"maxReduction":40}',permanent:true,maxUsesPerMatch:0,active:true },
  // POTIONS
  { id:11,name:"Purple Potion",category:"POTION",description:"Restores 45 HP.",priceCoin:50,priceOrb:0,iconImage:"🟣",attackBonus:0,defenseBonus:0,hpBonus:0,healAmount:45,specialEffect:null,effectParams:null,permanent:false,maxUsesPerMatch:5,active:true },
  { id:12,name:"Grey Potion",category:"POTION",description:"Blocks the next enemy attack and restores 40 HP.",priceCoin:80,priceOrb:0,iconImage:"⚪",attackBonus:0,defenseBonus:0,hpBonus:0,healAmount:40,specialEffect:"IMMUNE_NEXT",effectParams:null,permanent:false,maxUsesPerMatch:2,active:true },
  { id:13,name:"Red Elixir",category:"POTION",description:"First 2 attacks deal 1.5x damage.",priceCoin:100,priceOrb:0,iconImage:"🔴",attackBonus:0,defenseBonus:0,hpBonus:0,healAmount:0,specialEffect:"DAMAGE_BOOST",effectParams:'{"attacks":2,"multiplier":1.5}',permanent:false,maxUsesPerMatch:2,active:true },
  { id:14,name:"Yellow Elixir",category:"POTION",description:"First 3 hits taken are reduced by 40%.",priceCoin:90,priceOrb:0,iconImage:"🟡",attackBonus:0,defenseBonus:0,hpBonus:0,healAmount:0,specialEffect:"DEFENSE_BOOST",effectParams:'{"hits":3,"reduction":0.4}',permanent:false,maxUsesPerMatch:2,active:true },
  { id:15,name:"Green Elixir",category:"POTION",description:"Attack twice in a single turn. Max 2 uses per match.",priceCoin:120,priceOrb:0,iconImage:"🟢",attackBonus:0,defenseBonus:0,hpBonus:0,healAmount:0,specialEffect:"EXTRA_ATTACK",effectParams:null,permanent:false,maxUsesPerMatch:2,active:true },
  { id:16,name:"Yellow Potion",category:"POTION",description:"+15 DEF for this match. Can only use once per match.",priceCoin:70,priceOrb:0,iconImage:"💛",attackBonus:0,defenseBonus:15,hpBonus:0,healAmount:0,specialEffect:null,effectParams:null,permanent:false,maxUsesPerMatch:1,active:true },
  { id:17,name:"Green Juice",category:"POTION",description:"Gain 1.5% dodge rate for this match.",priceCoin:60,priceOrb:0,iconImage:"🥤",attackBonus:0,defenseBonus:0,hpBonus:0,healAmount:0,specialEffect:"DODGE_BOOST",effectParams:'{"dodgeRate":1.5}',permanent:false,maxUsesPerMatch:3,active:true },
  { id:18,name:"Golden Heal",category:"POTION",description:"Heal 30 HP now and automatically heal 20 HP next turn.",priceCoin:110,priceOrb:0,iconImage:"✨",attackBonus:0,defenseBonus:0,hpBonus:0,healAmount:30,specialEffect:"GOLDEN_HEAL",effectParams:'{"nextTurnHeal":20}',permanent:false,maxUsesPerMatch:2,active:true },
  // CHARMS
  { id:19,name:"Lucky Charm",category:"CHARM",description:"3% chance to gain an extra turn after attacking.",priceCoin:350,priceOrb:0,iconImage:"🍀",attackBonus:0,defenseBonus:0,hpBonus:0,healAmount:0,specialEffect:"EXTRA_TURN_CHANCE",effectParams:'{"chance":0.03}',permanent:true,maxUsesPerMatch:0,active:true },
  { id:20,name:"Stone Mask",category:"CHARM",description:"Regain 5% of damage dealt as HP.",priceCoin:380,priceOrb:0,iconImage:"🎭",attackBonus:0,defenseBonus:0,hpBonus:0,healAmount:0,specialEffect:"LIFESTEAL",effectParams:'{"percent":0.05}',permanent:true,maxUsesPerMatch:0,active:true },
  { id:21,name:"Red Stone",category:"CHARM",description:"Gain 3% dodge rate.",priceCoin:320,priceOrb:0,iconImage:"💎",attackBonus:0,defenseBonus:0,hpBonus:0,healAmount:0,specialEffect:"DODGE",effectParams:'{"dodgeRate":3}',permanent:true,maxUsesPerMatch:0,active:true },
  { id:22,name:"Cain",category:"CHARM",description:"1% chance to reflect exact damage back to enemy.",priceCoin:400,priceOrb:0,iconImage:"🪞",attackBonus:0,defenseBonus:0,hpBonus:0,healAmount:0,specialEffect:"FULL_REFLECT",effectParams:'{"chance":0.01}',permanent:true,maxUsesPerMatch:0,active:true },
  { id:23,name:"Secret Momo Family's Scarf",category:"CHARM",description:"1% chance to completely immune enemy attack (cap 2 per match).",priceCoin:450,priceOrb:0,iconImage:"🧣",attackBonus:0,defenseBonus:0,hpBonus:0,healAmount:0,specialEffect:"IMMUNE_CHANCE",effectParams:'{"chance":0.01,"maxUses":2}',permanent:true,maxUsesPerMatch:0,active:true },
];

export const ENEMIES: EnemyDto[] = [
  { id:1,name:"Slime",roomNumber:1,hp:80,attack:12,defense:5,reduceDamageChance:40,damageReductionOptions:"[0.4,0.5,0.6,0.7]",critChance:0,critDamageOptions:"[]",spriteImage:null,active:true },
  { id:2,name:"Goblin Assassin",roomNumber:2,hp:60,attack:22,defense:3,reduceDamageChance:35,damageReductionOptions:"[0.4,0.6]",critChance:0,critDamageOptions:"[]",spriteImage:null,active:true },
  { id:3,name:"Stone Golem",roomNumber:3,hp:120,attack:18,defense:26,reduceDamageChance:30,damageReductionOptions:"[0.6]",critChance:0,critDamageOptions:"[]",spriteImage:null,active:true },
  { id:4,name:"Dark Knight",roomNumber:4,hp:140,attack:22,defense:28,reduceDamageChance:28,damageReductionOptions:"[0.5,0.6]",critChance:0,critDamageOptions:"[]",spriteImage:null,active:true },
  { id:5,name:"Werewolf",roomNumber:5,hp:160,attack:26,defense:22,reduceDamageChance:27,damageReductionOptions:"[0.4,0.5]",critChance:8,critDamageOptions:"[1.02]",spriteImage:null,active:true },
  { id:6,name:"Vampire Lord",roomNumber:6,hp:175,attack:28,defense:24,reduceDamageChance:26,damageReductionOptions:"[0.4]",critChance:10,critDamageOptions:"[1.03,1.05,1.08]",spriteImage:null,active:true },
  { id:7,name:"Ancient Dragon",roomNumber:7,hp:280,attack:38,defense:30,reduceDamageChance:25,damageReductionOptions:"[0.3,0.4]",critChance:12,critDamageOptions:"[1.1,1.12,1.15,1.17]",spriteImage:null,active:true },
  { id:8,name:"Demon General",roomNumber:8,hp:320,attack:42,defense:32,reduceDamageChance:25,damageReductionOptions:"[0.3]",critChance:12,critDamageOptions:"[1.12,1.15,1.17]",spriteImage:null,active:true },
  { id:9,name:"Lich King",roomNumber:9,hp:360,attack:45,defense:28,reduceDamageChance:24,damageReductionOptions:"[0.3]",critChance:12.2,critDamageOptions:"[1.14,1.15,1.17,1.18]",spriteImage:null,active:true },
  { id:10,name:"Chaos Titan",roomNumber:10,hp:400,attack:48,defense:35,reduceDamageChance:23,damageReductionOptions:"[0.3]",critChance:12.5,critDamageOptions:"[1.15,1.17,1.18,1.19]",spriteImage:null,active:true },
  { id:11,name:"Shadow Emperor",roomNumber:11,hp:700,attack:55,defense:40,reduceDamageChance:20,damageReductionOptions:"[0.3]",critChance:13,critDamageOptions:"[1.1,1.12,1.15,1.17,1.2,1.25,1.3]",spriteImage:null,active:true },
  { id:12,name:"Void Harbinger",roomNumber:12,hp:850,attack:62,defense:45,reduceDamageChance:18,damageReductionOptions:"[0.3]",critChance:14,critDamageOptions:"[1.15,1.17,1.3,1.4,1.45]",spriteImage:null,active:true },
  { id:13,name:"The Eternal One",roomNumber:13,hp:1000,attack:70,defense:50,reduceDamageChance:10,damageReductionOptions:"[0.2]",critChance:15,critDamageOptions:"[1.2,1.4,1.45,1.5,1.55,1.6]",spriteImage:null,active:true },
];

export const ROOM_REWARDS: RoomRewardDto[] = [
  { id:1,roomNumber:1,firstClearCoins:18,firstClearOrbs:0,replayCoins:30,replayOrbFragments:0 },
  { id:2,roomNumber:2,firstClearCoins:38,firstClearOrbs:0,replayCoins:30,replayOrbFragments:0 },
  { id:3,roomNumber:3,firstClearCoins:65,firstClearOrbs:0,replayCoins:30,replayOrbFragments:0 },
  { id:4,roomNumber:4,firstClearCoins:95,firstClearOrbs:0,replayCoins:30,replayOrbFragments:0 },
  { id:5,roomNumber:5,firstClearCoins:130,firstClearOrbs:0,replayCoins:30,replayOrbFragments:0 },
  { id:6,roomNumber:6,firstClearCoins:195,firstClearOrbs:1,replayCoins:30,replayOrbFragments:0 },
  { id:7,roomNumber:7,firstClearCoins:260,firstClearOrbs:1,replayCoins:45,replayOrbFragments:2 },
  { id:8,roomNumber:8,firstClearCoins:420,firstClearOrbs:1,replayCoins:45,replayOrbFragments:2 },
  { id:9,roomNumber:9,firstClearCoins:580,firstClearOrbs:1,replayCoins:45,replayOrbFragments:2 },
  { id:10,roomNumber:10,firstClearCoins:600,firstClearOrbs:1,replayCoins:45,replayOrbFragments:2 },
  { id:11,roomNumber:11,firstClearCoins:800,firstClearOrbs:3,replayCoins:45,replayOrbFragments:2 },
  { id:12,roomNumber:12,firstClearCoins:1100,firstClearOrbs:5,replayCoins:45,replayOrbFragments:2 },
  { id:13,roomNumber:13,firstClearCoins:1500,firstClearOrbs:7,replayCoins:45,replayOrbFragments:2 },
];

export const GAME_CONFIGS: GameConfigDto[] = [
  { id:1,configKey:"PLAYER_BASE_HP",configValue:"100",description:"Starting HP" },
  { id:2,configKey:"PLAYER_BASE_ATK",configValue:"20",description:"Starting ATK" },
  { id:3,configKey:"PLAYER_BASE_DEF",configValue:"10",description:"Starting DEF" },
  { id:4,configKey:"ORB_UPGRADE_THRESHOLD",configValue:"20",description:"Level at which upgrade cost goes to 2 orbs" },
  { id:5,configKey:"HP_PER_UPGRADE",configValue:"5",description:"HP per upgrade level" },
  { id:6,configKey:"ATK_PER_UPGRADE",configValue:"3",description:"ATK per upgrade level" },
  { id:7,configKey:"CRIT_PER_UPGRADE",configValue:"0.5",description:"Crit% per upgrade level" },
  { id:8,configKey:"FRAGMENTS_PER_ORB",configValue:"10",description:"Fragments to trade for 1 orb" },
  { id:9,configKey:"COINS_PER_ORB",configValue:"5000",description:"Coins to trade for 1 orb" },
  { id:10,configKey:"HARD_MODE_MULTIPLIER",configValue:"2",description:"Enemy HP/ATK multiplier in hard mode" },
];

// ====================== COMPUTED STATS ======================

function computeSlotStats(slot: SaveSlotDto): SaveSlotDto {
  let totalHp = slot.baseHp;
  let totalAtk = slot.baseAttack;
  let totalDef = slot.baseDefense;

  const weapon = slot.equippedWeaponId
    ? SHOP_ITEMS.find(i => i.id === slot.equippedWeaponId) || null
    : null;
  const defense = slot.equippedDefenseId
    ? SHOP_ITEMS.find(i => i.id === slot.equippedDefenseId) || null
    : null;

  if (weapon) {
    totalAtk += weapon.attackBonus;
    totalHp += weapon.hpBonus;
    totalDef += weapon.defenseBonus;
  }
  if (defense) {
    totalDef += defense.defenseBonus;
    totalHp += defense.hpBonus;
    totalAtk += defense.attackBonus;
  }

  return {
    ...slot,
    totalHp,
    totalAttack: totalAtk,
    totalDefense: totalDef,
    equippedWeapon: weapon,
    equippedDefense: defense,
  };
}

// ====================== API FUNCTIONS ======================

export const getAllSlots = async (): Promise<SaveSlotDto[]> => {
  const data = loadData();
  return data.saveSlots.map(computeSlotStats);
};

export const getSlotById = async (id: number): Promise<SaveSlotDto> => {
  const data = loadData();
  const slot = data.saveSlots.find(s => s.id === id);
  if (!slot) throw new Error('Slot not found');
  return computeSlotStats(slot);
};

export const getSlot = async (slotNumber: number): Promise<SaveSlotDto> => {
  const data = loadData();
  const slot = data.saveSlots.find(s => s.slotNumber === slotNumber);
  if (!slot) throw new Error('Slot not found');
  return computeSlotStats(slot);
};

export const createNewGame = async (
  slotNumber: number,
  playerName: string,
  hardMode: boolean = false
): Promise<SaveSlotDto> => {
  const data = loadData();
  if (data.saveSlots.find(s => s.slotNumber === slotNumber)) {
    throw new Error('Slot already exists');
  }
  const now = new Date().toISOString();
  const newSlot: SaveSlotDto = {
    id: data.nextSlotId++,
    slotNumber,
    playerName,
    profileImage: null,
    currentRoom: 1,
    highestRoomCleared: 0,
    coins: 0,
    orbs: 0,
    orbFragments: 0,
    baseHp: 100,
    baseAttack: 20,
    baseDefense: 10,
    healthUpgradeLevel: 0,
    attackUpgradeLevel: 0,
    critRateUpgradeLevel: 0,
    playerCritRate: 0,
    equippedWeaponId: null,
    equippedDefenseId: null,
    totalHp: 100,
    totalAttack: 20,
    totalDefense: 10,
    playtimeSeconds: 0,
    hardMode,
    gameCompleted: false,
    createdAt: now,
    updatedAt: now,
    items: [],
    charmSlots: [
      { id: data.nextItemId++, saveSlotId: data.nextSlotId - 1, slotIndex: 1, charmItemId: null, charmItem: null },
      { id: data.nextItemId++, saveSlotId: data.nextSlotId - 1, slotIndex: 2, charmItemId: null, charmItem: null },
      { id: data.nextItemId++, saveSlotId: data.nextSlotId - 1, slotIndex: 3, charmItemId: null, charmItem: null },
    ],
    roomClearRecords: [],
    equippedWeapon: null,
    equippedDefense: null,
  };
  data.saveSlots.push(newSlot);
  saveData(data);
  return computeSlotStats(newSlot);
};

export const deleteSlot = async (slotNumber: number): Promise<void> => {
  const data = loadData();
  data.saveSlots = data.saveSlots.filter(s => s.slotNumber !== slotNumber);
  saveData(data);
};

export const updatePlayerName = async (slotId: number, newName: string): Promise<SaveSlotDto> => {
  const data = loadData();
  const slot = data.saveSlots.find(s => s.id === slotId);
  if (!slot) throw new Error('Slot not found');
  slot.playerName = newName;
  slot.updatedAt = new Date().toISOString();
  saveData(data);
  return computeSlotStats(slot);
};

export const updateProfileImage = async (slotId: number, imagePath: string): Promise<SaveSlotDto> => {
  const data = loadData();
  const slot = data.saveSlots.find(s => s.id === slotId);
  if (!slot) throw new Error('Slot not found');
  slot.profileImage = imagePath;
  slot.updatedAt = new Date().toISOString();
  saveData(data);
  return computeSlotStats(slot);
};

export const updatePlaytime = async (slotId: number, additionalSeconds: number): Promise<void> => {
  const data = loadData();
  const slot = data.saveSlots.find(s => s.id === slotId);
  if (slot) {
    slot.playtimeSeconds += additionalSeconds;
    saveData(data);
  }
};

export const equipItem = async (
  saveSlotId: number,
  equipType: 'WEAPON' | 'DEFENSE',
  itemId: number | null
): Promise<SaveSlotDto> => {
  const data = loadData();
  const slot = data.saveSlots.find(s => s.id === saveSlotId);
  if (!slot) throw new Error('Slot not found');
  if (equipType === 'WEAPON') slot.equippedWeaponId = itemId;
  else slot.equippedDefenseId = itemId;
  slot.updatedAt = new Date().toISOString();
  saveData(data);
  return computeSlotStats(slot);
};

export const setCharm = async (
  saveSlotId: number,
  slotIndex: number,
  charmItemId: number | null
): Promise<SaveSlotDto> => {
  const data = loadData();
  const slot = data.saveSlots.find(s => s.id === saveSlotId);
  if (!slot) throw new Error('Slot not found');
  const cs = slot.charmSlots.find(c => c.slotIndex === slotIndex);
  if (cs) {
    cs.charmItemId = charmItemId;
    cs.charmItem = charmItemId ? SHOP_ITEMS.find(i => i.id === charmItemId) || null : null;
  }
  saveData(data);
  return computeSlotStats(slot);
};

// ====================== SHOP ======================

export const getAllShopItems = async (): Promise<ShopItemDto[]> => {
  return SHOP_ITEMS.filter(i => i.active);
};

export const getShopItemsByCategory = async (category: string): Promise<ShopItemDto[]> => {
  return SHOP_ITEMS.filter(i => i.category === category && i.active);
};

export const purchaseItem = async (
  saveSlotId: number,
  shopItemId: number,
  quantity: number = 1
): Promise<SaveSlotDto> => {
  const data = loadData();
  const slot = data.saveSlots.find(s => s.id === saveSlotId);
  if (!slot) throw new Error('Slot not found');
  const item = SHOP_ITEMS.find(i => i.id === shopItemId);
  if (!item) throw new Error('Item not found');

  let qty = item.permanent ? 1 : Math.max(1, quantity);

  if (item.permanent && slot.items.some(pi => pi.shopItemId === item.id)) {
    throw new Error('You already own this item');
  }

  const totalCost = item.priceCoin * qty;
  if (slot.coins < totalCost) throw new Error(`Not enough coins. Need ${totalCost}, have ${slot.coins}`);

  slot.coins -= totalCost;
  const existing = slot.items.find(pi => pi.shopItemId === shopItemId);
  if (existing) {
    existing.quantity += qty;
  } else {
    slot.items.push({
      id: data.nextItemId++,
      saveSlotId: slot.id,
      shopItemId: item.id,
      quantity: qty,
      shopItem: item,
    });
  }
  slot.updatedAt = new Date().toISOString();
  saveData(data);
  return computeSlotStats(slot);
};

export const getPlayerItems = async (saveSlotId: number): Promise<PlayerItemDto[]> => {
  const data = loadData();
  const slot = data.saveSlots.find(s => s.id === saveSlotId);
  return slot ? slot.items : [];
};

export const getPlayerItemsByCategory = async (
  saveSlotId: number,
  category: string
): Promise<PlayerItemDto[]> => {
  const data = loadData();
  const slot = data.saveSlots.find(s => s.id === saveSlotId);
  if (!slot) return [];
  return slot.items.filter(pi => pi.shopItem?.category === category);
};

// ====================== BATTLE ======================

export const getEnemyForRoom = async (
  saveSlotId: number,
  roomNumber: number
): Promise<EnemyDto> => {
  const data = loadData();
  const slot = data.saveSlots.find(s => s.id === saveSlotId);
  const enemy = ENEMIES.find(e => e.roomNumber === roomNumber && e.active);
  if (!enemy) throw new Error(`No enemy for room ${roomNumber}`);
  const result = { ...enemy };
  if (slot?.hardMode) {
    result.hp *= 2;
    result.attack *= 2;
  }
  return result;
};

export const processBattleVictory = async (
  saveSlotId: number,
  roomNumber: number
): Promise<BattleResultDto> => {
  const data = loadData();
  const slot = data.saveSlots.find(s => s.id === saveSlotId);
  if (!slot) throw new Error('Slot not found');
  const reward = ROOM_REWARDS.find(r => r.roomNumber === roomNumber);
  if (!reward) throw new Error('No reward for room');

  const record = slot.roomClearRecords.find(r => r.roomNumber === roomNumber);
  const isFirstClear = !record || !record.firstCleared;

  let coinMultiplier = 1.0;
  let orbChance = 0;
  const weapon = slot.equippedWeaponId ? SHOP_ITEMS.find(i => i.id === slot.equippedWeaponId) : null;
  if (weapon?.specialEffect === 'GREED_BOOST') {
    coinMultiplier = 1.2;
    orbChance = 0.18;
  }

  let coinsEarned = 0;
  let orbsEarned = 0;
  let orbFragmentsEarned = 0;

  if (isFirstClear) {
    coinsEarned = Math.round(reward.firstClearCoins * coinMultiplier);
    orbsEarned = reward.firstClearOrbs;
    if (orbChance > 0 && Math.random() < orbChance) orbsEarned += 1;
  } else {
    coinsEarned = Math.round(reward.replayCoins * coinMultiplier);
    orbFragmentsEarned = reward.replayOrbFragments;
    if (orbChance > 0 && Math.random() < orbChance) orbFragmentsEarned += 1;
  }

  slot.coins += coinsEarned;
  slot.orbs += orbsEarned;
  slot.orbFragments += orbFragmentsEarned;
  if (roomNumber > slot.highestRoomCleared) slot.highestRoomCleared = roomNumber;
  if (roomNumber < 13) slot.currentRoom = Math.max(slot.currentRoom, roomNumber + 1);
  if (roomNumber === 13) slot.gameCompleted = true;

  if (record) {
    record.firstCleared = true;
    record.clearCount += 1;
    record.lastClearedAt = new Date().toISOString();
  } else {
    slot.roomClearRecords.push({
      id: data.nextItemId++,
      saveSlotId: slot.id,
      roomNumber,
      firstCleared: true,
      clearCount: 1,
      lastClearedAt: new Date().toISOString(),
    });
  }

  slot.updatedAt = new Date().toISOString();
  saveData(data);

  return {
    saveSlotId,
    roomNumber,
    victory: true,
    firstClear: isFirstClear,
    coinsEarned,
    orbsEarned,
    orbFragmentsEarned,
    coinMultiplier,
    orbChance,
  };
};

export const usePotion = async (
  saveSlotId: number,
  shopItemId: number
): Promise<PlayerItemDto> => {
  const data = loadData();
  const slot = data.saveSlots.find(s => s.id === saveSlotId);
  if (!slot) throw new Error('Slot not found');
  const pi = slot.items.find(i => i.shopItemId === shopItemId);
  if (!pi || pi.quantity <= 0) throw new Error('No potions left');

  pi.quantity -= 1;
  if (pi.quantity <= 0) {
    slot.items = slot.items.filter(i => i.shopItemId !== shopItemId);
  }
  saveData(data);
  return { ...pi, quantity: Math.max(0, pi.quantity) };
};

// ====================== UPGRADES ======================

export const getUpgradeInfo = async (saveSlotId: number): Promise<UpgradeInfoResponse> => {
  const data = loadData();
  const slot = data.saveSlots.find(s => s.id === saveSlotId);
  if (!slot) throw new Error('Slot not found');
  const cost = (level: number) => level === 0 ? 0 : level < 20 ? 1 : 2;
  return {
    healthLevel: slot.healthUpgradeLevel,
    healthCost: cost(slot.healthUpgradeLevel),
    attackLevel: slot.attackUpgradeLevel,
    attackCost: cost(slot.attackUpgradeLevel),
    critRateLevel: slot.critRateUpgradeLevel,
    critRateCost: cost(slot.critRateUpgradeLevel),
    currentOrbs: slot.orbs,
  };
};

export const performUpgrade = async (
  saveSlotId: number,
  upgradeType: 'HEALTH' | 'ATTACK' | 'CRIT_RATE'
): Promise<SaveSlotDto> => {
  const data = loadData();
  const slot = data.saveSlots.find(s => s.id === saveSlotId);
  if (!slot) throw new Error('Slot not found');
  const cost = (level: number) => level === 0 ? 0 : level < 20 ? 1 : 2;

  let currentLevel = 0;
  switch (upgradeType) {
    case 'HEALTH': currentLevel = slot.healthUpgradeLevel; break;
    case 'ATTACK': currentLevel = slot.attackUpgradeLevel; break;
    case 'CRIT_RATE': currentLevel = slot.critRateUpgradeLevel; break;
  }

  const orbCost = cost(currentLevel);
  if (slot.orbs < orbCost) throw new Error('Not enough orbs');
  slot.orbs -= orbCost;

  switch (upgradeType) {
    case 'HEALTH':
      slot.healthUpgradeLevel += 1;
      slot.baseHp += 5;
      break;
    case 'ATTACK':
      slot.attackUpgradeLevel += 1;
      slot.baseAttack += 3;
      break;
    case 'CRIT_RATE':
      slot.critRateUpgradeLevel += 1;
      slot.playerCritRate += 0.5;
      break;
  }
  slot.updatedAt = new Date().toISOString();
  saveData(data);
  return computeSlotStats(slot);
};

// ====================== TRADE ======================

export const performTrade = async (
  saveSlotId: number,
  tradeType: 'FRAGMENTS_TO_ORB' | 'COINS_TO_ORB',
  quantity: number = 1
): Promise<SaveSlotDto> => {
  const data = loadData();
  const slot = data.saveSlots.find(s => s.id === saveSlotId);
  if (!slot) throw new Error('Slot not found');
  const qty = Math.max(1, quantity);

  if (tradeType === 'FRAGMENTS_TO_ORB') {
    const need = 10 * qty;
    if (slot.orbFragments < need) throw new Error(`Need ${need} fragments, have ${slot.orbFragments}`);
    slot.orbFragments -= need;
    slot.orbs += qty;
  } else {
    const need = 5000 * qty;
    if (slot.coins < need) throw new Error(`Need ${need} coins, have ${slot.coins}`);
    slot.coins -= need;
    slot.orbs += qty;
  }
  saveData(data);
  return computeSlotStats(slot);
};

// ====================== DEV ======================

export const devLogin = async (
  username: string,
  password: string
): Promise<{ success: boolean; message: string }> => {
  if (username === 'Momo Joestar' && password === '123456789') {
    return { success: true, message: 'Login successful' };
  }
  return { success: false, message: 'Invalid credentials' };
};

export const getAllEnemies = async (): Promise<EnemyDto[]> => ENEMIES;
export const updateEnemy = async (enemy: EnemyDto): Promise<EnemyDto> => {
  const idx = ENEMIES.findIndex(e => e.id === enemy.id);
  if (idx >= 0) ENEMIES[idx] = enemy;
  return enemy;
};
export const createEnemy = async (enemy: Omit<EnemyDto, 'id'>): Promise<EnemyDto> => {
  const newEnemy = { ...enemy, id: ENEMIES.length + 1 } as EnemyDto;
  ENEMIES.push(newEnemy);
  return newEnemy;
};
export const deleteEnemy = async (id: number): Promise<void> => {
  const idx = ENEMIES.findIndex(e => e.id === id);
  if (idx >= 0) ENEMIES.splice(idx, 1);
};

export const getAllShopItemsAdmin = async (): Promise<ShopItemDto[]> => SHOP_ITEMS;
export const updateShopItem = async (item: ShopItemDto): Promise<ShopItemDto> => {
  const idx = SHOP_ITEMS.findIndex(i => i.id === item.id);
  if (idx >= 0) SHOP_ITEMS[idx] = item;
  return item;
};
export const createShopItem = async (item: Omit<ShopItemDto, 'id'>): Promise<ShopItemDto> => {
  const newItem = { ...item, id: SHOP_ITEMS.length + 100 } as ShopItemDto;
  SHOP_ITEMS.push(newItem);
  return newItem;
};
export const deleteShopItem = async (id: number): Promise<void> => {
  const idx = SHOP_ITEMS.findIndex(i => i.id === id);
  if (idx >= 0) SHOP_ITEMS.splice(idx, 1);
};

export const getAllConfigs = async (): Promise<GameConfigDto[]> => GAME_CONFIGS;
export const updateConfig = async (config: GameConfigDto): Promise<GameConfigDto> => {
  const idx = GAME_CONFIGS.findIndex(c => c.id === config.id);
  if (idx >= 0) GAME_CONFIGS[idx] = config;
  return config;
};

export const getAllRewards = async (): Promise<RoomRewardDto[]> => ROOM_REWARDS;
export const updateReward = async (reward: RoomRewardDto): Promise<RoomRewardDto> => {
  const idx = ROOM_REWARDS.findIndex(r => r.id === reward.id);
  if (idx >= 0) ROOM_REWARDS[idx] = reward;
  return reward;
};
