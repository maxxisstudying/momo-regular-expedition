package com.example.momo.dao;

import com.example.momo.entity.DevAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DevAccountDao extends JpaRepository<DevAccount, Long> {

    Optional<DevAccount> findByUsername(String username);
}
