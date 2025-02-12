package com.steam.user.controller;


import com.steam.common.domain.result.PageResult;
import com.steam.common.domain.result.Result;
import com.steam.user.domain.dto.UserDTO;
import com.steam.user.domain.dto.UserPageQuery;
import com.steam.user.domain.dto.UserReportQuery;
import com.steam.user.domain.vo.UserReportVO;
import com.steam.user.domain.vo.UserVO;
import com.steam.user.service.impl.UserServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * <p>
 *  Controller
 * </p>
 *
 * @author ShuoYang
 * @since 2024-10-04
 */
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserServiceImpl userService;

    @PostMapping("login")
    public Result<UserVO> login(@RequestBody @Validated UserDTO userDTO){
        return userService.login(userDTO);
    }

    @PostMapping("register")
    public Result<UserVO> register(@Valid @RequestBody final UserDTO userDTO) {
        return userService.saveUser(userDTO);
    }

    @PutMapping("feedback/{id}")
    public void feedback(@PathVariable String id, @RequestParam Integer score){
        userService.updateScore(id, score);
    }

    @PostMapping("reset")
    public Result<String> update(@Valid @RequestBody final UserDTO userDTO) {
        return userService.reset(userDTO);
    }

    @DeleteMapping("delete/{id}")
    public Result<String> delete(@PathVariable String id) {
        return userService.delete(id);
    }

    @PutMapping("reset/{id}")
    public Result<String> reset(@PathVariable String id) {
        return userService.resetDefault(id);
    }

    @PutMapping("process/{id}")
    public Result<String> process(@PathVariable String id, @RequestParam Boolean enable) {
        return userService.process(id, enable);
    }

    @GetMapping("report")
    public Result<UserReportVO> report(@ModelAttribute final UserReportQuery userReportQuery) {
        return userService.report(userReportQuery);
    }

    @GetMapping("list")
    public Result<PageResult> getUserList(@ModelAttribute @Validated UserPageQuery query) {
        return userService.getList(query);
    }

    @GetMapping("{id}")
    public Result<UserVO> getUser(@PathVariable String id) {
        return userService.getUserById(id);
    }
}
