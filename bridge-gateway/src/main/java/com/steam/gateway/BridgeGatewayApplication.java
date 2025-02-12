package com.steam.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class BridgeGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(BridgeGatewayApplication.class, args);
    }

}
