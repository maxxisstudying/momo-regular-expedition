package com.example.momo.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class NewGameDto {

    private Integer slotNumber;
    private String playerName;
    /** false = Normal, true = Hard */
    private Boolean hardMode;
}
