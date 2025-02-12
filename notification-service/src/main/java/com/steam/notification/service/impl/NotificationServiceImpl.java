package com.steam.notification.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.ObjectUtil;
import com.alibaba.fastjson2.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.steam.common.domain.result.PageResult;
import com.steam.common.domain.result.Result;
import com.steam.common.utils.UserContext;
import com.steam.notification.domain.dto.NotificationDTO;
import com.steam.notification.domain.po.Notification;
import com.steam.notification.domain.vo.NotificationVO;
import com.steam.notification.mapper.NotificationMapper;
import com.steam.notification.service.INotificationService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.steam.notification.websocket.WebSocketServer;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 *  service implement
 * </p>
 *
 * @author ShuoYang
 * @since 2024-10-15
 */
@Service
public class NotificationServiceImpl extends ServiceImpl<NotificationMapper, Notification> implements INotificationService {
    @Resource
    private NotificationMapper notificationMapper;

    @Resource
    private WebSocketServer webSocketServer;

    @Override
    public Result<String> save(NotificationDTO notificationDTO) {
        // set query limits
        QueryWrapper<Notification> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", notificationDTO.getStatus());
        if (ObjectUtil.isNotEmpty(notificationDTO.getApplicationId())) {
            queryWrapper.eq("application_id", notificationDTO.getApplicationId());
        }
        if (ObjectUtil.isNotEmpty(notificationDTO.getUserId())) {
            queryWrapper.eq("user_id", notificationDTO.getUserId());
        }
        if (ObjectUtil.isNotEmpty(notificationDTO.getProjectId())) {
            queryWrapper.eq("project_id", notificationDTO.getProjectId());
        }
        if (ObjectUtil.isNotEmpty(notificationDTO.getCompanyId())) {
            queryWrapper.eq("company_id", notificationDTO.getCompanyId());
        }
        // check repeat notification
        Notification notification = getOne(queryWrapper);
        if (ObjectUtil.isNotEmpty(notification)) {
            return Result.error(403, "Please do not repeat the operation, we will process it as soon as possible.");
        }
        // save notification
        notification = BeanUtil.toBean(notificationDTO, Notification.class);
        save(notification);
        // push notification to client
        List<Integer> companyNotifications = List.of(0, 4, 5, 6);
        List<Integer> professionalNotifications = List.of(1, 2, 3, 7, 8);
        notification.setCreateTime(LocalDateTime.now());
        if (companyNotifications.contains(notification.getStatus())) {
            webSocketServer.sendToClient(notification.getCompanyId(), JSON.toJSONString(notification));
        } else if (professionalNotifications.contains(notification.getStatus())) {
            webSocketServer.sendToClient(notification.getUserId(), JSON.toJSONString(notification));
        }
        return Result.success();
    }

//    @Override
//    public Result<PageResult> queryAll(int page, int size, List<Integer> status) {
//        LambdaQueryWrapper<Notification> lambdaQueryWrapper = new LambdaQueryWrapper<>();
//        if (ObjectUtil.isNotEmpty(status)) {
//            lambdaQueryWrapper.in(Notification::getStatus, status);
//        } else {
//            lambdaQueryWrapper.isNotNull(Notification::getStatus);
//        }
//        if ("company".equals(UserContext.get("role"))) {
//            lambdaQueryWrapper.eq(Notification::getCompanyId, UserContext.get("userId"))
//                    .in(Notification::getStatus, List.of(0, 4, 5, 6));
//        } else {
//            lambdaQueryWrapper.eq(Notification::getUserId, UserContext.get("userId"))
//                    .in(Notification::getStatus, List.of(1, 2, 3, 7, 8, 9));
//        }
//        lambdaQueryWrapper.orderByDesc(Notification::getId);
//        Page<Notification> pageObj = new Page<>(page, size);
//        Page<Notification> notificationPage = notificationMapper.selectPage(pageObj, lambdaQueryWrapper);
//        return Result.success(new PageResult(
//                notificationPage.getTotal(),
//                BeanUtil.copyToList(notificationPage.getRecords(), NotificationVO.class)));
//    }

    @Override
    public Result<PageResult> queryAll(int page, int size, List<Integer> status) {
        String role = UserContext.get("role");
        LambdaQueryWrapper<Notification> lambdaQueryWrapper = new LambdaQueryWrapper<>();
        if (ObjectUtil.isNotEmpty(status)) {
            lambdaQueryWrapper.in(Notification::getStatus, status);
        } else if ("company".equals(UserContext.get("role"))) {
            lambdaQueryWrapper.eq(Notification::getCompanyId, UserContext.get("userId"))
                    .in(Notification::getStatus, List.of(0, 4, 5, 6));
        } else {
            lambdaQueryWrapper.eq(Notification::getUserId, UserContext.get("userId"))
                    .in(Notification::getStatus, List.of(1, 2, 3, 7, 8, 9));
        }
        // order
        lambdaQueryWrapper.orderByDesc(Notification::getId);
        // page -- start from 1
        Page<Notification> pageObj = new Page<>(page, size);
        Page<Notification> notificationPage = notificationMapper.selectPage(pageObj, lambdaQueryWrapper);
        return Result.success(new PageResult(
                notificationPage.getTotal(),
                BeanUtil.copyToList(notificationPage.getRecords(), NotificationVO.class)));
    }
    @Override
    public void updateName(String id, String role, String name) {
        LambdaUpdateWrapper<Notification> lambdaUpdateWrapper = new LambdaUpdateWrapper<>();
        if ("company".equals(role)) {
            lambdaUpdateWrapper.eq(Notification::getCompanyId, id).set(Notification::getCompanyName, name);
        } else {
            lambdaUpdateWrapper.eq(Notification::getUserId, id).set(Notification::getUserName, name);
        }
        update(lambdaUpdateWrapper);
    }

    @Override
    public void updateStatus(Long applicationId, Integer status) {
        LambdaUpdateWrapper<Notification> lambdaUpdateWrapper = new LambdaUpdateWrapper<>();
        lambdaUpdateWrapper.eq(Notification::getApplicationId, applicationId)
                .eq(Notification::getStatus, 0)
                .set(Notification::getFeedback, status.toString());
        update(lambdaUpdateWrapper);
    }

    @Override
    public Result<String> process(Long id, Integer status, Boolean trigger) {
        Notification notification = new Notification();
        notification.setId(id);
        if (ObjectUtil.isNotEmpty(trigger)) {
            notification.setStatus(status);
        } else {
            notification.setFeedback(status.toString());
        }
        updateById(notification);
        return Result.success();
    }

    @Transactional
    @Override
    public void saveList(List<NotificationDTO> notifications) {
        List<Notification> notificationList = BeanUtil.copyToList(notifications, Notification.class);
        saveBatch(notificationList);
        // push notification to client
        List<Integer> companyNotifications = List.of(0, 4, 5, 6);
        List<Integer> professionalNotifications = List.of(1, 2, 3, 7, 8);
        for (Notification notification : notificationList) {
            notification.setCreateTime(LocalDateTime.now());
            if (companyNotifications.contains(notification.getStatus())) {
                webSocketServer.sendToClient(notification.getCompanyId(), JSON.toJSONString(notification));
                //                todo
                System.out.println(JSON.toJSONString(notification));
            } else if (professionalNotifications.contains(notification.getStatus())) {
                webSocketServer.sendToClient(notification.getUserId(), JSON.toJSONString(notification));
                //                todo
                System.out.println(JSON.toJSONString(notification));
            }
        }

    }
}
