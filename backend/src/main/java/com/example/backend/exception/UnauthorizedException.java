package com.example.backend.exception;

public class UnauthorizedException extends AppException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
