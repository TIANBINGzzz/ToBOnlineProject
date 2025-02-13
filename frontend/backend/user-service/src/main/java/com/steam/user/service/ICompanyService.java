package com.steam.user.service;

import com.steam.common.domain.result.PageResult;
import com.steam.common.domain.result.Result;
import com.steam.user.domain.dto.CompanyDTO;
import com.steam.user.domain.dto.UserPageQuery;
import com.steam.user.domain.po.Company;
import com.baomidou.mybatisplus.extension.service.IService;
import com.steam.user.domain.vo.CompanyVO;
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
public interface ICompanyService extends IService<Company> {

    Result<String> updateCompany(String id, @Valid CompanyDTO companyDTO);

    Result<CompanyVO> getCompany(String id);

    Result<PageResult> getList(UserPageQuery query);
}
