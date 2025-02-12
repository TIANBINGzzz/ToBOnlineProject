package com.steam.application.task;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.steam.api.client.NotificationClient;
import com.steam.api.domain.dto.NotificationDTO;
import com.steam.application.domain.po.Application;
import com.steam.application.mapper.ApplicationMapper;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * check and update project status, send notification
 */
@Component
@RequiredArgsConstructor
public class ApplicationTask {

    @Resource
    private ApplicationMapper applicationMapper;

    @Resource
    private NotificationClient notificationClient;

    @Scheduled(cron = "01 00 00 * * ?")
    public void completeProject() {
        LambdaQueryWrapper<Application> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Application::getEndTime, LocalDate.now().minusDays(1))
                .eq(Application::getStatus, 2);
// select applications
        List<Application> applicationList = applicationMapper.selectList(queryWrapper);
// professional notifications
        List<NotificationDTO> notificationList = BeanUtil.copyToList(applicationList, NotificationDTO.class);
        notificationList.forEach(notification -> notification.setStatus(3));
// company
        Map<String, NotificationDTO> uniqueProjectNotifications = notificationList.stream()
                .collect(Collectors.toMap(
                        NotificationDTO::getProjectId,
                        notification -> notification,
                        (existing, replacement) -> existing
                ));

        for (NotificationDTO notification : uniqueProjectNotifications.values()) {
            NotificationDTO replacement = new NotificationDTO();
            replacement.setProjectId(notification.getProjectId());
            replacement.setProjectTitle(notification.getProjectTitle());
            replacement.setStatus(4);
            replacement.setCompanyId(notification.getCompanyId());
            replacement.setCompanyName(notification.getCompanyName());

            notificationList.add(replacement);
        }

        notificationClient.insertBatch(notificationList);
    }
}
