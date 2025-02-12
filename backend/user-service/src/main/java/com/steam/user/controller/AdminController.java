package com.steam.user.controller;


import com.steam.common.domain.result.PageResult;
import com.steam.common.domain.result.Result;
import com.steam.user.domain.dto.AdminDTO;
import com.steam.user.domain.vo.AdminVO;
import com.steam.user.domain.vo.UserVO;
import com.steam.user.service.impl.AdminServiceImpl;
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
@RequestMapping("/admin")
@RequiredArgsConstructor
@Validated
public class AdminController {
    private final AdminServiceImpl adminService;

    @PostMapping("register")
    public Result<String> register(@Valid @RequestBody final AdminDTO adminDTO) {
        return adminService.saveAdmin(adminDTO);
    }

    @PostMapping("update/{id}")
    public Result<String> update(@PathVariable String id, @Valid @RequestBody final AdminDTO adminDTO) {
        return adminService.updateAdmin(id, adminDTO);
    }

    @DeleteMapping("delete/{id}")
    public Result<String> delete(@PathVariable String id) {
        return adminService.deleteAdmin(id);
    }

    @GetMapping("list")
    public Result<PageResult> getAdminList(@RequestParam int start, @RequestParam int size) {
        return adminService.getAdminList(start, size);
    }
}
