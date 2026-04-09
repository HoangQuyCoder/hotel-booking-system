package com.example.backend.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

@Component
public class JwtCookieUtil {

    public void addJwtCookie(HttpServletResponse response, String token) {
        String cookie = String.format(
                "token=%s; Path=/; Max-Age=%d; HttpOnly; Secure; SameSite=None",
                token,
                30 * 24 * 60 * 60);

        response.addHeader("Set-Cookie", cookie);
    }

    public void clearJwtCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}
