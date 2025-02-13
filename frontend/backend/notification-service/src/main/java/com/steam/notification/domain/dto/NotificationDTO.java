package com.steam.notification.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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