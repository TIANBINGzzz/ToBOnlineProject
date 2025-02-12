package com.steam.project.domain.vo;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProjectListVO {
    private String id;
    // title
    private String name;

    private String introduction;

    private Boolean online;

    private String addressCity;

    private String addressCountry;

    private List<String> skill;

    private LocalDate startTime;

    private LocalDate endTime;

    private String companyId;

    private String companyName;

    private Float score;

    private LocalDate createTime;
}
