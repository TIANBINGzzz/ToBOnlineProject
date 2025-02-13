package com.steam.user.domain.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserReportVO implements Serializable {

    //date eg.2022-10-01,2022-10-02,2022-10-03
    private String dateList;

    //total eg.200,210,220
    private String totalUserList;

    //added eg.20,21,10
    private String newUserList;

}
