package com.steam.project.dao;

import com.steam.project.domain.po.Project;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProjectRepository extends MongoRepository<Project, String> {
}
