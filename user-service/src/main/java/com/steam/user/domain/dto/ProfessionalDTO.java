package com.steam.user.domain.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.sql.Blob;
import java.util.List;

@Data
public class ProfessionalDTO {
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+)$", message = "invalid mailbox")
    private String email;
//    @NotBlank(message = "password can not be empty")
    private String password;
    @NotBlank(message = "firstname can not be empty")
    private String firstname;
    @NotBlank(message = "lastname can not be empty")
    private String lastname;

    private String addressStreet;

    private String addressCity;

    private String addressSuburb;

    private String addressPostCode;
    @NotBlank(message = "country can not be empty")
    private String addressCountry;
    @Pattern(regexp = "^\\+?[0-9]{10,13}$", message = "invalid phone number")
    private String telephone;

    private String avatar;

    private String profess;

    private String company;

    private Integer experienceYear;
    @NotBlank(message = "school can not be empty")
    private String education;
    @NotNull(message = "Age cannot be null")
    @Min(value = 1, message = "Age must be at least 1")
    private Integer age;

    private List<String> skill;

    private String professionalCertificate;

}
