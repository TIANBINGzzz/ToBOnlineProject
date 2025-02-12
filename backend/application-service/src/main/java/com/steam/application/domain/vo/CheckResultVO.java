package com.steam.application.domain.vo;

import lombok.Data;

@Data
public class CheckResultVO {
    private Long applicationId;
    /**
     * 0-un enroll 1-enroll 2-completed
     */
    private Integer status;
}
