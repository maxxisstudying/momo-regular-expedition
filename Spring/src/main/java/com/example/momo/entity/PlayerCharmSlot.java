package com.example.momo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "player_charm_slots")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PlayerCharmSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "save_slot_id", nullable = false)
    private Long saveSlotId;

    /** Charm slot index: 1, 2, or 3 */
    @Column(nullable = false)
    private Integer slotIndex;

    /** The shop item ID of the equipped charm (nullable if slot is empty) */
    @Column(name = "charm_item_id")
    private Long charmItemId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "charm_item_id", insertable = false, updatable = false)
    private ShopItem charmItem;
}
