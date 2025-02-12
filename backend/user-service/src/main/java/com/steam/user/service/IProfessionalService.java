package com.steam.user.service;

import com.steam.common.domain.result.PageResult;
import com.steam.common.domain.result.Result;
import com.steam.user.domain.dto.ProfessionalDTO;
import com.steam.user.domain.dto.UserPageQuery;
import com.steam.user.domain.po.Professional;
import com.baomidou.mybatisplus.extension.service.IService;
import com.steam.user.domain.vo.ProfessionalVO;
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
public interface IProfessionalService extends IService<Professional> {

    Result<String> updateProfessional(String id, @Valid ProfessionalDTO professionalDTO);

    Result<ProfessionalVO> getProfessional(String id);

    Result<PageResult> getProfessionalList(UserPageQuery query);
}
