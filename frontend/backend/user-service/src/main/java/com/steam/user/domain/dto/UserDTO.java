package com.steam.user.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserDTO {

    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+)$", message = "invalid mailbox")
    private String email;

    private String telephone;

    @NotBlank(message = "password can not be empty")
    private String password;

    private String userType;
}
