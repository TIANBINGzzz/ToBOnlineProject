package com.steam.application.controller;


import cn.hutool.core.bean.BeanUtil;
import com.steam.application.domain.dto.ApplicationPageQuery;
import com.steam.application.domain.po.Application;
import com.steam.application.domain.vo.ApplicationVO;
import com.steam.application.domain.vo.CheckResultVO;
import com.steam.application.service.IApplicationService;
import com.steam.common.domain.result.PageResult;
import com.steam.common.domain.result.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
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
@RequestMapping("/application")
@RequiredArgsConstructor
public class ApplicationController {
    private final IApplicationService applicationService;

    @PutMapping("apply/{id}")
    public Result<String> apply(@PathVariable String id) {
        return applicationService.apply(id);
    }

    @PutMapping("invite/{id}")
    public Result<String> invite(@PathVariable String id) {
        return applicationService.invite(id);
    }

    @PutMapping("process/{id}")
    public Result<String> process(
            @PathVariable Long id,
            @RequestParam(name = "status", required = true) Integer status) {
        return applicationService.process(id, status);
    }

    @PutMapping("feedback/{id}")
    public Result<String> feedback(@PathVariable Long id, @RequestParam Integer feedback) {
        return applicationService.feedback(id, feedback);
    }

    @GetMapping("list")
    public Result<PageResult> getList(@ModelAttribute @Validated ApplicationPageQuery query){
        return applicationService.getList(query);
    }

    @GetMapping("project/{id}")
    public Result<PageResult> getProject(@PathVariable String id) {
        List<Application> applications = applicationService.lambdaQuery()
                .eq(Application::getProjectId, id)
                .eq(Application::getStatus, 2)
                .orderByAsc(Application::getUserName).list();
        return Result.success(new PageResult(applications.size(), BeanUtil.copyToList(applications, ApplicationVO.class)));
    }

    @PutMapping("update/name")
    public void updateName(@RequestParam String id, @RequestParam String role, @RequestParam String name) {
        applicationService.updateName(id, role, name);
    }

    @GetMapping("check")
    public Result<CheckResultVO> check(@RequestParam String userId, @RequestParam String projectId) {
        return applicationService.checkStatus(userId, projectId);
    }

    @DeleteMapping("{id}")
    public Result<String> delete(@PathVariable Long id, @RequestParam String projectId) {
        return applicationService.delete(id, projectId);
    }
}
