package com.steam.user.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.sql.Blob;

@Data
public class CompanyDTO {
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+)$", message = "invalid mailbox")
    private String email;
    @NotBlank(message = "name can not be empty")
    private String name;

    private String addressStreet;

    private String addressCity;

    private String addressSuburb;

    private String addressPostCode;

    private String addressCountry;
    @Pattern(regexp = "^\\+?[0-9]{10,13}$", message = "invalid phone number")
    private String telephone;
//    @NotBlank(message = "password can not be empty")
    private String password;
    @NotBlank(message = "logo can not be empty")
    private String logo;

    private Integer scale;

    private String introduction;
}
