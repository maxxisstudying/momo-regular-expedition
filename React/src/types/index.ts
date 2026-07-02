// ==================== API Types ====================

export interface ShopItemDto {
  id: number;
  name: string;
  category: 'WEAPON' | 'DEFENSE' | 'POTION' | 'CHARM';
  description: string;
  priceCoin: number;
  priceOrb: number;
  iconImage: string | null;
  attackBonus: number;
  defenseBonus: number;
  hpBonus: number;
  healAmount: number;
  specialEffect: string | null;
  effectParams: string | null;
  permanent: boolean;
  maxUsesPerMatch: number;
  active: boolean;
}

export interface PlayerItemDto {
  id: number;
  saveSlotId: number;
  shopItemId: number;
  quantity: number;
  shopItem: ShopItemDto | null;
}

export interface PlayerCharmSlotDto {
  id: number;
  saveSlotId: number;
  slotIndex: number;
  charmItemId: number | null;
  charmItem: ShopItemDto | null;
}

export interface RoomClearRecordDto {
  id: number;
  saveSlotId: number;
  roomNumber: number;
  firstCleared: boolean;
  clearCount: number;
  lastClearedAt: string;
}

export interface SaveSlotDto {
  id: number;
  slotNumber: number;
  playerName: string;
  profileImage: string | null;
  currentRoom: number;
  highestRoomCleared: number;
  coins: number;
  orbs: number;
  orbFragments: number;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  healthUpgradeLevel: number;
  attackUpgradeLevel: number;
  critRateUpgradeLevel: number;
  playerCritRate: number;
  equippedWeaponId: number | null;
  equippedDefenseId: number | null;
  totalHp: number;
  totalAttack: number;
  totalDefense: number;
  playtimeSeconds: number;
  hardMode: boolean;
  gameCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  items: PlayerItemDto[];
  charmSlots: PlayerCharmSlotDto[];
  roomClearRecords: RoomClearRecordDto[];
  equippedWeapon: ShopItemDto | null;
  equippedDefense: ShopItemDto | null;
}

export interface EnemyDto {
  id: number;
  name: string;
  roomNumber: number;
  hp: number;
  attack: number;
  defense: number;
  reduceDamageChance: number;
  damageReductionOptions: string;
  critChance: number;
  critDamageOptions: string;
  spriteImage: string | null;
  active: boolean;
}

export interface RoomRewardDto {
  id: number;
  roomNumber: number;
  firstClearCoins: number;
  firstClearOrbs: number;
  replayCoins: number;
  replayOrbFragments: number;
}

export interface BattleResultDto {
  saveSlotId: number;
  roomNumber: number;
  victory: boolean;
  firstClear: boolean;
  coinsEarned: number;
  orbsEarned: number;
  orbFragmentsEarned: number;
  coinMultiplier: number;
  orbChance: number;
}

export interface UpgradeInfoResponse {
  healthLevel: number;
  healthCost: number;
  attackLevel: number;
  attackCost: number;
  critRateLevel: number;
  critRateCost: number;
  currentOrbs: number;
}

export interface GameConfigDto {
  id: number;
  configKey: string;
  configValue: string;
  description: string;
}

// ==================== Game State Types ====================

export interface KeyBindings {
  moveLeft: string;
  moveRight: string;
  moveUp: string;
  moveDown: string;
  select: string;
}

export interface BattleState {
  playerHp: number;
  playerMaxHp: number;
  enemyHp: number;
  enemyMaxHp: number;
  turn: 'player' | 'enemy';
  battleLog: string[];
  isOver: boolean;
  victory: boolean;
  potionsUsedThisMatch: Record<number, number>;
  // Special effect trackers
  paralyzeTurns: number;
  enemyParalyzeStacks: number;
  emptyGunHits: number;
  blanketSkipCharge: number;
  barbarianHits: number;
  barbarianDamageReduction: number;
  dwarfKingHits: number;
  dwarfKingCritReduction: number;
  greenElixirUses: number;
  yellowElixirHits: number;
  redElixirAttacks: number;
  greyPotionImmune: boolean;
  goldenHealNextTurn: boolean;
}

export interface BattlePotionUse {
  itemId: number;
  usesThisMatch: number;
  maxUses: number;
}
