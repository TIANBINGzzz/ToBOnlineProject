package com.steam.application.service;

import com.steam.application.domain.dto.ApplicationPageQuery;
import com.steam.application.domain.po.Application;
import com.baomidou.mybatisplus.extension.service.IService;
import com.steam.application.domain.vo.CheckResultVO;
import com.steam.common.domain.result.PageResult;
import com.steam.common.domain.result.Result;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * <p>
 *  service
 * </p>
 *
 * @author ShuoYang
 * @since 2024-10-15
 */
public interface IApplicationService extends IService<Application> {

    Result<String> apply(String id);

    Result<String> process(Long id, Integer status);

    Result<String> feedback(Long id, Integer feedback);

    Result<PageResult> getList(ApplicationPageQuery query);

    Result<String> invite(String id);

    void updateName(String id, String role, String name);

    Result<CheckResultVO> checkStatus(String userId, String projectId);

    Result<String> delete(Long id, String projectId);

//    void updateStatus(String id, Integer status);
}
