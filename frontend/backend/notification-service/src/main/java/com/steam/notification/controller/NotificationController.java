package com.steam.notification.controller;


import cn.hutool.core.bean.BeanUtil;
import com.steam.common.domain.result.PageResult;
import com.steam.common.domain.result.Result;
import com.steam.notification.domain.dto.NotificationDTO;
import com.steam.notification.domain.po.Notification;
import com.steam.notification.service.INotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <p>
 *  controller
 * </p>
 *
 * @author ShuoYang
 * @since 2024-10-15
 */
@RestController
@RequestMapping("/notification")
@RequiredArgsConstructor
public class NotificationController {
    private final INotificationService notificationService;

    @PostMapping
    public Result<String> save(@RequestBody NotificationDTO notificationDTO) {
        return notificationService.save(notificationDTO);
    }

    @PostMapping("batch")
    public void insertBatch(@RequestBody List<NotificationDTO> notifications){
        notificationService.saveList(notifications);
    }

    @GetMapping("list")
    public Result<PageResult> queryAll(@RequestParam int page, @RequestParam int size, @RequestParam(required = false) List<Integer> status) {
        return notificationService.queryAll(page, size, status);
    }

    @PutMapping("click/{id}")
    public Result<String> click(@PathVariable Long id) {
        notificationService.updateById(new Notification().setId(id).setClick(true));
        return Result.success();
    }

    @PutMapping("update/name")
    public void updateName(@RequestParam String id, @RequestParam String role, @RequestParam String name) {
        notificationService.updateName(id, role, name);
    }

    @PutMapping("update/status")
    public void updateStatus(@RequestParam Long applicationId, @RequestParam Integer status) {
        notificationService.updateStatus(applicationId, status);
    }

    @PutMapping("process/{id}")
    public Result<String> process(@PathVariable Long id, @RequestParam Integer status, @RequestParam(required = false) Boolean trigger) {
        return notificationService.process(id, status, trigger);
    }
}
