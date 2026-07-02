package com.example.momo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dev_accounts")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class DevAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(nullable = false, length = 255)
    private String password;
}
