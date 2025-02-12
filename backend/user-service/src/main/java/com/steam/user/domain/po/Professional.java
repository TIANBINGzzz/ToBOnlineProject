package com.steam.user.domain.po;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;

import java.io.Serial;
import java.time.LocalDateTime;
import com.baomidou.mybatisplus.annotation.TableId;
import java.sql.Blob;
import java.io.Serializable;
import java.util.List;

import com.steam.user.config.JsonListTypeHandler;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 
 * </p>
 *
 * @author ShuoYang
 * @since 2024-10-03
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("professional")
public class Professional implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.INPUT)
    private String id;

    private String firstname;

    private String lastname;

    private String addressStreet;

    private String addressCity;

    private String addressSuburb;

    private String addressPostCode;

    private String addressCountry;

    private byte[] avatar;

    private String profess;

    private String company;

    private Integer experienceYear;

    private String education;

    private Integer age;

    @TableField(typeHandler = JsonListTypeHandler.class)
    private List<String> skill;

    private String professionalCertificate;

}
