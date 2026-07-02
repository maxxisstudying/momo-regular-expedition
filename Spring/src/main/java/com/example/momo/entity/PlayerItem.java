package com.example.momo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "player_items",
       uniqueConstraints = @UniqueConstraint(columnNames = {"save_slot_id", "shop_item_id"}))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PlayerItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Which save slot owns this item */
    @Column(name = "save_slot_id", nullable = false)
    private Long saveSlotId;

    /** Which shop item this refers to */
    @Column(name = "shop_item_id", nullable = false)
    private Long shopItemId;

    /** Quantity owned (for potions this can be > 1; for permanent items = 1) */
    @Column(nullable = false)
    private Integer quantity;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "shop_item_id", insertable = false, updatable = false)
    private ShopItem shopItem;

    @PrePersist
    protected void setDefaults() {
        if (quantity == null) quantity = 1;
    }
}
