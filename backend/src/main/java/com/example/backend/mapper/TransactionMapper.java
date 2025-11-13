package com.example.backend.mapper;

import com.example.backend.dto.response.TransactionResponse;
import com.example.backend.model.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransactionMapper extends BaseMapper<Transaction, TransactionResponse> {

    @Mapping(source = "booking.id", target = "bookingId")
    TransactionResponse toResponse(Transaction transaction);
}
