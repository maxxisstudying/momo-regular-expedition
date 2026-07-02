package com.example.momo.dao;

import com.example.momo.entity.Enemy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnemyDao extends JpaRepository<Enemy, Long> {

    Optional<Enemy> findByRoomNumberAndActiveTrue(Integer roomNumber);

    List<Enemy> findByActiveTrue();

    List<Enemy> findAllByOrderByRoomNumberAsc();
}
