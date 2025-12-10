package com.example.backend.exception;

public class EmailSendException extends AppException {
    public EmailSendException(String message, Throwable cause) {
        super(message, cause);
    }
}
