package com.steam.user.domain.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ProfessionalPageQuery {
    // required skills
    private List<String> skill;

    // user name
    private String name;

    // page index
    @NotNull(message = "page index position cannot be null")
    @Min(value = 1, message = "page index must be at least 1")
    private Integer start;

    // page size
    @NotNull(message = "size cannot be null")
    @Min(value = 0, message = "size must be at least 0")
    private Integer size;
}
