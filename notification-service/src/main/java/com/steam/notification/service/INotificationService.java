package com.steam.notification.service;

import com.steam.common.domain.result.PageResult;
import com.steam.common.domain.result.Result;
import com.steam.notification.domain.dto.NotificationDTO;
import com.steam.notification.domain.po.Notification;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * <p>
 *  Service
 * </p>
 *
 * @author ShuoYang
 * @since 2024-10-15
 */
public interface INotificationService extends IService<Notification> {

    Result<String> save(NotificationDTO notificationDTO);

    Result<PageResult> queryAll(int page, int size, List<Integer> status);

    void updateName(String id, String role, String name);

    void updateStatus(Long applicationId, Integer status);

    Result<String> process(Long id, Integer status, Boolean trigger);


    void saveList(List<NotificationDTO> notifications);
}
