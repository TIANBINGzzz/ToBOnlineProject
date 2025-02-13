package com.steam.user.domain.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.List;


@Data
public class AdminDTO {

    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+)$", message = "invalid mailbox")
    private String email;

    // @NotBlank(message = "password can not be empty")
    private String password;

    @NotNull(message = "permission cannot be null")
    private List<Integer> permission;

}
