package com.example.momo.dao;

import com.example.momo.entity.PlayerItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerItemDao extends JpaRepository<PlayerItem, Long> {

    List<PlayerItem> findBySaveSlotId(Long saveSlotId);

    Optional<PlayerItem> findBySaveSlotIdAndShopItemId(Long saveSlotId, Long shopItemId);

    List<PlayerItem> findBySaveSlotIdAndShopItem_Category(Long saveSlotId, String category);

    void deleteBySaveSlotId(Long saveSlotId);
}
