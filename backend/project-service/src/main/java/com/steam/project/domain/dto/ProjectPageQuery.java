package com.steam.project.domain.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ProjectPageQuery {
    // select text
    private String key;

    private String company;

    private List<String> skill;

    private Boolean online;

    private String addressCity;

    private String addressCountry;

    private LocalDate startTime;

    private LocalDate endTime;

    // 0-Recruitment 1-working 2-complete 3-abnormal
    private Integer status;

    // page index
    @NotNull(message = "page index position cannot be null")
    @Min(value = 0, message = "page index must be at least 1")
    private Integer start;

    // page size
    @NotNull(message = "size cannot be null")
    @Min(value = 0, message = "size must be at least 0")
    private Integer size;

    // sort field
    @NotBlank(message = "sort field cannot be null")
    private String sort;

    // true - Asc, false - Desc
    @NotNull(message = "acs cannot be null")
    private Boolean acs;
}
