package com.steam.api.client;

import com.steam.api.domain.dto.NotificationDTO;
import com.steam.common.domain.result.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(value = "notification-service")
public interface NotificationClient {
    @PostMapping("/notification")
    Result<String> save(@RequestBody NotificationDTO notificationDTO);

    @PostMapping("/notification/batch")
    void insertBatch(@RequestBody List<NotificationDTO> notifications);

    @PutMapping("/notification/update/status")
    void updateStatus(@RequestParam Long applicationId, @RequestParam Integer status);
}
