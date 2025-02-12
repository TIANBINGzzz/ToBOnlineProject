package com.steam.user.service;

import com.steam.common.domain.result.PageResult;
import com.steam.common.domain.result.Result;
import com.steam.user.domain.dto.AdminDTO;
import com.steam.user.domain.po.Admin;
import com.baomidou.mybatisplus.extension.service.IService;
import com.steam.user.domain.vo.AdminVO;
import com.steam.user.domain.vo.UserVO;
import jakarta.validation.Valid;

/**
 * <p>
 *  Service
 * </p>
 *
 * @author ShuoYang
 * @since 2024-10-03
 */
public interface IAdminService extends IService<Admin> {

    Result<String> saveAdmin(@Valid AdminDTO adminDTO);

    Result<String> updateAdmin(String id, @Valid AdminDTO adminDTO);

    Result<String> deleteAdmin(String id);

    Result<PageResult> getAdminList(int start, int size);
}
