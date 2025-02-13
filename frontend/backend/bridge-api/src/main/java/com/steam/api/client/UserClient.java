package com.steam.api.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(value = "user-service")
public interface UserClient {
    @PutMapping("/user/feedback/{id}")
    void feedback(@PathVariable String id, @RequestParam Integer score);
}
