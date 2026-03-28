package com.example.backend.mapper;

import com.example.backend.config.BaseMapperConfig;
import com.example.backend.dto.request.TransactionRequest;
import com.example.backend.dto.response.TransactionResponse;
import com.example.backend.model.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = BaseMapperConfig.class, uses = {BookingMapper.class})
public interface TransactionMapper extends BaseMapper<Transaction, TransactionRequest, TransactionResponse> {

    @Override
    @Mapping(target = "isActive", constant = "true")
    Transaction toEntity(TransactionRequest request);
}