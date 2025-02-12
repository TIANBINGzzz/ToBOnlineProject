package com.steam.application.domain.vo;

import com.baomidou.mybatisplus.annotation.TableField;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ApplicationVO {
    private Long id;

    private String userId;

    private String userName;

    private String projectId;

    private String projectTitle;

    private LocalDate startTime;

    private LocalDate endTime;

    private String companyId;

    private String companyName;

    /**
     * 0-applying 1-reject 2-working 3-done
     */
    private Integer status;

    private Integer companyFeedback;

    private Integer professionalFeedback;

    private LocalDateTime updateTime;
}
