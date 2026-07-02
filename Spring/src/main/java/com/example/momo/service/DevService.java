package com.example.momo.service;

import com.example.momo.dao.*;
import com.example.momo.dto.*;
import com.example.momo.entity.*;
import com.example.momo.exception.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DevService {

    private final DevAccountDao devAccountDao;
    private final EnemyDao enemyDao;
    private final ShopItemDao shopItemDao;
    private final RoomRewardDao roomRewardDao;
    private final GameConfigDao gameConfigDao;
    private final SaveSlotService saveSlotService;

    /**
     * Verify dev credentials
     */
    public boolean verifyLogin(String username, String password) {
        return devAccountDao.findByUsername(username)
                .map(account -> account.getPassword().equals(password))
                .orElse(false);
    }

    // ==================== Enemy Management ====================

    public List<EnemyDto> getAllEnemies() {
        return enemyDao.findAllByOrderByRoomNumberAsc().stream()
                .map(this::toEnemyDto)
                .collect(Collectors.toList());
    }

    public EnemyDto getEnemy(Long id) {
        Enemy enemy = enemyDao.findById(id)
                .orElseThrow(() -> new EnemyNotFoundException("Enemy not found"));
        return toEnemyDto(enemy);
    }

    @Transactional
    public EnemyDto createEnemy(EnemyDto dto) {
        Enemy enemy = Enemy.builder()
                .name(dto.getName())
                .roomNumber(dto.getRoomNumber())
                .hp(dto.getHp())
                .attack(dto.getAttack())
                .defense(dto.getDefense())
                .reduceDamageChance(dto.getReduceDamageChance())
                .damageReductionOptions(dto.getDamageReductionOptions())
                .critChance(dto.getCritChance())
                .critDamageOptions(dto.getCritDamageOptions())
                .spriteImage(dto.getSpriteImage())
                .active(dto.getActive())
                .build();
        return toEnemyDto(enemyDao.save(enemy));
    }

    @Transactional
    public EnemyDto updateEnemy(Long id, EnemyDto dto) {
        Enemy enemy = enemyDao.findById(id)
                .orElseThrow(() -> new EnemyNotFoundException("Enemy not found"));
        
        enemy.setName(dto.getName());
        enemy.setRoomNumber(dto.getRoomNumber());
        enemy.setHp(dto.getHp());
        enemy.setAttack(dto.getAttack());
        enemy.setDefense(dto.getDefense());
        enemy.setReduceDamageChance(dto.getReduceDamageChance());
        enemy.setDamageReductionOptions(dto.getDamageReductionOptions());
        enemy.setCritChance(dto.getCritChance());
        enemy.setCritDamageOptions(dto.getCritDamageOptions());
        enemy.setSpriteImage(dto.getSpriteImage());
        enemy.setActive(dto.getActive());
        
        return toEnemyDto(enemyDao.save(enemy));
    }

    @Transactional
    public void deleteEnemy(Long id) {
        enemyDao.deleteById(id);
    }

    // ==================== Shop Item Management ====================

    public List<ShopItemDto> getAllShopItems() {
        return shopItemDao.findAll().stream()
                .map(saveSlotService::toShopItemDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ShopItemDto createShopItem(ShopItemDto dto) {
        ShopItem item = ShopItem.builder()
                .name(dto.getName())
                .category(dto.getCategory())
                .description(dto.getDescription())
                .priceCoin(dto.getPriceCoin())
                .priceOrb(dto.getPriceOrb())
                .iconImage(dto.getIconImage())
                .attackBonus(dto.getAttackBonus())
                .defenseBonus(dto.getDefenseBonus())
                .hpBonus(dto.getHpBonus())
                .healAmount(dto.getHealAmount())
                .specialEffect(dto.getSpecialEffect())
                .effectParams(dto.getEffectParams())
                .permanent(dto.getPermanent())
                .maxUsesPerMatch(dto.getMaxUsesPerMatch())
                .active(dto.getActive())
                .build();
        return saveSlotService.toShopItemDto(shopItemDao.save(item));
    }

    @Transactional
    public ShopItemDto updateShopItem(Long id, ShopItemDto dto) {
        ShopItem item = shopItemDao.findById(id)
                .orElseThrow(() -> new ItemNotFoundException("Shop item not found"));
        
        item.setName(dto.getName());
        item.setCategory(dto.getCategory());
        item.setDescription(dto.getDescription());
        item.setPriceCoin(dto.getPriceCoin());
        item.setPriceOrb(dto.getPriceOrb());
        item.setIconImage(dto.getIconImage());
        item.setAttackBonus(dto.getAttackBonus());
        item.setDefenseBonus(dto.getDefenseBonus());
        item.setHpBonus(dto.getHpBonus());
        item.setHealAmount(dto.getHealAmount());
        item.setSpecialEffect(dto.getSpecialEffect());
        item.setEffectParams(dto.getEffectParams());
        item.setPermanent(dto.getPermanent());
        item.setMaxUsesPerMatch(dto.getMaxUsesPerMatch());
        item.setActive(dto.getActive());
        
        return saveSlotService.toShopItemDto(shopItemDao.save(item));
    }

    @Transactional
    public void deleteShopItem(Long id) {
        shopItemDao.deleteById(id);
    }

    // ==================== Room Reward Management ====================

    public List<RoomRewardDto> getAllRewards() {
        return roomRewardDao.findAll().stream()
                .map(this::toRoomRewardDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public RoomRewardDto updateReward(Long id, RoomRewardDto dto) {
        RoomReward reward = roomRewardDao.findById(id)
                .orElseThrow(() -> new InvalidOperationException("Reward not found"));
        
        reward.setFirstClearCoins(dto.getFirstClearCoins());
        reward.setFirstClearOrbs(dto.getFirstClearOrbs());
        reward.setReplayCoins(dto.getReplayCoins());
        reward.setReplayOrbFragments(dto.getReplayOrbFragments());
        
        return toRoomRewardDto(roomRewardDao.save(reward));
    }

    // ==================== Game Config Management ====================

    public List<GameConfigDto> getAllConfigs() {
        return gameConfigDao.findAll().stream()
                .map(this::toConfigDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public GameConfigDto updateConfig(Long id, GameConfigDto dto) {
        GameConfig config = gameConfigDao.findById(id)
                .orElseThrow(() -> new InvalidOperationException("Config not found"));
        
        config.setConfigValue(dto.getConfigValue());
        if (dto.getDescription() != null) {
            config.setDescription(dto.getDescription());
        }
        
        return toConfigDto(gameConfigDao.save(config));
    }

    // ==================== DTO Converters ====================

    private EnemyDto toEnemyDto(Enemy e) {
        return EnemyDto.builder()
                .id(e.getId())
                .name(e.getName())
                .roomNumber(e.getRoomNumber())
                .hp(e.getHp())
                .attack(e.getAttack())
                .defense(e.getDefense())
                .reduceDamageChance(e.getReduceDamageChance())
                .damageReductionOptions(e.getDamageReductionOptions())
                .critChance(e.getCritChance())
                .critDamageOptions(e.getCritDamageOptions())
                .spriteImage(e.getSpriteImage())
                .active(e.getActive())
                .build();
    }

    private RoomRewardDto toRoomRewardDto(RoomReward r) {
        return RoomRewardDto.builder()
                .id(r.getId())
                .roomNumber(r.getRoomNumber())
                .firstClearCoins(r.getFirstClearCoins())
                .firstClearOrbs(r.getFirstClearOrbs())
                .replayCoins(r.getReplayCoins())
                .replayOrbFragments(r.getReplayOrbFragments())
                .build();
    }

    private GameConfigDto toConfigDto(GameConfig c) {
        return GameConfigDto.builder()
                .id(c.getId())
                .configKey(c.getConfigKey())
                .configValue(c.getConfigValue())
                .description(c.getDescription())
                .build();
    }
}
