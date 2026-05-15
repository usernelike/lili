package com.platform.backend.controller;

import com.platform.backend.model.ApiResponse;
import com.platform.backend.service.PositionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/positions")
public class PositionController {

    private final PositionService service;

    public PositionController(PositionService service) {
        this.service = service;
    }

    private int getUserId(HttpServletRequest req) {
        return (int) req.getAttribute("userId");
    }

    @GetMapping
    public ApiResponse<?> getAll(HttpServletRequest req) {
        return ApiResponse.ok(service.getAll(getUserId(req)));
    }

    @PostMapping
    public ApiResponse<?> add(@RequestBody Map<String, Object> body, HttpServletRequest req) {
        String code = (String) body.get("code");
        String name = (String) body.get("name");
        Number costPrice = (Number) body.get("cost_price");
        Number shares = (Number) body.get("shares");
        if (code == null || name == null || costPrice == null || shares == null) {
            return ApiResponse.error("缺少必要参数", 400);
        }
        var item = service.add(
            getUserId(req),
            code, name,
            (String) body.getOrDefault("market", ""),
            costPrice.doubleValue(),
            shares.doubleValue(),
            (String) body.get("note")
        );
        return ApiResponse.ok(item);
    }

    @PatchMapping("/{code}")
    public ApiResponse<?> update(@PathVariable String code, @RequestBody Map<String, Object> body, HttpServletRequest req) {
        Number costPrice = (Number) body.get("cost_price");
        Number shares = (Number) body.get("shares");
        var item = service.update(
            getUserId(req), code,
            costPrice != null ? costPrice.doubleValue() : null,
            shares != null ? shares.doubleValue() : null,
            (String) body.get("note")
        );
        if (item == null) {
            return ApiResponse.error("持仓不存在", 404);
        }
        return ApiResponse.ok(item);
    }

    @DeleteMapping("/{code}")
    public ApiResponse<?> delete(@PathVariable String code, HttpServletRequest req) {
        if (!service.remove(getUserId(req), code)) {
            return ApiResponse.error("持仓不存在", 404);
        }
        return ApiResponse.ok(Map.of("removed", true));
    }
}
