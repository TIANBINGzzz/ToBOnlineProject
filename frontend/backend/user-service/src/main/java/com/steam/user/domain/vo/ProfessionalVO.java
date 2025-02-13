package com.steam.user.domain.vo;

import lombok.Data;

import java.sql.Blob;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProfessionalVO {

    private String id;

    private String email;

    private String firstname;

    private String lastname;

    private String addressStreet;

    private String addressCity;

    private String addressSuburb;

    private String addressPostCode;

    private String addressCountry;

    private String telephone;

    private String avatar;

    private String profess;

    private String company;

    private Integer experienceYear;

    private String education;

    private Integer age;

    private List<String> skill;

    private String professionalCertificate;

    private Float score;

    private LocalDateTime createTime;

    private Boolean enable;
}
