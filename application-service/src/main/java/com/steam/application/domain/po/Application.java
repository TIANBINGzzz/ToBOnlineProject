package com.steam.application.domain.po;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;

import java.io.Serial;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 
 * </p>
 *
 * @author ShuoYang
 * @since 2024-10-15
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("application")
public class Application implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("user_id")
    private String userId;

    @TableField("user_name")
    private String userName;

    @TableField("project_id")
    private String projectId;

    @TableField("project_title")
    private String projectTitle;

    @TableField("start_time")
    private LocalDate startTime;

    @TableField("end_time")
    private LocalDate endTime;

    @TableField("company_id")
    private String companyId;

    @TableField("company_name")
    private String companyName;

    /**
     * 0-applying 1-reject 2-enroll
     */
    @TableField("status")
    private Integer status;

    @TableField("company_feedback")
    private Integer companyFeedback;

    @TableField("professional_feedback")
    private Integer professionalFeedback;

    @TableField("create_time")
    private LocalDateTime createTime;
}
