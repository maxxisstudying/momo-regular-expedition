package com.example.momo.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class RoomRewardDto {

    private Long id;
    private Integer roomNumber;
    private Integer firstClearCoins;
    private Integer firstClearOrbs;
    private Integer replayCoins;
    private Integer replayOrbFragments;
}
