package com.example.backend.controller;

import com.example.backend.common.TransactionStatus;
import com.example.backend.dto.filter.TransactionFilterRequest;
import com.example.backend.dto.request.TransactionRequest;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.TransactionResponse;
import com.example.backend.service.TransactionService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    private TransactionService transactionService;

    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENT', 'STAFF', 'ADMIN')")
    public ResponseEntity<TransactionResponse> createTransaction(@Valid @RequestBody TransactionRequest request) {
        return new ResponseEntity<>(transactionService.createTransaction(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'STAFF')")
    public ResponseEntity<TransactionResponse> getTransaction(@PathVariable UUID id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }

    @PutMapping("/{id}/refund")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<TransactionResponse> refundTransaction(@PathVariable UUID id) {
        return ResponseEntity.ok(transactionService.refundTransaction(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<PagedResponse<TransactionResponse>> getAllTransactions(TransactionFilterRequest filterRequest) {
        return ResponseEntity.ok(transactionService.getAllTransactions(filterRequest));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Void> deleteTransaction(@PathVariable UUID id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<TransactionResponse> updateTransactionStatus(
            @PathVariable UUID id,
            @Valid @RequestBody TransactionStatus status) {
        return ResponseEntity.ok(transactionService.updateTransactionStatus(id, status));
    }
}
