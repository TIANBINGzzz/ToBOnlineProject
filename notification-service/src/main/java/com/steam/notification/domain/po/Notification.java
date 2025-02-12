package com.steam.notification.domain.po;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;

import java.io.Serial;
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
@TableName("notification")
public class Notification implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    private Long applicationId;

    private String userId;

    private String userName;

    private String projectId;

    private String projectTitle;

    private String companyId;

    private String companyName;

    /**
     * 0 - user apply project (company)
     * 1 - reject user apply (professional)
     * 2 - enroll user to project (professional)
     * 3 - project done (professional)
     * 4 - project done (company)
     * 5 - user quit project (company)
     * 6 - user give feedback (company)
     * 7 - company give feedback (professional)
     * 8 - company invite user (professional)
     * 9 - kick out (professional)
     * 10 - report account (admin)
     * 11 - appeal account (admin)
     * 12 - reset password (admin)
     * 13 - processed report account (admin)
     * 14 - processed appeal account (admin)
     * 15 - processed reset password (admin)
     */
    private Integer status;

    // message or result
    private String feedback;

    private boolean click;

    private LocalDateTime createTime;

}
