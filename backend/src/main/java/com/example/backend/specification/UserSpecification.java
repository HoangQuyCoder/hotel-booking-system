package com.example.backend.specification;

import com.example.backend.dto.filter.UserFilterRequest;
import com.example.backend.model.User;
import com.example.backend.utils.SpecUtils;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecification {
    private static final Specification<User> spec = SpecUtils.empty();

    public static Specification<User> build(UserFilterRequest filter) {
        return spec.and(SpecUtils.likeIfNotNull("username", filter.getUsername()))
                .and(SpecUtils.likeIfNotNull("email", filter.getEmail()))
                .and(SpecUtils.likeIfNotNull("phoneNumber", filter.getPhoneNumber()))
                .and(SpecUtils.likeIfNotNull("firstName", filter.getFirstName()))
                .and(SpecUtils.likeIfNotNull("lastName", filter.getLastName()))
                .and(SpecUtils.equalIfNotNull("status", filter.getStatus()))
                .and(SpecUtils.equalIfNotNull("isActive", filter.getIsActive()))
                .and(SpecUtils.betweenIfNotNull("createdAt", filter.getCreatedFrom(), filter.getCreatedTo()))
                .and(SpecUtils.betweenIfNotNull("updatedAt", filter.getUpdatedFrom(), filter.getUpdatedTo()))
                .and(SpecUtils.nestedEqualIfNotNull("role", "id", filter.getRoleId()))
                .and(SpecUtils.keywordSearch(filter.getKeyword(), "username", "email", "firstName", "lastName", "phoneNumber", "address"));
    }
}
