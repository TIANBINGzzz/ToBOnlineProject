package com.steam.common.interceptor;

import cn.hutool.core.util.StrUtil;
import com.steam.common.utils.UserContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

public class UserInfoInterceotor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // save user info to threadlocal
        String userId = request.getHeader("userId");
        if (StrUtil.isNotBlank(userId)){
            UserContext.set("userId", userId);
            UserContext.set("userName", request.getHeader("userName"));
            UserContext.set("role", request.getHeader("role"));
        }

        return true;
    }


    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // clean user info
        UserContext.clear();
    }
}
