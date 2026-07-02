package com.example.momo.exception;

public class SlotAlreadyExistsException extends RuntimeException {
    public SlotAlreadyExistsException(String message) {
        super(message);
    }
}
