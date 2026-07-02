package com.example.momo.dao;

import com.example.momo.entity.ShopItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopItemDao extends JpaRepository<ShopItem, Long> {

    List<ShopItem> findByCategory(String category);

    List<ShopItem> findByCategoryAndActiveTrue(String category);

    List<ShopItem> findByActiveTrue();
}
