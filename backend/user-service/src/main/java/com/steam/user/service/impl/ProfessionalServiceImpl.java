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
import com.steam.user.domain.dto.ProfessionalDTO;
import com.steam.user.domain.dto.UserPageQuery;
import com.steam.user.domain.po.Professional;
import com.steam.user.domain.po.User;
import com.steam.user.domain.vo.ProfessionalVO;
import com.steam.user.mapper.ProfessionalMapper;
import com.steam.user.mapper.UserMapper;
import com.steam.user.service.IProfessionalService;
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
public class ProfessionalServiceImpl extends ServiceImpl<ProfessionalMapper, Professional> implements IProfessionalService {
    @Resource
    private UserMapper userMapper;

    @Resource
    private RabbitTemplate rabbitTemplate;

    @Transactional
    @Override
    public Result<String> updateProfessional(String id, ProfessionalDTO professionalDTO) {
        // check permissions
        if (!UserContext.get("userId").equals(id) && !"admin".equals(UserContext.get("role"))) {
            return Result.error(401, "No permissions to update information");
        }
        if (professionalDTO == null) {
            return Result.error(400, "Invalid user information");
        }
        // check difference
        User user = userMapper.selectById(id);
        String name = professionalDTO.getFirstname() + " " + professionalDTO.getLastname();
        if (ObjectUtil.isNotEmpty(UserContext.get("userName")) && !name.equals(user.getName())) {
            // update user
            BeanUtil.copyProperties(professionalDTO, user, "password");
            user.setName(name);
            userMapper.updateById(user);
            // send update message to MQ
            sendUpdateMessage(new UpdateMessage(id, user.getUserType(), name));
        } else if (ObjectUtil.isEmpty(UserContext.get("userName")) ||
                !user.getEmail().equals(professionalDTO.getEmail()) ||
                !user.getTelephone().equals(professionalDTO.getTelephone())) {
            // update user
            BeanUtil.copyProperties(professionalDTO, user, "password");
            user.setName(name);
            userMapper.updateById(user);
        }
        // save or update Professional
        Professional professional = BeanUtil.toBean(professionalDTO, Professional.class);
        // set Id
        professional.setId(id);
        saveOrUpdate(professional);
        return Result.success(JwtUtils.generateToken(user.getId(), name, "professional"), "");

    }

    @Override
    public Result<ProfessionalVO> getProfessional(String id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            return Result.error(404, "user is not exists");
        }
        Professional professional = getById(id);

        // lack basic information
        if (professional == null) {
            return Result.success(BeanUtil.toBean(user, ProfessionalVO.class));
        }

        ProfessionalVO professionalVO = BeanUtil.toBean(professional, ProfessionalVO.class);

        String base64Avatar = Base64.getEncoder().encodeToString(professional.getAvatar());
        professionalVO.setAvatar(base64Avatar);

        // combine information
        BeanUtil.copyProperties(user, professionalVO);

        return Result.success(professionalVO);
    }

    @Override
    public Result<PageResult> getProfessionalList(UserPageQuery query) {
        QueryWrapper<Professional> queryWrapper = new QueryWrapper<>();
        // select by name
        if (ObjectUtil.isNotEmpty(query.getName())) {
            queryWrapper.like("CONCAT(firstname, ' ', lastname)", query.getName());
        } else if (ObjectUtil.isNotEmpty(query.getSkill())) {
            // select by skill
            String jsonArray = query.getSkill().stream()
                    .map(skill -> "\"" + skill + "\"")
                    .collect(Collectors.joining(",", "[", "]"));
            String sqlCondition = String.format("JSON_OVERLAPS(skill, '%s')", jsonArray);
            queryWrapper.apply(sqlCondition);
        }
        queryWrapper.orderByAsc("id");
        Page<Professional> page = new Page<>(query.getStart(), query.getSize());
        Page<Professional> professionalPage = page(page, queryWrapper);


        List<ProfessionalVO> professionalVOList = professionalPage.getRecords().stream().map(professional -> {
            ProfessionalVO vo = BeanUtil.copyProperties(professional, ProfessionalVO.class);
            if (professional.getAvatar() != null) {
                String base64Avatar = Base64.getEncoder().encodeToString(professional.getAvatar());
                vo.setAvatar(base64Avatar);
            }
            return vo;
        }).collect(Collectors.toList());

        return Result.success(new PageResult(professionalPage.getTotal(), professionalVOList));
    }

    @Async
    public void sendUpdateMessage(UpdateMessage updateMessage) {
        try {
            rabbitTemplate.convertAndSend(MQConstants.UPDATE_EXCHANGE_NAME, MQConstants.UPDATE_PROFESSIONAL_KEY, updateMessage);
        } catch (AmqpException e) {
            System.out.println("fail to send professional name update message，uerId：" + updateMessage.getUserId());
            System.out.println(e.getMessage());
        }
    }
}