package com.steam.application;

import com.steam.api.config.DefaultFeignConfig;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableFeignClients(basePackages = "com.steam.api.client", defaultConfiguration = DefaultFeignConfig.class)
@MapperScan("com.steam.application.mapper")
@EnableDiscoveryClient
@EnableScheduling
@SpringBootApplication(scanBasePackages = {"com.steam.application", "com.steam.common", "com.steam.api"})
public class ApplicationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApplicationServiceApplication.class, args);
    }

}
