package com.steam.gateway.utils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Objects;

@Component
public class JwtUtils {
    private  static final String SECRET_KEY = "steam";

    public static String generateToken(String userId, String name, String role) {
        System.out.println(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .setSubject(userId)
                .claim("name", name)
                .claim("role", role)
                .setExpiration(new Date(System.currentTimeMillis() + 10000 * 60 * 60)) // 1 hour
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY.getBytes(StandardCharsets.UTF_8))
                .compact();
    }

    public static boolean validateToken(String token) {
        try {
            getTokenBody(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static Claims getTokenBody(String token) {
        System.out.println(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

        return Jwts.parser()
                .setSigningKey(SECRET_KEY.getBytes(StandardCharsets.UTF_8))
                .parseClaimsJws(token)
                .getBody();
    }

    public static String getIdFromToken(String token) {
        if (getTokenBody(token) != null) {
            return Objects.requireNonNull(getTokenBody(token)).getSubject();
        }
        return null;
    }

    public static String getNameFromToken(String token) {
        return Objects.requireNonNull(getTokenBody(token)).get("name", String.class);
    }

    public static String getRoleFromToken(String token) {
        return Objects.requireNonNull(getTokenBody(token)).get("role", String.class);
    }
}
