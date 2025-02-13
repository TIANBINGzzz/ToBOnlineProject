package com.steam.user.domain.vo;

import lombok.Data;

import java.time.LocalDateTime;


@Data
public class CompanyVO {

    private String id;

    private String email;

    private String name;

    private String addressStreet;

    private String addressCity;

    private String addressSuburb;

    private String addressPostCode;

    private String addressCountry;

    private String telephone;

    private String logo;

    private Float score;

    private Integer scale;

    private String introduction;

    private LocalDateTime createTime;

    private Boolean enable;
}
