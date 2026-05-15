package com.platform.backend.controller;

import com.platform.backend.model.ApiResponse;
import com.platform.backend.service.AuthService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ApiResponse<?> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String phone = body.get("phone");
        String password = body.get("password");
        String confirmPassword = body.get("confirmPassword");

        if (username == null || username.trim().isEmpty()) {
            return ApiResponse.error("用户名不能为空", 400);
        }
        if (phone == null || !phone.matches("^1[3-9]\\d{9}$")) {
            return ApiResponse.error("手机号格式不正确", 400);
        }
        if (password == null || password.length() < 6) {
            return ApiResponse.error("密码至少6位", 400);
        }
        if (!password.equals(confirmPassword)) {
            return ApiResponse.error("两次密码不一致", 400);
        }

        try {
            var user = authService.register(username.trim(), phone, password);
            return ApiResponse.ok(Map.of("id", user.id(), "username", user.username()));
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage(), 400);
        }
    }

    @PostMapping("/login")
    public ApiResponse<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null) {
            return ApiResponse.error("用户名和密码不能为空", 400);
        }

        try {
            String token = authService.login(username.trim(), password);
            return ApiResponse.ok(Map.of("token", token));
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage(), 401);
        }
    }
}
