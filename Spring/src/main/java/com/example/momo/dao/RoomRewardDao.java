package com.example.momo.dao;

import com.example.momo.entity.RoomReward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomRewardDao extends JpaRepository<RoomReward, Long> {

    Optional<RoomReward> findByRoomNumber(Integer roomNumber);
}
