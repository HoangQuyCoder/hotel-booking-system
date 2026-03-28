package com.example.backend.config;

import org.mapstruct.MapperConfig;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.NullValuePropertyMappingStrategy;

@MapperConfig(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, // ignore warning global
                nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE // ignore null when update
)
public interface BaseMapperConfig {
}