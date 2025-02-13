package com.steam.application.domain.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ApplicationPageQuery {
    // user/company Id
    @NotBlank(message = "user id cannot be empty")
    private String id;
    // user/company
    @NotBlank(message = "user role cannot be empty")
    private String role;
    // application status
    /**
     * 0-applying/reject 2-working 3-done 4-quit
     */
    @NotNull(message = "application status cannot be null")
    private Integer status;
    // page index
    @NotNull(message = "page index position cannot be null")
    @Min(value = 1, message = "page index must be at least 1")
    private Integer start;
    // page size
    @NotNull(message = "size cannot be null")
    @Min(value = 0, message = "size must be at least 0")
    private Integer size;
}
