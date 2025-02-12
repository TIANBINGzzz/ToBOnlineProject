package com.steam.user.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.steam.common.domain.result.PageResult;
import com.steam.common.domain.result.Result;
import com.steam.common.utils.UserContext;
import com.steam.user.domain.dto.AdminDTO;
import com.steam.user.domain.po.Admin;
import com.steam.user.domain.po.Professional;
import com.steam.user.domain.po.User;
import com.steam.user.domain.vo.AdminVO;
import com.steam.user.domain.vo.ProfessionalVO;
import com.steam.user.domain.vo.UserVO;
import com.steam.user.mapper.AdminMapper;
import com.steam.user.mapper.UserMapper;
import com.steam.user.service.IAdminService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.steam.user.utils.JwtUtils;
import jakarta.annotation.Resource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * <p>
 *  Service Implement
 * </p>
 *
 * @author ShuoYang
 * @since 2024-10-03
 */
@Service
public class AdminServiceImpl extends ServiceImpl<AdminMapper, Admin> implements IAdminService {

    @Resource
    private UserMapper userMapper;

    @Resource
    private PasswordEncoder passwordEncoder;

    @Transactional
    @Override
    public Result<String> saveAdmin(AdminDTO adminDTO) {
        // save to User
        User user = BeanUtil.toBean(adminDTO, User.class);
        // encode password
        user.setPassword(passwordEncoder.encode(adminDTO.getPassword()));
        // set role
        user.setUserType("admin");

        userMapper.insert(user);
        // save to Admin
        Admin admin = BeanUtil.toBean(adminDTO, Admin.class);
        // set Id
        admin.setId(user.getId());
        save(admin);
        return Result.success();
    }

    @Transactional
    @Override
    public Result<String> updateAdmin(String id, AdminDTO adminDTO) {
        // update Admin permission
        Admin admin = BeanUtil.toBean(adminDTO, Admin.class);
        // set Id
        admin.setId(id);
        updateById(admin);
        return Result.success();
    }

    @Transactional
    @Override
    public Result<String> deleteAdmin(String id) {
        userMapper.deleteById(id);
        removeById(id);
        return Result.success();
    }

    @Override
    public Result<PageResult> getAdminList(int start, int size) {
        QueryWrapper<Admin> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByAsc("id");
        // start from 1
        Page<Admin> page = new Page<>(start, size);
        Page<Admin> adminPage = page(page, queryWrapper);
        return Result.success(new PageResult(
                adminPage.getTotal(),
                BeanUtil.copyToList(adminPage.getRecords(), AdminVO.class)));
    }

}
