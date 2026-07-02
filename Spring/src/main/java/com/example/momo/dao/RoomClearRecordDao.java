package com.example.momo.dao;

import com.example.momo.entity.RoomClearRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomClearRecordDao extends JpaRepository<RoomClearRecord, Long> {

    Optional<RoomClearRecord> findBySaveSlotIdAndRoomNumber(Long saveSlotId, Integer roomNumber);

    List<RoomClearRecord> findBySaveSlotIdOrderByRoomNumberAsc(Long saveSlotId);

    void deleteBySaveSlotId(Long saveSlotId);
}
