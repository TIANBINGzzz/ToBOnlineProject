package com.steam.user.mapper;

import com.steam.user.domain.po.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * <p>
 *  Mapper
 * </p>
 *
 * @author ShuoYang
 * @since 2024-10-04
 */
public interface UserMapper extends BaseMapper<User> {

    @Select("SELECT DATE(create_time) AS date, COUNT(*) AS new_user_count " +
            "FROM user " +
            "WHERE create_time BETWEEN #{begin} AND #{end} " +
            "AND user_type = #{userType} " +
            "GROUP BY DATE(create_time) ")
    List<Map<String, Object>> countDailyNewUsers(@Param("userType") String userType,
                                                 @Param("begin") LocalDateTime begin,
                                                 @Param("end") LocalDateTime end);

    @Select("SELECT COUNT(*) AS total_user_count FROM user WHERE create_time < #{begin} AND user_type = #{userType} ")
    Long countTotalUsers(@Param("userType") String userType,
                            @Param("begin") LocalDateTime begin);
}
