package com.steam.notification;

import com.steam.api.config.DefaultFeignConfig;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients(basePackages = "com.steam.api.client", defaultConfiguration = DefaultFeignConfig.class)
@MapperScan("com.steam.notification.mapper")
@EnableDiscoveryClient
@SpringBootApplication(scanBasePackages = {"com.steam.notification", "com.steam.common", "com.steam.api"})
public class NotificationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotificationServiceApplication.class, args);
    }

}
