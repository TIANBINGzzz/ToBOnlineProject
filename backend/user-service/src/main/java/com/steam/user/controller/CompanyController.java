package com.steam.user.controller;


import com.steam.common.domain.result.PageResult;
import com.steam.common.domain.result.Result;
import com.steam.user.domain.dto.CompanyDTO;
import com.steam.user.domain.dto.UserPageQuery;
import com.steam.user.domain.vo.CompanyVO;
import com.steam.user.domain.vo.UserVO;
import com.steam.user.service.impl.CompanyServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 *  Controller
 * </p>
 *
 * @author ShuoYang
 * @since 2024-10-03
 */
@RestController
@RequestMapping("/company")
@RequiredArgsConstructor
@Validated
public class CompanyController {
    private final CompanyServiceImpl companyService;

    @PostMapping("update/{id}")
    public Result<String> update(@PathVariable String id, @Valid @RequestBody final CompanyDTO companyDTO) {
        return companyService.updateCompany(id, companyDTO);
    }

    @GetMapping("{id}")
    public Result<CompanyVO> getCompany(@PathVariable String id) {
        return companyService.getCompany(id);
    }

    @GetMapping("list")
    public Result<PageResult> getCompanyList(@ModelAttribute @Validated UserPageQuery query) {
        return companyService.getList(query);
    }
}
