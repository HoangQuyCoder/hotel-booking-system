package com.example.backend.controller;

import com.example.backend.common.TransactionStatus;
import com.example.backend.dto.filter.TransactionFilterRequest;
import com.example.backend.dto.request.TransactionRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.TransactionResponse;
import com.example.backend.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    // CREATE NEW TRANSACTION
    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENT', 'STAFF', 'ADMIN')")
    public ResponseEntity<ApiResponse<TransactionResponse>> createTransaction(
            @Valid @RequestBody TransactionRequest request) {

        TransactionResponse created = transactionService.createTransaction(request);
        return ResponseEntity
                .status(201)
                .body(ApiResponse.success("Create successful transaction!", created));
    }

    // GET TRANSACTION DETAILS
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'STAFF')")
    public ResponseEntity<ApiResponse<TransactionResponse>> getTransaction(@PathVariable UUID id) {
        TransactionResponse transaction = transactionService.getTransactionById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Get transaction information successfully", transaction)
        );
    }

    // TRANSACTION REFUND
    @PutMapping("/{id}/refund")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ApiResponse<TransactionResponse>> refundTransaction(@PathVariable UUID id) {
        TransactionResponse refunded = transactionService.refundTransaction(id);
        return ResponseEntity.ok(
                ApiResponse.success("Refund transaction successful", refunded)
        );
    }

    // UPDATE TRADING STATUS (PENDING → SUCCESS / FAILED / REFUNDED...)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ApiResponse<TransactionResponse>> updateTransactionStatus(
            @PathVariable UUID id,
            @Valid @RequestBody TransactionStatus status) {

        TransactionResponse updated = transactionService.updateTransactionStatus(id, status);
        String message = switch (status) {
            case COMPLETED -> "Confirm successful transaction";
            case FAILED -> "Update failed transaction status";
            case REFUNDED -> "Refund successful";
            default -> "Update transaction status successfully";
        };

        return ResponseEntity.ok(
                ApiResponse.success(message, updated)
        );
    }

    // GET TRANSACTION LIST
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ApiResponse<PagedResponse<TransactionResponse>>> getAllTransactions(
            TransactionFilterRequest filter) {

        PagedResponse<TransactionResponse> paged = transactionService.getAllTransactions(filter);
        return ResponseEntity.ok(
                ApiResponse.success("Get list of successful transactions", paged)
        );
    }

    // DELETE TRANSACTION
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(@PathVariable UUID id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok(
                ApiResponse.ok("Transaction deleted successfully")
        );
    }
}