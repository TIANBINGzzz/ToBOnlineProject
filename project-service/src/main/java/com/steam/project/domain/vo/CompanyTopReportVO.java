package com.steam.project.domain.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyTopReportVO implements Serializable {

    //company name, eg.ANZ,UNSW,Google
    private String nameList;

    //project number, eg.260,215,200
    private String numberList;

}
