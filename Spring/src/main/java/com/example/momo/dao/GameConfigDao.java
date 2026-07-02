package com.example.momo.dao;

import com.example.momo.entity.GameConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GameConfigDao extends JpaRepository<GameConfig, Long> {

    Optional<GameConfig> findByConfigKey(String configKey);
}
