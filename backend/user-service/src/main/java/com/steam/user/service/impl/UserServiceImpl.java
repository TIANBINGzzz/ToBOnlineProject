package com.steam.user.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.toolkit.Db;
import com.steam.common.domain.result.PageResult;
import com.steam.common.domain.result.Result;
import com.steam.common.utils.UserContext;
import com.steam.user.domain.dto.UserDTO;
import com.steam.user.domain.dto.UserPageQuery;
import com.steam.user.domain.dto.UserReportQuery;
import com.steam.user.domain.po.Admin;
import com.steam.user.domain.po.User;
import com.steam.user.domain.vo.UserReportVO;
import com.steam.user.domain.vo.UserVO;
import com.steam.user.mapper.CompanyMapper;
import com.steam.user.mapper.ProfessionalMapper;
import com.steam.user.mapper.UserMapper;
import com.steam.user.service.IUserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.steam.user.utils.JwtUtils;
import jakarta.annotation.Resource;
import org.apache.commons.lang.StringUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * <p>
 *  service implement
 * </p>
 *
 * @author ShuoYang
 * @since 2024-10-04
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {

    @Resource
    private PasswordEncoder passwordEncoder;

    @Resource
    private CompanyMapper companyMapper;

    @Resource
    private ProfessionalMapper professionalMapper;

    @Resource
    private UserMapper userMapper;

    @Override
    public Result<UserVO> login(UserDTO userDTO) {
        User user = lambdaQuery().eq(User::getEmail, userDTO.getEmail()).one();
        Assert.notNull(user, "email is not exist");
        if (!passwordEncoder.matches(userDTO.getPassword(), user.getPassword())) {
            return Result.error(403, "password error");
        }
        UserVO userVO = BeanUtil.toBean(user, UserVO.class);
        if ("admin".equals(user.getUserType())) {
            Admin admin = Db.lambdaQuery(Admin.class).eq(Admin::getId, user.getId()).one();
            List<Integer> permissions = ((List<?>) admin.getPermission()).stream()
                    .map(permission -> Integer.valueOf(permission.toString().trim()))
                    .collect(Collectors.toList());
            admin.setPermission(permissions);
            userVO.setPermission(admin.getPermission());
        }
        return Result.success(JwtUtils.generateToken(user.getId(), user.getName(), user.getUserType()), userVO);
    }

    @Override
    public void updateScore(String id, Integer score) {
        User user = getById(id);
        Long scoreNumber = user.getScoreNumber();
        user.setScoreNumber(scoreNumber + 1);
        user.setScore(((user.getScore() * scoreNumber) + score) / (scoreNumber+1));
        updateById(user);
    }

    @Override
    public Result<UserVO> saveUser(UserDTO userDTO) {
        if (userDTO == null) {
            return Result.error(400, "Invalid user information");
        }
        // save to User
        User user = BeanUtil.toBean(userDTO, User.class);
        // encode password
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        try {
            save(user);
        } catch (DataIntegrityViolationException e) {
            return Result.error(400, e.getMessage());
        }
        return Result.success(JwtUtils.generateToken(user.getId(), "", user.getUserType()), BeanUtil.toBean(user, UserVO.class));
    }

    @Override
    public Result<String> reset(UserDTO userDTO) {
        // check
        User user = lambdaQuery().eq(User::getEmail, userDTO.getEmail()).one();

        if (ObjectUtil.isEmpty(user) || !userDTO.getTelephone().equals(user.getTelephone())) {
            return Result.error(403, "information incorrect");
        }
        // update password
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        updateById(user);
        return Result.success();
    }

    @Override
    public Result<String> delete(String id) {
        User user = getById(id);
        if (user == null) {
            return Result.error(400, "user not exist");
        }
        if ("company".equals(user.getUserType())) {
            companyMapper.deleteById(id);
        } else if ("professional".equals(user.getUserType())) {
            professionalMapper.deleteById(id);
        }
        removeById(id);
        return Result.success();
    }

    @Override
    public Result<String> resetDefault(String id) {
//        if (ObjectUtil.isEmpty(UserContext.get("role")) || !"admin".equals(UserContext.get("role")) || !"super".equals(UserContext.get("role"))) {
//            return Result.error(403, "no permission");
//        }
        User user = new User();
        user.setId(id);
        user.setPassword(passwordEncoder.encode("123456"));
        updateById(user);
        return Result.success();
    }

    @Override
    public Result<String> process(String id, Boolean enable) {
//        if (ObjectUtil.isEmpty(UserContext.get("role")) || !"admin".equals(UserContext.get("role")) || !"super".equals(UserContext.get("role"))) {
//            return Result.error(403, "no permission");
//        }
        User user = new User();
        user.setId(id);
        user.setEnable(enable);
        updateById(user);
        return Result.success();
    }

    @Override
    public Result<UserReportVO> report(UserReportQuery userReportQuery) {
        // get data
        List<Map<String, Object>> newUsers = userMapper.countDailyNewUsers(userReportQuery.getUserType(), userReportQuery.getBegin().atStartOfDay(), userReportQuery.getEnd().atTime(23, 59, 59));
        Map<LocalDate, Long> userCountMap = newUsers.stream()
                .collect(Collectors.toMap(entry -> ((Date) entry.get("date")).toLocalDate(),
                        entry -> (Long) entry.get("new_user_count")));
        Long totalUsers = userMapper.countTotalUsers(userReportQuery.getUserType(), userReportQuery.getBegin().atStartOfDay());
        ArrayList<LocalDate> dateList = new ArrayList<>();
        ArrayList<Long> newUserList = new ArrayList<>();
        ArrayList<Long> totalUserList = new ArrayList<>();
        // to result type
        for (LocalDate date = userReportQuery.getBegin(); !date.isAfter(userReportQuery.getEnd()); date = date.plusDays(1)) {
            dateList.add(date);
            Long newUserCount = userCountMap.getOrDefault(date, 0L);
            newUserList.add(newUserCount);
            totalUsers += newUserCount;
            totalUserList.add(totalUsers);
        }
        return Result.success(
                UserReportVO.builder()
                        .dateList(StringUtils.join(dateList, ","))
                        .newUserList(StringUtils.join(newUserList, ","))
                        .totalUserList(StringUtils.join(totalUserList, ","))
                        .build()
        );
    }

    @Override
    public Result<PageResult> getList(UserPageQuery query) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        // select by user type
        queryWrapper.in("user_type", "professional", "company");
        queryWrapper.orderByAsc("id");
        Page<User> page = new Page<>(query.getStart(), query.getSize());
        Page<User> userPage = page(page, queryWrapper);

        return Result.success(new PageResult(userPage.getTotal(), BeanUtil.copyToList(userPage.getRecords(), UserVO.class)));
    }

    @Override
    public Result<UserVO> getUserById(String id) {
        User user = getById(id);
        return Result.success(BeanUtil.toBean(user, UserVO.class));
    }
}
