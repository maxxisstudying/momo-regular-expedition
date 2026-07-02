package com.example.momo.dao;

import com.example.momo.entity.PlayerCharmSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerCharmSlotDao extends JpaRepository<PlayerCharmSlot, Long> {

    List<PlayerCharmSlot> findBySaveSlotIdOrderBySlotIndexAsc(Long saveSlotId);

    void deleteBySaveSlotId(Long saveSlotId);
}
