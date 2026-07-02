package com.example.momo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "game_config")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class GameConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Config key, e.g., "PLAYER_BASE_HP", "ORB_UPGRADE_COST_THRESHOLD" */
    @Column(nullable = false, unique = true, length = 100)
    private String configKey;

    /** Config value as string (parse as needed) */
    @Column(nullable = false, length = 1000)
    private String configValue;

    /** Description of this config for Dev mode UI */
    @Column(length = 500)
    private String description;
}
