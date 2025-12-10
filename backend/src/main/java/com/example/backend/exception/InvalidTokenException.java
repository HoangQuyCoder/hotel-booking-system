package com.example.backend.exception;

public class InvalidTokenException extends AppException {
    public InvalidTokenException(String message) {
        super(message);
    }
}
