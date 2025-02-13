package com.steam.api.client;

import com.steam.api.domain.vo.ProjectListVO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(value = "project-service")
public interface ProjectClient {
    @GetMapping("/project/batch")
    List<ProjectListVO> getByIds(@RequestParam java.util.List<String> ids);

    @PutMapping("/project/feedback/{id}")
    void feedback(@PathVariable String id, @RequestParam Integer score);
}
