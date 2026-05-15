package com.platform.backend.model;

public record ApiResponse<T>(int code, T data, String message, boolean success) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(200, data, "ok", true);
    }

    public static <T> ApiResponse<T> error(String message, int code) {
        return new ApiResponse<>(code, null, message, false);
    }

    public static <T> ApiResponse<T> error(String message) {
        return error(message, 500);
    }
}
