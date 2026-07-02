package com.example.momo.dao;

import com.example.momo.entity.SaveSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SaveSlotDao extends JpaRepository<SaveSlot, Long> {

    List<SaveSlot> findAllByOrderBySlotNumberAsc();

    Optional<SaveSlot> findBySlotNumber(Integer slotNumber);

    boolean existsBySlotNumber(Integer slotNumber);
}
