package com.example.momo.exception;

public class EnemyNotFoundException extends RuntimeException {
    public EnemyNotFoundException(String message) {
        super(message);
    }
}
