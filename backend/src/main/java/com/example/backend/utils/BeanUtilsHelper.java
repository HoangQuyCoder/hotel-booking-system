package com.example.backend.utils;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.beans.PropertyDescriptor;
import java.util.HashSet;
import java.util.Set;

@Component
public class BeanUtilsHelper {

    /**
     * Get a list of properties with null values in the source object
     * Use to skip when copying
     */

    public static String[] getNullPropertyNames(Object source) {
        final PropertyDescriptor[] propertyDescriptors = BeanUtils.getPropertyDescriptors(source.getClass());
        Set<String> emptyNames = new HashSet<>();

        for (PropertyDescriptor pd : propertyDescriptors) {
            try {
                Object srcValue = pd.getReadMethod().invoke(source);
                if (srcValue == null) {
                    emptyNames.add(pd.getName());
                }
            } catch (Exception ignored) {}
        }

        return emptyNames.toArray(new String[0]);
    }


    // Copy non-null properties from source to target
    public static void copyNonNullProperties(Object source, Object target) {
        BeanUtils.copyProperties(source, target, getNullPropertyNames(source));
    }
}
