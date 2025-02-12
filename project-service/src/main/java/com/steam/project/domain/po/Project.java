package com.steam.project.domain.po;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Document(collection = "project")
public class Project {
    @Id
    private String id;
    // title
    @Field("name")
    private String name;

    @Field("introduction")
    private String introduction;

    @Field("online")
    private Boolean online;

    @Field("address_city")
    private String addressCity;

    @Field("address_country")
    private String addressCountry;

    @Field("skill")
    private List<String> skill;

    @Field("requirements")
    private String requirements;

    @Field("roles_and_responsibilities")
    private String rolesAndResponsibilities;

    @Field("work_and_time")
    private String workAndTime;

    @Field("team_information")
    private String teamInformation;

    @Field("start_time")
    private LocalDate startTime;

    @Field("end_time")
    private LocalDate endTime;

    @Field("company_id")
    private String companyId;

    @Field("company_name")
    private String companyName;

    @Field("resource")
    private String resource;

    @Field("score")
    private Float score;

    @Field("scoreNumber")
    private Long scoreNumber;

    @Field("create_time")
    private LocalDateTime createTime;

    public void init() {
        // set UUID as project Id
        this.id = UUID.randomUUID().toString();
        // set default create time
        this.createTime = LocalDateTime.now();
        // inital score
        this.score = -1.0f;
        // inital score number
        this.scoreNumber = 0L;
    }
}
