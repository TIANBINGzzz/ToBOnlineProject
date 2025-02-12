package com.steam.project.domain.po;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(indexName = "project_index")
public class ProjectList implements Serializable {
    @Id
    @Field(type = FieldType.Keyword)
    private String id;
    // title
    @Field(type = FieldType.Text)
    private String name;

    @Field(type = FieldType.Text)
    private String introduction;

    @Field(type = FieldType.Boolean)
    private Boolean online;

    @Field(type = FieldType.Keyword)
    private String addressCity;

    @Field(type = FieldType.Keyword)
    private String addressCountry;

    @Field(type = FieldType.Keyword)
    private List<String> skill;

    @Field(type = FieldType.Text)
    private String companyId;

    @Field(type = FieldType.Keyword)
    private String companyName;

    @Field(type = FieldType.Date, format = DateFormat.date)
    private LocalDate startTime;

    @Field(type = FieldType.Date, format = DateFormat.date)
    private LocalDate endTime;

    @Field(type = FieldType.Date, format = DateFormat.date)
    private LocalDate createTime;
}
