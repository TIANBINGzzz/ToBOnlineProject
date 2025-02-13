package com.steam.user.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.steam.common.constants.MQConstants;
import com.steam.common.domain.message.UpdateMessage;
import com.steam.common.domain.result.PageResult;
import com.steam.common.domain.result.Result;
import com.steam.common.utils.UserContext;
import com.steam.user.domain.dto.CompanyDTO;
import com.steam.user.domain.dto.UserPageQuery;
import com.steam.user.domain.po.Company;
import com.steam.user.domain.po.User;
import com.steam.user.domain.vo.CompanyVO;
import com.steam.user.mapper.CompanyMapper;
import com.steam.user.mapper.UserMapper;
import com.steam.user.service.ICompanyService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.steam.user.utils.JwtUtils;
import jakarta.annotation.Resource;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

/**
 * <p>
 *  service implement
 * </p>
 *
 * @author ShuoYang
 * @since 2024-10-03
 */
@Service
public class CompanyServiceImpl extends ServiceImpl<CompanyMapper, Company> implements ICompanyService {
    @Resource
    private UserMapper userMapper;

    @Resource
    private RabbitTemplate rabbitTemplate;

    @Transactional
    @Override
    public Result<String> updateCompany(String id, CompanyDTO companyDTO) {
        // check permissions
        if (!UserContext.get("userId").equals(id) && !"admin".equals(UserContext.get("role"))) {
            return Result.error(401, "No permissions to update information");
        }
        if (companyDTO == null) {
            return Result.error(403, "Invalid user information");
        }
        // check difference
        User user = userMapper.selectById(id);
        String name = companyDTO.getName();
        if (ObjectUtil.isNotEmpty(UserContext.get("userName")) && !name.equals(user.getName())) {
            // update user
            BeanUtil.copyProperties(companyDTO, user, "password");
            userMapper.updateById(user);
            // send update message to MQ
            sendUpdateMessage(new UpdateMessage(id, user.getUserType(), name));
        } else if (ObjectUtil.isEmpty(UserContext.get("userName")) ||
                !user.getEmail().equals(companyDTO.getEmail()) ||
                !user.getTelephone().equals(companyDTO.getTelephone())) {
            // update user
            BeanUtil.copyProperties(companyDTO, user, "password");
            userMapper.updateById(user);
        }
        // save or update Company
        Company company = BeanUtil.toBean(companyDTO, Company.class);
        // set Id
        company.setId(id);
        saveOrUpdate(company);
        return Result.success(JwtUtils.generateToken(user.getId(), company.getName(), "company"), "");
    }

    @Override
    public Result<CompanyVO> getCompany(String id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            return Result.error(404, "user is not exists");
        }
        Company company = getById(id);
        // lack basic information
        if (company == null) {
            return Result.success(BeanUtil.toBean(user, CompanyVO.class));
        }
        // combine information
        CompanyVO companyVO = BeanUtil.toBean(company, CompanyVO.class);

        //convert blob to base64
        String base64Logo = Base64.getEncoder().encodeToString(company.getLogo());
        companyVO.setLogo(base64Logo);
        BeanUtil.copyProperties(user, companyVO);

        return Result.success(companyVO);
    }

    @Override
    public Result<PageResult> getList(UserPageQuery query) {
        QueryWrapper<Company> queryWrapper = new QueryWrapper<>();
        // select by name
        if (ObjectUtil.isNotEmpty(query.getName())) {
            queryWrapper.like("name", query.getName());
        }
        queryWrapper.orderByAsc("id");
        Page<Company> page = new Page<>(query.getStart(), query.getSize());
        Page<Company> companyPage = page(page, queryWrapper);

        List<CompanyVO> companyVOList = companyPage.getRecords().stream().map(company -> {
            CompanyVO companyVO = BeanUtil.copyProperties(company, CompanyVO.class);
            if (companyVO.getLogo() != null) {
                String base64Logo = Base64.getEncoder().encodeToString(company.getLogo());
                companyVO.setLogo(base64Logo);
            }
            return companyVO;
        }).collect(Collectors.toList());

        return Result.success(new PageResult(companyPage.getTotal(), companyVOList));
    }

    @Async
    public void sendUpdateMessage(UpdateMessage updateMessage) {
        try {
            rabbitTemplate.convertAndSend(MQConstants.UPDATE_EXCHANGE_NAME, MQConstants.UPDATE_COMPANY_KEY, updateMessage);
        } catch (AmqpException e) {
            System.out.println("fail to send company name update message，uerId：" + updateMessage.getUserId());
            System.out.println(e.getMessage());
        }
    }
}
