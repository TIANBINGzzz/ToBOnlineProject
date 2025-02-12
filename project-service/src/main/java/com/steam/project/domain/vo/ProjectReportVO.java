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
public class ProjectReportVO implements Serializable {

    //date eg.2022-10-01,2022-10-02,2022-10-03
    private String dateList;

    //total eg.200,210,220
    private String totalProjectList;

    //added eg.20,21,10
    private String newProjectList;

    //start eg.20,21,10
    private String startProjectList;

    //complete eg.20,21,10
    private String completeProjectList;

}
