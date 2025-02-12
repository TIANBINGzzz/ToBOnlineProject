package com.steam.user.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserReportQuery {
    // user type
    @NotBlank(message = "user type cannot be null")
    private String userType;

    // report begin date
    @NotNull(message = "begin date cannot be null")
    private LocalDate begin;

    // report end date
    @NotNull(message = "end date cannot be null")
    private LocalDate end;
}
