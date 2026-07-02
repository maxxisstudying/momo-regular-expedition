package com.example.momo.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class GameConfigDto {

    private Long id;
    private String configKey;
    private String configValue;
    private String description;
}
