package com.steam.user.config;

import com.baomidou.mybatisplus.extension.handlers.AbstractJsonTypeHandler;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.lang.reflect.Field;
import java.util.List;

public class JsonListTypeHandler extends AbstractJsonTypeHandler<List<String>> {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public JsonListTypeHandler() {
        super(List.class); // 指定泛型类型
    }

    public JsonListTypeHandler(Class<?> type) {
        super(type);
    }

    public JsonListTypeHandler(Class<?> type, Field field) {
        super(type, field);
    }

    @Override
    public List<String> parse(String json) {
        System.out.println("Parsing JSON: " + json);
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public String toJson(List<String> list) {
        try {
            return objectMapper.writeValueAsString(list);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}