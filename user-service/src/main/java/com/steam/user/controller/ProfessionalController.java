package com.steam.user.controller;


import com.steam.common.domain.result.PageResult;
import com.steam.common.domain.result.Result;
import com.steam.user.domain.dto.ProfessionalDTO;
import com.steam.user.domain.dto.UserPageQuery;
import com.steam.user.domain.vo.ProfessionalVO;
import com.steam.user.domain.vo.UserVO;
import com.steam.user.service.impl.ProfessionalServiceImpl;
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
@RequestMapping("/professional")
@RequiredArgsConstructor
@Validated
public class ProfessionalController {
    private final ProfessionalServiceImpl professionalService;

    @PostMapping("update/{id}")
    public Result<String> update(@PathVariable String id, @Valid @RequestBody final ProfessionalDTO professionalDTO) {
        return professionalService.updateProfessional(id, professionalDTO);
    }

    @GetMapping("{id}")
    public Result<ProfessionalVO> getProfessional(@PathVariable String id) {
        return professionalService.getProfessional(id);
    }

    @GetMapping("list")
    public Result<PageResult> getProfessionalList(@ModelAttribute @Validated UserPageQuery query) {
        return professionalService.getProfessionalList(query);
    }
}
