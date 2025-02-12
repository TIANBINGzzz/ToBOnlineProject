package com.steam.common.utils;

import java.util.HashMap;
import java.util.Map;

public class UserContext {
    private static final ThreadLocal<Map<String, String>> threadLocal = ThreadLocal.withInitial(HashMap::new);

    public static void set(String key, String value) {
        threadLocal.get().put(key, value);
    }

    public static String get(String key) {
        return threadLocal.get().get(key);
    }

    public static Map<String, String> get() {
        return threadLocal.get();
    }

    public static void clear() {
        threadLocal.remove();
    }
}
