package com.steam.project.service;

import com.steam.common.domain.result.PageResult;
import com.steam.common.domain.result.Result;
import com.steam.project.domain.dto.ProjectDTO;
import com.steam.project.domain.dto.ProjectPageQuery;
import com.steam.project.domain.po.ProjectList;
import com.steam.project.domain.vo.CompanyTopReportVO;
import com.steam.project.domain.vo.ProjectListVO;
import com.steam.project.domain.vo.ProjectReportVO;
import com.steam.project.domain.vo.ProjectVO;

import java.time.LocalDate;
import java.util.List;

public interface IProjectService {

    Result<ProjectList> save(ProjectDTO projectDTO);

    Result<String> update(ProjectDTO projectDTO);

    Result<String> delete(String id);

    Result<ProjectVO> findById(String id);

    Result<PageResult> findList(ProjectPageQuery projectQuery);

    List<ProjectListVO> findByIds(List<String> ids);

    void updateScore(String id, Integer score);

    Result<PageResult> findByStatus(String id, ProjectPageQuery projectQuery);

    void updateName(String id, String name);

    Result<ProjectReportVO> countProject(LocalDate begin, LocalDate end);

    Result<CompanyTopReportVO> rateCompany(LocalDate begin, LocalDate end);
}
