package com.steam.project.domain.vo;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProjectVO implements Serializable {

    private String id;
    // title
    private String name;

    private String introduction;

    private Boolean online;

    private String addressCity;

    private String addressCountry;

    private List<String> skill;

    private String requirements;

    private String rolesAndResponsibilities;

    private String workAndTime;

    private String teamInformation;

    private LocalDate startTime;

    private LocalDate endTime;

    private String companyId;

    private String companyName;

    private String resource;

    private Float score;

    private LocalDateTime createTime;
}
