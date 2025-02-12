package com.steam.user.domain.vo;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AdminVO {

    private String id;

    private String email;

    private List<Integer> permission;

    private LocalDateTime createTime;

}
