package com.steam.notification.domain.vo;

import lombok.Data;
import java.time.LocalDateTime;


@Data
public class NotificationVO {

    private Long id;

    private Long applicationId;

    private String userId;

    private String userName;

    private String projectId;

    private String projectTitle;

    private String companyId;

    private String companyName;

    private Integer status;

    private String feedback;

    private boolean click;

    private LocalDateTime createTime;

}
