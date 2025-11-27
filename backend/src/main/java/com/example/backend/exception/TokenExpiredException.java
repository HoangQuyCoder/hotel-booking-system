package com.example.backend.exception;

public class TokenExpiredException extends AppException {
    public TokenExpiredException(String message) {
        super(message);
    }
}
