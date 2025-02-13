package com.steam.api.config;

import com.steam.common.utils.UserContext;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.context.annotation.Bean;

public class DefaultFeignConfig {

    @Bean
    public RequestInterceptor userInfoRequestInterceptor(){
        return new RequestInterceptor() {
            @Override
            public void apply(RequestTemplate template) {
                String userId = UserContext.get("userId");
                if (userId != null){
                    template.header("userId", userId.toString());
                    template.header("userName", UserContext.get("userName"));
                    template.header("role", UserContext.get("role"));
                }
            }
        };
    }
}
