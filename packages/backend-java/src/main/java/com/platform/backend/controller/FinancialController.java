package com.platform.backend.controller;

import com.platform.backend.model.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/financial")
public class FinancialController {

    @GetMapping("/stocks")
    public ApiResponse<?> getStocks() {
        return ApiResponse.ok(Map.of("list", java.util.List.of(), "total", 0, "page", 1, "pageSize", 0, "totalPages", 1));
    }

    @PostMapping("/lili/query")
    public ApiResponse<?> liliQuery(@RequestBody Map<String, Object> body) {
        // TODO: migrate lili datasource logic from Node.js
        return ApiResponse.error("lili 数据源暂未迁移到 Java 后端，请使用 Node.js 后端", 501);
    }

    @GetMapping("/watchlist")
    public ApiResponse<?> getWatchlist() {
        return ApiResponse.ok(java.util.List.of());
    }

    @PostMapping("/watchlist")
    public ApiResponse<?> addWatchlist(@RequestBody Map<String, Object> body) {
        return ApiResponse.error("请使用 /api/watchlist 端点", 400);
    }

    @GetMapping("/positions")
    public ApiResponse<?> getPositions() {
        return ApiResponse.ok(java.util.List.of());
    }

    @PostMapping("/positions")
    public ApiResponse<?> addPosition(@RequestBody Map<String, Object> body) {
        return ApiResponse.error("请使用 /api/positions 端点", 400);
    }

    @GetMapping("/positions/summary")
    public ApiResponse<?> getPositionsSummary() {
        return ApiResponse.ok(Map.of(
            "positions", java.util.List.of(),
            "totalCost", 0, "totalValue", 0,
            "totalProfit", 0, "totalProfitPercent", 0
        ));
    }
}
