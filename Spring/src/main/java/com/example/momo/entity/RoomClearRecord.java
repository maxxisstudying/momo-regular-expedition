package com.example.momo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "room_clear_records",
       uniqueConstraints = @UniqueConstraint(columnNames = {"save_slot_id", "room_number"}))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class RoomClearRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "save_slot_id", nullable = false)
    private Long saveSlotId;

    @Column(name = "room_number", nullable = false)
    private Integer roomNumber;

    /** Whether this room has been cleared at least once (first-time reward given) */
    @Column(nullable = false)
    private Boolean firstCleared;

    /** Total number of times this room has been cleared */
    @Column(nullable = false)
    private Integer clearCount;

    @Column(nullable = false)
    private LocalDateTime lastClearedAt;

    @PrePersist
    protected void setDefaults() {
        if (firstCleared == null) firstCleared = false;
        if (clearCount == null) clearCount = 0;
        if (lastClearedAt == null) lastClearedAt = LocalDateTime.now();
    }
}
