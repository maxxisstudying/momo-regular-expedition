package com.example.momo.config;

import com.example.momo.dao.*;
import com.example.momo.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final DevAccountDao devAccountDao;
    private final ShopItemDao shopItemDao;
    private final EnemyDao enemyDao;
    private final RoomRewardDao roomRewardDao;
    private final GameConfigDao gameConfigDao;

    @Override
    @Transactional
    public void run(String... args) {
        initDevAccount();
        initShopItems();
        initEnemies();
        initRoomRewards();
        initGameConfig();
    }

    private void initDevAccount() {
        if (devAccountDao.count() == 0) {
            devAccountDao.save(DevAccount.builder()
                    .username("Momo Joestar")
                    .password("123456789")
                    .build());
        }
    }

    private void initShopItems() {
        if (shopItemDao.count() > 0) return;

        // ==================== WEAPONS (+200 coins base) ====================
        shopItemDao.save(ShopItem.builder()
                .name("Rusty Blade")
                .category("WEAPON")
                .description("An old blade that carries Clostridium tetani bacteria. Stack 5 hits to paralyze enemy.")
                .priceCoin(400).priceOrb(0)
                .attackBonus(20).defenseBonus(0).hpBonus(0).healAmount(0)
                .specialEffect("PARALYZE").effectParams("{\"stacksNeeded\":5,\"paralyzeTurns\":4,\"bossParalyzeTurns\":2}")
                .permanent(true).maxUsesPerMatch(0).active(true).build());

        shopItemDao.save(ShopItem.builder()
                .name("Empty Gun")
                .category("WEAPON")
                .description("A mysterious gun that grants an extra turn after 5 hits.")
                .priceCoin(480).priceOrb(0)
                .attackBonus(28).defenseBonus(0).hpBonus(0).healAmount(0)
                .specialEffect("EXTRA_TURN").effectParams("{\"hitsNeeded\":5}")
                .permanent(true).maxUsesPerMatch(0).active(true).build());

        shopItemDao.save(ShopItem.builder()
                .name("Wise Mage's Staff")
                .category("WEAPON")
                .description("A staff imbued with healing magic. Boosts potion healing by 1.3x.")
                .priceCoin(350).priceOrb(0)
                .attackBonus(15).defenseBonus(0).hpBonus(0).healAmount(0)
                .specialEffect("BOOST_HEAL").effectParams("{\"healMultiplier\":1.3}")
                .permanent(true).maxUsesPerMatch(0).active(true).build());

        shopItemDao.save(ShopItem.builder()
                .name("Greed Dagger")
                .category("WEAPON")
                .description("A dagger that increases coin rewards by 1.2x and has 18% chance for bonus orbs.")
                .priceCoin(380).priceOrb(0)
                .attackBonus(18).defenseBonus(0).hpBonus(0).healAmount(0)
                .specialEffect("GREED_BOOST").effectParams("{\"coinMultiplier\":1.2,\"orbChance\":0.18}")
                .permanent(true).maxUsesPerMatch(0).active(true).build());

        shopItemDao.save(ShopItem.builder()
                .name("Pure Nail")
                .category("WEAPON")
                .description("A legendary nail with 1% chance to release Howling Wraith for 5x damage.")
                .priceCoin(510).priceOrb(0)
                .attackBonus(31).defenseBonus(0).hpBonus(0).healAmount(0)
                .specialEffect("HOWLING_WRAITH").effectParams("{\"chance\":0.01,\"damageMultiplier\":5}")
                .permanent(true).maxUsesPerMatch(0).active(true).build());

        shopItemDao.save(ShopItem.builder()
                .name("Vampire Sword")
                .category("WEAPON")
                .description("Dark blade that steals 3% of damage dealt as HP.")
                .priceCoin(400).priceOrb(0)
                .attackBonus(20).defenseBonus(0).hpBonus(0).healAmount(0)
                .specialEffect("LIFESTEAL").effectParams("{\"lifestealPercent\":0.03}")
                .permanent(true).maxUsesPerMatch(0).active(true).build());

        // ==================== DEFENSE (+200 coins base) ====================
        shopItemDao.save(ShopItem.builder()
                .name("Blanket")
                .category("DEFENSE")
                .description("A cozy blanket with 5% chance to skip enemy turn.")
                .priceCoin(340).priceOrb(0)
                .attackBonus(0).defenseBonus(14).hpBonus(0).healAmount(0)
                .specialEffect("SKIP_TURN").effectParams("{\"skipChance\":0.05}")
                .permanent(true).maxUsesPerMatch(0).active(true).build());

        shopItemDao.save(ShopItem.builder()
                .name("Thorned Armor")
                .category("DEFENSE")
                .description("Reflects 8% of damage taken back to the enemy.")
                .priceCoin(380).priceOrb(0)
                .attackBonus(0).defenseBonus(18).hpBonus(0).healAmount(0)
                .specialEffect("REFLECT").effectParams("{\"reflectPercent\":0.08}")
                .permanent(true).maxUsesPerMatch(0).active(true).build());

        shopItemDao.save(ShopItem.builder()
                .name("Barbarian Chestplate")
                .category("DEFENSE")
                .description("Every 4 hits taken reduces incoming damage by 3% (stacks).")
                .priceCoin(380).priceOrb(0)
                .attackBonus(0).defenseBonus(18).hpBonus(0).healAmount(0)
                .specialEffect("STACK_DEF").effectParams("{\"hitsNeeded\":4,\"reductionPerStack\":0.03}")
                .permanent(true).maxUsesPerMatch(0).active(true).build());

        shopItemDao.save(ShopItem.builder()
                .name("Dwarf King's Armor")
                .category("DEFENSE")
                .description("Every 3 hits taken reduces enemy crit chance by 1.5% (cap 40%).")
                .priceCoin(350).priceOrb(0)
                .attackBonus(0).defenseBonus(15).hpBonus(0).healAmount(0)
                .specialEffect("CRIT_REDUCE").effectParams("{\"hitsNeeded\":3,\"reductionPerStack\":1.5,\"maxReduction\":40}")
                .permanent(true).maxUsesPerMatch(0).active(true).build());

        // ==================== POTIONS ====================
        shopItemDao.save(ShopItem.builder()
                .name("Purple Potion")
                .category("POTION")
                .description("Restores 45 HP.")
                .priceCoin(50).priceOrb(0)
                .attackBonus(0).defenseBonus(0).hpBonus(0).healAmount(45)
                .specialEffect(null).effectParams(null)
                .permanent(false).maxUsesPerMatch(5).active(true).build());

        shopItemDao.save(ShopItem.builder()
                .name("Grey Potion")
                .category("POTION")
                .description("Immune to next enemy attack and restores 40 HP.")
                .priceCoin(80).priceOrb(0)
                .attackBonus(0).defenseBonus(0).hpBonus(0).healAmount(40)
                .specialEffect("IMMUNE_NEXT").effectParams(null)
                .permanent(false).maxUsesPerMatch(2).active(true).build());

        shopItemDao.save(ShopItem.builder()
                .name("Red Elixir")
                .category("POTION")
                .description("First 2 attacks deal 1.5x damage.")
                .priceCoin(100).priceOrb(0)
                .attackBonus(0).defenseBonus(0).hpBonus(0).healAmount(0)
                .specialEffect("DAMAGE_BOOST").effectParams("{\"attacks\":2,\"multiplier\":1.5}")
                .permanent(false).maxUsesPerMatch(2).active(true).build());

        shopItemDao.save(ShopItem.builder()
                .name("Yellow Elixir")
                .category("POTION")
                .description("First 3 hits taken are reduced by 40%.")
                .priceCoin(90).priceOrb(0)
                .attackBonus(0).defenseBonus(0).hpBonus(0).healAmount(0)
                .specialEffect("DEFENSE_BOOST").effectParams("{\"hits\":3,\"reduction\":0.4}")
                .permanent(false).maxUsesPerMatch(2).active(true).build());

        shopItemDao.save(ShopItem.builder()
                .name("Green Elixir")
                .category("POTION")
                .description("Attack twice in a single turn. Max 2 uses per match.")
                .priceCoin(120).priceOrb(0)
                .attackBonus(0).defenseBonus(0).hpBonus(0).healAmount(0)
                .specialEffect("EXTRA_ATTACK").effectParams(null)
                .permanent(false).maxUsesPerMatch(2).active(true).build());

        shopItemDao.save(ShopItem.builder()
                .name("Yellow Potion")
                .category("POTION")
                .description("Permanently boost defense by 15 for this match. Can only use once.")
                .priceCoin(70).priceOrb(0)
                .attackBonus(0).defenseBonus(15).hpBonus(0).healAmount(0)
                .specialEffect(null).effectParams(null)
                .permanent(false).maxUsesPerMatch(1).active(true).build());

        shopItemDao.save(ShopItem.builder()
                .name("Green Juice")
                .category("POTION")
                .description("Gain 1.5% dodge rate for this match.")
                .priceCoin(60).priceOrb(0)
                .attackBonus(0).defenseBonus(0).hpBonus(0).healAmount(0)
                .specialEffect("DODGE_BOOST").effectParams("{\"dodgeRate\":1.5}")
                .permanent(false).maxUsesPerMatch(3).active(true).build());

        shopItemDao.save(ShopItem.builder()
                .name("Golden Heal")
                .category("POTION")
                .description("Heal 30 HP now and 20 HP next turn.")
                .priceCoin(110).priceOrb(0)
                .attackBonus(0).defenseBonus(0).hpBonus(0).healAmount(30)
                .specialEffect("GOLDEN_HEAL").effectParams("{\"nextTurnHeal\":20}")
                .permanent(false).maxUsesPerMatch(2).active(true).build());

        // ==================== CHARMS (+200 coins base) ====================
        shopItemDao.save(ShopItem.builder()
                .name("Lucky Charm")
                .category("CHARM")
                .description("3% chance to gain an extra turn after attacking.")
                .priceCoin(350).priceOrb(0)
                .attackBonus(0).defenseBonus(0).hpBonus(0).healAmount(0)
                .specialEffect("EXTRA_TURN_CHANCE").effectParams("{\"chance\":0.03}")
                .permanent(true).maxUsesPerMatch(0).active(true).build());

        shopItemDao.save(ShopItem.builder()
                .name("Stone Mask")
                .category("CHARM")
                .description("Regain 5% of damage dealt as HP.")
                .priceCoin(380).priceOrb(0)
                .attackBonus(0).defenseBonus(0).hpBonus(0).healAmount(0)
                .specialEffect("LIFESTEAL").effectParams("{\"percent\":0.05}")
                .permanent(true).maxUsesPerMatch(0).active(true).build());

        shopItemDao.save(ShopItem.builder()
                .name("Red Stone")
                .category("CHARM")
                .description("Gain 3% dodge rate.")
                .priceCoin(320).priceOrb(0)
                .attackBonus(0).defenseBonus(0).hpBonus(0).healAmount(0)
                .specialEffect("DODGE").effectParams("{\"dodgeRate\":3}")
                .permanent(true).maxUsesPerMatch(0).active(true).build());

        shopItemDao.save(ShopItem.builder()
                .name("Cain")
                .category("CHARM")
                .description("1% chance to reflect exact damage back to enemy.")
                .priceCoin(400).priceOrb(0)
                .attackBonus(0).defenseBonus(0).hpBonus(0).healAmount(0)
                .specialEffect("FULL_REFLECT").effectParams("{\"chance\":0.01}")
                .permanent(true).maxUsesPerMatch(0).active(true).build());

        shopItemDao.save(ShopItem.builder()
                .name("Secret Momo Family's Scarf")
                .category("CHARM")
                .description("1% chance to completely immune enemy attack (cap 2 times per match).")
                .priceCoin(450).priceOrb(0)
                .attackBonus(0).defenseBonus(0).hpBonus(0).healAmount(0)
                .specialEffect("IMMUNE_CHANCE").effectParams("{\"chance\":0.01,\"maxUses\":2}")
                .permanent(true).maxUsesPerMatch(0).active(true).build());
    }

    private void initEnemies() {
        if (enemyDao.count() > 0) return;

        // Room 1 - Easy
        enemyDao.save(Enemy.builder()
                .name("Slime").roomNumber(1)
                .hp(80).attack(12).defense(5)
                .reduceDamageChance(40.0).damageReductionOptions("[0.4,0.5,0.6,0.7]")
                .critChance(0.0).critDamageOptions("[]")
                .spriteImage("🟢").active(true).build());

        // Room 2 - Low HP, Strong ATK
        enemyDao.save(Enemy.builder()
                .name("Goblin Assassin").roomNumber(2)
                .hp(60).attack(22).defense(3)
                .reduceDamageChance(35.0).damageReductionOptions("[0.4,0.6]")
                .critChance(0.0).critDamageOptions("[]")
                .spriteImage("🗡️").active(true).build());

        // Room 3 (+20 hp, +18 def)
        enemyDao.save(Enemy.builder()
                .name("Stone Golem").roomNumber(3)
                .hp(120).attack(18).defense(26)
                .reduceDamageChance(30.0).damageReductionOptions("[0.6]")
                .critChance(0.0).critDamageOptions("[]")
                .spriteImage("🗿").active(true).build());

        // Room 4 (+30 hp, +18 def)
        enemyDao.save(Enemy.builder()
                .name("Dark Knight").roomNumber(4)
                .hp(140).attack(22).defense(28)
                .reduceDamageChance(28.0).damageReductionOptions("[0.5,0.6]")
                .critChance(0.0).critDamageOptions("[]")
                .spriteImage("⚔️").active(true).build());

        // Room 5 (+40 hp, +18 def)
        enemyDao.save(Enemy.builder()
                .name("Werewolf").roomNumber(5)
                .hp(160).attack(26).defense(22)
                .reduceDamageChance(27.0).damageReductionOptions("[0.4,0.5]")
                .critChance(8.0).critDamageOptions("[1.02]")
                .spriteImage("🐺").active(true).build());

        // Room 6 (+45 hp, +18 def)
        enemyDao.save(Enemy.builder()
                .name("Vampire Lord").roomNumber(6)
                .hp(175).attack(28).defense(24)
                .reduceDamageChance(26.0).damageReductionOptions("[0.4]")
                .critChance(10.0).critDamageOptions("[1.03,1.05,1.08]")
                .spriteImage("🧛").active(true).build());

        // Room 7 - Boss (+30 hp)
        enemyDao.save(Enemy.builder()
                .name("Ancient Dragon").roomNumber(7)
                .hp(280).attack(38).defense(30)
                .reduceDamageChance(25.0).damageReductionOptions("[0.3,0.4]")
                .critChance(12.0).critDamageOptions("[1.1,1.12,1.15,1.17]")
                .spriteImage("🐉").active(true).build());

        // Room 8 - Boss (+30 hp)
        enemyDao.save(Enemy.builder()
                .name("Demon General").roomNumber(8)
                .hp(320).attack(42).defense(32)
                .reduceDamageChance(25.0).damageReductionOptions("[0.3]")
                .critChance(12.0).critDamageOptions("[1.12,1.15,1.17]")
                .spriteImage("👹").active(true).build());

        // Room 9 - Boss (+30 hp)
        enemyDao.save(Enemy.builder()
                .name("Lich King").roomNumber(9)
                .hp(360).attack(45).defense(28)
                .reduceDamageChance(24.0).damageReductionOptions("[0.3]")
                .critChance(12.2).critDamageOptions("[1.14,1.15,1.17,1.18]")
                .spriteImage("💀").active(true).build());

        // Room 10 - Boss (+30 hp)
        enemyDao.save(Enemy.builder()
                .name("Chaos Titan").roomNumber(10)
                .hp(400).attack(48).defense(35)
                .reduceDamageChance(23.0).damageReductionOptions("[0.3]")
                .critChance(12.5).critDamageOptions("[1.15,1.17,1.18,1.19]")
                .spriteImage("🔥").active(true).build());

        // Room 11 - Final (+500 hp)
        enemyDao.save(Enemy.builder()
                .name("Shadow Emperor").roomNumber(11)
                .hp(700).attack(55).defense(40)
                .reduceDamageChance(20.0).damageReductionOptions("[0.3]")
                .critChance(13.0).critDamageOptions("[1.1,1.12,1.15,1.17,1.2,1.25,1.3]")
                .spriteImage("👑").active(true).build());

        // Room 12 - Final (+500 hp)
        enemyDao.save(Enemy.builder()
                .name("Void Harbinger").roomNumber(12)
                .hp(850).attack(62).defense(45)
                .reduceDamageChance(18.0).damageReductionOptions("[0.3]")
                .critChance(14.0).critDamageOptions("[1.15,1.17,1.3,1.4,1.45]")
                .spriteImage("🌑").active(true).build());

        // Room 13 - Final Boss (+500 hp)
        enemyDao.save(Enemy.builder()
                .name("The Eternal One").roomNumber(13)
                .hp(1000).attack(70).defense(50)
                .reduceDamageChance(10.0).damageReductionOptions("[0.2]")
                .critChance(15.0).critDamageOptions("[1.2,1.4,1.45,1.5,1.55,1.6]")
                .spriteImage("⭐").active(true).build());
    }

    private void initRoomRewards() {
        if (roomRewardDao.count() > 0) return;

        // Rooms 1-2: 18 coins each + adjustments (+20 for room 2)
        roomRewardDao.save(RoomReward.builder().roomNumber(1)
                .firstClearCoins(18).firstClearOrbs(0).replayCoins(30).replayOrbFragments(0).build());
        roomRewardDao.save(RoomReward.builder().roomNumber(2)
                .firstClearCoins(38).firstClearOrbs(0).replayCoins(30).replayOrbFragments(0).build());

        // Rooms 3-5: 40,60,90 + adjustments
        roomRewardDao.save(RoomReward.builder().roomNumber(3)
                .firstClearCoins(65).firstClearOrbs(0).replayCoins(30).replayOrbFragments(0).build());
        roomRewardDao.save(RoomReward.builder().roomNumber(4)
                .firstClearCoins(95).firstClearOrbs(0).replayCoins(30).replayOrbFragments(0).build());
        roomRewardDao.save(RoomReward.builder().roomNumber(5)
                .firstClearCoins(130).firstClearOrbs(0).replayCoins(30).replayOrbFragments(0).build());

        // Room 6: 1 orb, 150 + 45 coins
        roomRewardDao.save(RoomReward.builder().roomNumber(6)
                .firstClearCoins(195).firstClearOrbs(1).replayCoins(30).replayOrbFragments(0).build());

        // Rooms 7-10: 1 orb each, coins + adjustments, replay gives fragments
        roomRewardDao.save(RoomReward.builder().roomNumber(7)
                .firstClearCoins(260).firstClearOrbs(1).replayCoins(45).replayOrbFragments(2).build());
        roomRewardDao.save(RoomReward.builder().roomNumber(8)
                .firstClearCoins(420).firstClearOrbs(1).replayCoins(45).replayOrbFragments(2).build());
        roomRewardDao.save(RoomReward.builder().roomNumber(9)
                .firstClearCoins(580).firstClearOrbs(1).replayCoins(45).replayOrbFragments(2).build());
        roomRewardDao.save(RoomReward.builder().roomNumber(10)
                .firstClearCoins(600).firstClearOrbs(1).replayCoins(45).replayOrbFragments(2).build());

        // Rooms 11-13: Final rewards + 200 more coins
        roomRewardDao.save(RoomReward.builder().roomNumber(11)
                .firstClearCoins(800).firstClearOrbs(3).replayCoins(45).replayOrbFragments(2).build());
        roomRewardDao.save(RoomReward.builder().roomNumber(12)
                .firstClearCoins(1100).firstClearOrbs(5).replayCoins(45).replayOrbFragments(2).build());
        roomRewardDao.save(RoomReward.builder().roomNumber(13)
                .firstClearCoins(1500).firstClearOrbs(7).replayCoins(45).replayOrbFragments(2).build());
    }

    private void initGameConfig() {
        if (gameConfigDao.count() > 0) return;

        gameConfigDao.save(GameConfig.builder()
                .configKey("PLAYER_BASE_HP").configValue("100")
                .description("Starting HP for new players").build());
        gameConfigDao.save(GameConfig.builder()
                .configKey("PLAYER_BASE_ATK").configValue("20")
                .description("Starting Attack for new players").build());
        gameConfigDao.save(GameConfig.builder()
                .configKey("PLAYER_BASE_DEF").configValue("10")
                .description("Starting Defense for new players").build());
        gameConfigDao.save(GameConfig.builder()
                .configKey("ORB_UPGRADE_THRESHOLD").configValue("20")
                .description("Level at which orb upgrade cost increases to 2").build());
        gameConfigDao.save(GameConfig.builder()
                .configKey("HP_PER_UPGRADE").configValue("5")
                .description("HP gained per health upgrade level").build());
        gameConfigDao.save(GameConfig.builder()
                .configKey("ATK_PER_UPGRADE").configValue("3")
                .description("ATK gained per attack upgrade level").build());
        gameConfigDao.save(GameConfig.builder()
                .configKey("CRIT_PER_UPGRADE").configValue("0.5")
                .description("Crit rate % gained per crit upgrade level").build());
        gameConfigDao.save(GameConfig.builder()
                .configKey("FRAGMENTS_PER_ORB").configValue("10")
                .description("Orb fragments needed to trade for 1 orb").build());
        gameConfigDao.save(GameConfig.builder()
                .configKey("COINS_PER_ORB").configValue("5000")
                .description("Coins needed to trade for 1 orb").build());
        gameConfigDao.save(GameConfig.builder()
                .configKey("HARD_MODE_MULTIPLIER").configValue("2")
                .description("Multiplier for enemy HP and ATK in hard mode").build());
    }
}
