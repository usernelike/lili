package com.platform.backend.controller;

import com.platform.backend.model.ApiResponse;
import com.platform.backend.service.WatchlistService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    private final WatchlistService service;

    public WatchlistController(WatchlistService service) {
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
        if (code == null || name == null) {
            return ApiResponse.error("缺少 code 或 name", 400);
        }
        var item = service.add(
            getUserId(req),
            code, name,
            (String) body.getOrDefault("market", ""),
            (String) body.get("note"),
            (String) body.get("category"),
            body.get("hold_cost") != null ? ((Number) body.get("hold_cost")).doubleValue() : null,
            body.get("hold_quantity") != null ? ((Number) body.get("hold_quantity")).doubleValue() : null
        );
        return ApiResponse.ok(item);
    }

    @PatchMapping("/{code}")
    public ApiResponse<?> update(@PathVariable String code, @RequestBody Map<String, String> body, HttpServletRequest req) {
        var item = service.update(getUserId(req), code, body.get("note"), body.get("category"));
        if (item == null) {
            return ApiResponse.error("自选股不存在", 404);
        }
        return ApiResponse.ok(item);
    }

    @DeleteMapping("/{code}")
    public ApiResponse<?> delete(@PathVariable String code, HttpServletRequest req) {
        if (!service.remove(getUserId(req), code)) {
            return ApiResponse.error("自选股不存在", 404);
        }
        return ApiResponse.ok(Map.of("removed", true));
    }
}
