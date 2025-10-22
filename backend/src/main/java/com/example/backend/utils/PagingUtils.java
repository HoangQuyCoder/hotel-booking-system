package com.example.backend.utils;

import com.example.backend.dto.filter.BaseFilterRequest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PagingUtils {

    public static Pageable toPageable(BaseFilterRequest filter) {
        Sort sort = "DESC".equalsIgnoreCase(filter.getSortDir())
                ? Sort.by(filter.getSortBy()).descending()
                : Sort.by(filter.getSortBy()).ascending();

        return PageRequest.of(filter.getPage(), filter.getSize(), sort);
    }
}
