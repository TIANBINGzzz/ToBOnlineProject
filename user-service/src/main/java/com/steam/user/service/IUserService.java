package com.steam.user.service;

import com.steam.common.domain.result.PageResult;
import com.steam.common.domain.result.Result;
import com.steam.user.domain.dto.UserDTO;
import com.steam.user.domain.dto.UserPageQuery;
import com.steam.user.domain.dto.UserReportQuery;
import com.steam.user.domain.po.User;
import com.baomidou.mybatisplus.extension.service.IService;
import com.steam.user.domain.vo.UserReportVO;
import com.steam.user.domain.vo.UserVO;
import jakarta.validation.Valid;

/**
 * <p>
 *  Service
 * </p>
 *
 * @author ShuoYang
 * @since 2024-10-04
 */
public interface IUserService extends IService<User> {

    Result<UserVO> login(UserDTO userDTO);

    void updateScore(String id, Integer score);

    Result<UserVO> saveUser(@Valid UserDTO userDTO);

    Result<String> reset(@Valid UserDTO userDTO);

    Result<String> delete(String id);

    Result<String> resetDefault(String id);

    Result<String> process(String id, Boolean enable);

    Result<UserReportVO> report(UserReportQuery userReportQuery);

    Result<PageResult> getList(UserPageQuery query);

    Result<UserVO> getUserById(String id);
}
