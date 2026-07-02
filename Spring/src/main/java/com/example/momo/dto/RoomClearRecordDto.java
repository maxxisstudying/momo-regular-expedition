package com.example.momo.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class RoomClearRecordDto {

    private Long id;
    private Long saveSlotId;
    private Integer roomNumber;
    private Boolean firstCleared;
    private Integer clearCount;
    private LocalDateTime lastClearedAt;
}
