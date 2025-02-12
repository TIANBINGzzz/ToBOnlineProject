package com.steam.gateway.filter;

import com.steam.gateway.config.AuthProperties;
import com.steam.gateway.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AuthGlobalFilter implements GlobalFilter, Ordered {

    private final AuthProperties authProperties;
    private final AntPathMatcher antPathMatcher = new AntPathMatcher();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        ServerHttpRequest request = exchange.getRequest();

        // check if login or register
        if (isExclude(request.getPath().toString())){
            return chain.filter(exchange);
        }

        String token;
        // get token (jwt)
        List<String> headers = request.getHeaders().get("Authorization");

        if (headers != null && !headers.isEmpty()){
            token = headers.get(0);
        } else {
            token = null;
        }

        // parse and check token
        if (!JwtUtils.validateToken(token)) {
            ServerHttpResponse response = exchange.getResponse();
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return response.setComplete();
        }

        // save user info in request header
        ServerWebExchange swe = exchange.mutate()
                .request(builder -> builder
                        .header("userId", JwtUtils.getIdFromToken(token))
                        .header("userName", JwtUtils.getNameFromToken(token))
                        .header("role", JwtUtils.getRoleFromToken(token))
                )
                .build();

        return chain.filter(swe);
    }

    private boolean isExclude(String path) {
        for (String pathPattern : authProperties.getExcludePaths()) {
            if (antPathMatcher.match(pathPattern, path)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
