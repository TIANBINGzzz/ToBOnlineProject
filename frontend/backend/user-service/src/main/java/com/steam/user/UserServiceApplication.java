package com.steam.user;

import com.steam.api.config.DefaultFeignConfig;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@EnableFeignClients(basePackages = "com.steam.api.client", defaultConfiguration = DefaultFeignConfig.class)
@MapperScan("com.steam.user.mapper")
@EnableDiscoveryClient
@SpringBootApplication(scanBasePackages = {"com.steam.user", "com.steam.common", "com.steam.api"})
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }

}
