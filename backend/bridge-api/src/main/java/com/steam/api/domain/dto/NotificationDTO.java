package com.steam.api.domain.dto;

import lombok.Data;

@Data
public class NotificationDTO {

    private Long applicationId;

    private String userId;

    private String userName;

    private String projectId;

    private String projectTitle;

    private String companyId;

    private String companyName;

    private Integer status;

    private String feedback;

}