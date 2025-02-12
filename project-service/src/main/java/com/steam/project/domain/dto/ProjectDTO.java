package com.steam.project.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ProjectDTO {

    private String id;
    // title
    @NotBlank(message = "project name can not be empty")
    private String name;

    @NotBlank(message = "project introduction can not be empty")
    private String introduction;

    @NotNull(message = "project type can not be empty")
    private Boolean online;

    private String addressCity;

    private String addressCountry;

    @NotEmpty(message = "skills cannot be empty")
    private List<String> skill;

    @NotBlank(message = "project requirements can not be empty")
    private String requirements;

    @NotBlank(message = "project roles and responsibilities can not be empty")
    private String rolesAndResponsibilities;

    @NotBlank(message = "project work arrangements and time requirements can not be empty")
    private String workAndTime;

    @NotBlank(message = "project team and company information can not be empty")
    private String teamInformation;

    private String resource;

    @NotNull(message = "project start time can not be empty")
    private LocalDate startTime;

    @NotNull(message = "project end time can not be empty")
    private LocalDate endTime;

}
