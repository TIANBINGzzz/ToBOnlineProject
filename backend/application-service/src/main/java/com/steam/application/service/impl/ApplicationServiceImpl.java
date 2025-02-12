package com.steam.application.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.steam.api.client.NotificationClient;
import com.steam.api.client.ProjectClient;
import com.steam.api.client.UserClient;
import com.steam.api.domain.dto.NotificationDTO;
import com.steam.api.domain.vo.ProjectListVO;
import com.steam.application.domain.dto.ApplicationPageQuery;
import com.steam.application.domain.po.Application;
import com.steam.application.domain.vo.ApplicationVO;
import com.steam.application.domain.vo.CheckResultVO;
import com.steam.application.mapper.ApplicationMapper;
import com.steam.application.service.IApplicationService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.steam.common.domain.result.PageResult;
import com.steam.common.domain.result.Result;
import com.steam.common.utils.UserContext;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
public class ApplicationServiceImpl extends ServiceImpl<ApplicationMapper, Application> implements IApplicationService {
    @Resource
    private ApplicationMapper applicationMapper;

    @Resource
    private ProjectClient projectClient;

    @Resource
    private UserClient userClient;

    @Resource
    private NotificationClient notificationClient;

    @Override
    public Result<String> apply(String id) {
        if (ObjectUtil.isEmpty(UserContext.get("userName"))) {
            return Result.error(403, "Lack of basic information");
        }
        // get user id
        String userId = UserContext.get("userId");
        // check apply history
        Application application = lambdaQuery()
                .eq(Application::getUserId, userId)
                .eq(Application::getProjectId, id)
                .ne(Application::getStatus, 3)
                .one();
        if (application != null) {
            return Result.error(400, "Already applied for this project");
        }
        application = saveApplication(id, 0);
        // send notification
        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO = BeanUtil.copyProperties(application, NotificationDTO.class, "id", "createTime");
        notificationDTO.setApplicationId(application.getId());
        notificationClient.save(notificationDTO);
        return Result.success();
    }

    @Override
    public Result<String> process(Long id, Integer status) {
        // update application
        Application application = new Application();
        application.setId(id);
        application.setStatus(status);
        updateById(application);
        // update company notification status
        notificationClient.updateStatus(id, status);
        return Result.success();
    }

    @Override
    public Result<String> feedback(Long id, Integer feedback) {
        Application application = new Application();
        application.setId(id);
        // update feedback
        if ("company".equals(UserContext.get("role"))) {
            // company feedback
            application.setCompanyFeedback(feedback);
        } else {
            // user feedback
            application.setProfessionalFeedback(feedback);
        }
        updateById(application);

        // set notification status
        application = getById(id);
        NotificationDTO notificationDTO = new NotificationDTO();
        BeanUtil.copyProperties(application, notificationDTO, "id", "createTime");
        notificationDTO.setApplicationId(application.getId());
        if ("company".equals(UserContext.get("role"))) {
            // company feedback
            notificationDTO.setStatus(7);
            // update user score
            userClient.feedback(application.getUserId(), feedback);
        } else {
            // user feedback
            notificationDTO.setStatus(6);
            // update company score
            userClient.feedback(application.getCompanyId(), feedback);
            // update project score
            projectClient.feedback(application.getProjectId(), feedback);
        }
        notificationDTO.setFeedback(feedback.toString());
        notificationClient.save(notificationDTO);
        return Result.success();
    }

    @Override
    public Result<PageResult> getList(ApplicationPageQuery query) {
        LambdaQueryWrapper<Application> queryWrapper = new LambdaQueryWrapper<>();
        // set user
        if ("professional".equals(query.getRole())) {
            // get user application list
            queryWrapper.eq(Application::getUserId, query.getId());
        } else if ("company".equals(query.getRole())) {
            // get company application list
            queryWrapper.eq(Application::getCompanyId, query.getId());
        }
        // set status
        if (query.getStatus() == 0) {
            if ("professional".equals(query.getRole())) {
                // applying and rejected
                queryWrapper.in(Application::getStatus, 0, 1);
            } else if ("company".equals(query.getRole())) {
                // get company application list
                queryWrapper.eq(Application::getStatus, 0);
            }
            queryWrapper.orderByDesc(Application::getId);
        } else if (query.getStatus() == 1 || query.getStatus() == 2) {
            queryWrapper.eq(Application::getStatus, 2);
            if (query.getStatus() == 2) {
                queryWrapper.gt(Application::getEndTime, LocalDate.now());
            } else {
                queryWrapper.le(Application::getEndTime, LocalDate.now());
            }
        }
        // sort applications
        queryWrapper.orderByDesc(Application::getCreateTime);
        // page
        Page<Application> pageObj = new Page<>(query.getStart(), query.getSize());

        Page<Application> applicationPage = applicationMapper.selectPage(pageObj, queryWrapper);
        return Result.success(new PageResult(
                applicationPage.getTotal(),
                BeanUtil.copyToList(applicationPage.getRecords(), ApplicationVO.class)));
    }

    @Override
    public Result<String> invite(String id) {
        // get user id
        String userId = UserContext.get("userId");
        // check apply history
        Application application = lambdaQuery()
                .eq(Application::getUserId, userId)
                .eq(Application::getProjectId, id)
                .one();
        if (application != null) {
            application.setStatus(2);
            updateById(application);
        } else {
            saveApplication(id, 2);
        }
        return Result.success();
    }

    @Override
    public void updateName(String id, String role, String name) {
        LambdaUpdateWrapper<Application> lambdaUpdateWrapper = new LambdaUpdateWrapper<>();
        if ("company".equals(role)) {
            lambdaUpdateWrapper.eq(Application::getCompanyId, id).set(Application::getCompanyName, name);
        } else {
            lambdaUpdateWrapper.eq(Application::getUserId, id).set(Application::getUserName, name);
        }
        update(lambdaUpdateWrapper);
    }

    @Override
    public Result<CheckResultVO> checkStatus(String userId, String projectId) {
        CheckResultVO checkResultVO = new CheckResultVO();
        // select application
        Application application = lambdaQuery().eq(Application::getUserId, userId).eq(Application::getProjectId, projectId).one();
        if (ObjectUtil.isEmpty(application)) {
            // un enroll
            checkResultVO.setStatus(0);
            checkResultVO.setApplicationId(-1L);
            return Result.success(checkResultVO);
        } else if (application.getStatus() == 0 || application.getStatus() == 1) {
            // un enroll
        } else if (application.getEndTime().isAfter(LocalDate.now())) {
            // enroll but uncompleted
            checkResultVO.setStatus(1);
        } else {
            // complete
            checkResultVO.setStatus(2);
        }
        checkResultVO.setApplicationId(application.getId());
        return Result.success(checkResultVO);
    }

    @Override
    public Result<String> delete(Long id, String projectId) {
        // delete application
        applicationMapper.deleteById(id);
        return Result.success();
    }

    private Application saveApplication(String id, Integer status) {
        // get project information
        ProjectListVO project = projectClient.getByIds(List.of(id)).get(0);
        if (ObjectUtil.isEmpty(project)) {
            throw new RuntimeException("This project can not be applied");
        }
        // add new application
        Application application = new Application();
        application.setUserId(UserContext.get("userId"));
        application.setUserName(UserContext.get("userName"));
        application.setProjectId(id);
        application.setProjectTitle(project.getName());
        application.setCompanyId(project.getCompanyId());
        application.setCompanyName(project.getCompanyName());
        application.setStatus(status);
        application.setStartTime(project.getStartTime());
        application.setEndTime(project.getEndTime());
        save(application);
        return application;
    }
}
