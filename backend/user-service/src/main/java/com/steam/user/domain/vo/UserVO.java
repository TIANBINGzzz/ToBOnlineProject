package com.steam.user.domain.vo;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserVO {
    private String id;

    private String email;

    private String telephone;

    private String userType;

    private String name;

    private Float score;

    private LocalDateTime createTime;

    private Boolean enable;

    private List<Integer> permission;

}
