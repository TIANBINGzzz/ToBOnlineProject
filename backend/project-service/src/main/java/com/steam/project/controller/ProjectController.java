package com.steam.project.controller;

import com.steam.common.domain.result.PageResult;
import com.steam.common.domain.result.Result;
import com.steam.project.domain.dto.ProjectDTO;
import com.steam.project.domain.dto.ProjectPageQuery;
import com.steam.project.domain.po.ProjectList;
import com.steam.project.domain.vo.CompanyTopReportVO;
import com.steam.project.domain.vo.ProjectListVO;
import com.steam.project.domain.vo.ProjectReportVO;
import com.steam.project.domain.vo.ProjectVO;
import com.steam.project.service.impl.ProjectServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/project")
@RequiredArgsConstructor
@Validated
public class ProjectController {

    private final ProjectServiceImpl projectServiceImpl;

    @PostMapping
    public Result<ProjectList> save(@RequestBody @Validated ProjectDTO projectDTO){
        return projectServiceImpl.save(projectDTO);
    }

    @GetMapping("list")
    public Result<PageResult> getList(@ModelAttribute @Validated ProjectPageQuery projectQuery){
        return projectServiceImpl.findList(projectQuery);
    }

    @GetMapping("{id}")
    public Result<ProjectVO> getById(@PathVariable final String id){
        return projectServiceImpl.findById(id);
    }

    @GetMapping("profile/{id}")
    public Result<PageResult> getProfile(@PathVariable final String id, @ModelAttribute @Validated ProjectPageQuery query){
        return projectServiceImpl.findByStatus(id, query);
    }

    @GetMapping("batch")
    public List<ProjectListVO> getByIds(@RequestParam List<String> ids){
        return projectServiceImpl.findByIds(ids);
    }

    @PostMapping("update/{id}")
    public Result<String> update(@PathVariable String id, @RequestBody @Validated ProjectDTO projectDTO) {
        projectDTO.setId(id);
        return projectServiceImpl.update(projectDTO);
    }

    @DeleteMapping("delete/{id}")
    public Result<String> delete(@PathVariable String id) {
        return projectServiceImpl.delete(id);
    }

    @PutMapping("feedback/{id}")
    public void feedback(@PathVariable String id, @RequestParam Integer score){
        projectServiceImpl.updateScore(id, score);
    }

    @PutMapping("update/name")
    public void updateName(@RequestParam String id, @RequestParam String name) {
        projectServiceImpl.updateName(id, name);
    }

    @GetMapping("report/count")
    public Result<ProjectReportVO> reportCount(@RequestParam LocalDate begin, @RequestParam LocalDate end) {
        return projectServiceImpl.countProject(begin, end);
    }

    @GetMapping("report/rate")
    public Result<CompanyTopReportVO> reportRate(@RequestParam LocalDate begin, @RequestParam LocalDate end) {
        return projectServiceImpl.rateCompany(begin, end);
    }
}
