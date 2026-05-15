package com.platform.backend.controller;

import com.platform.backend.model.*;
import com.platform.backend.service.*;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/financial")
public class FinancialController {

    private final StockService stockService;
    private final TechnicalService technicalService;
    private final WatchlistService watchlistService;
    private final PositionService positionService;

    public FinancialController(StockService stockService, TechnicalService technicalService,
                               WatchlistService watchlistService, PositionService positionService) {
        this.stockService = stockService;
        this.technicalService = technicalService;
        this.watchlistService = watchlistService;
        this.positionService = positionService;
    }

    @GetMapping("/stocks")
    public ApiResponse<?> getStocks() {
        List<StockQuote> stocks = stockService.getRealTimeQuotes(List.of());
        return ApiResponse.ok(Map.of("list", stocks, "total", stocks.size(), "page", 1, "pageSize", stocks.size(), "totalPages", 1));
    }

    @GetMapping("/stocks/{code}")
    public ApiResponse<?> getStock(@PathVariable String code) {
        String prefix = code.startsWith("6") ? "sh" : "sz";
        List<StockQuote> stocks = stockService.getRealTimeQuotes(List.of(prefix + code));
        if (stocks.isEmpty()) return ApiResponse.error("股票不存在", 404);
        return ApiResponse.ok(stocks.get(0));
    }

    @GetMapping("/stocks/{code}/detail")
    public ApiResponse<?> getStockDetail(@PathVariable String code) {
        StockDetail detail = stockService.getStockDetail(code);
        if (detail == null) return ApiResponse.error("股票不存在或数据获取失败", 404);
        return ApiResponse.ok(detail);
    }

    @GetMapping("/stocks/{code}/indicators")
    public ApiResponse<?> getIndicators(@PathVariable String code) {
        StockDetail detail = stockService.getStockDetail(code);
        if (detail == null || detail.kline() == null || detail.kline().size() < 60) {
            return ApiResponse.error("K线数据不足，无法计算技术指标", 400);
        }
        TechnicalIndicators indicators = technicalService.calculateIndicators(detail.kline());
        if (indicators == null) return ApiResponse.error("技术指标计算失败", 400);
        return ApiResponse.ok(indicators);
    }

    @GetMapping("/stocks/{code}/minute")
    public ApiResponse<?> getMinute(@PathVariable String code) {
        return ApiResponse.ok(stockService.getMinuteData(code));
    }

    @GetMapping("/indices")
    public ApiResponse<?> getIndices() {
        return ApiResponse.ok(stockService.getMarketIndices());
    }

    @GetMapping("/commodities")
    public ApiResponse<?> getCommodities() {
        return ApiResponse.ok(stockService.getCommodities());
    }

    // ====== Watchlist (兼容前端旧路由) ======

    @GetMapping("/watchlist")
    public ApiResponse<?> getWatchlist() {
        return ApiResponse.ok(watchlistService.getAll());
    }

    @PostMapping("/watchlist")
    public ApiResponse<?> addWatchlist(@RequestBody Map<String, Object> body) {
        String code = (String) body.get("code");
        String name = (String) body.get("name");
        if (code == null || name == null) return ApiResponse.error("缺少 code 或 name", 400);
        return ApiResponse.ok(watchlistService.add(code, name,
            (String) body.getOrDefault("market", ""),
            (String) body.get("note"),
            (String) body.get("category"),
            body.get("holdCost") != null ? ((Number) body.get("holdCost")).doubleValue() : null,
            body.get("holdQuantity") != null ? ((Number) body.get("holdQuantity")).doubleValue() : null));
    }

    @PatchMapping("/watchlist/{code}")
    public ApiResponse<?> updateWatchlist(@PathVariable String code, @RequestBody Map<String, String> body) {
        var item = watchlistService.update(code, body.get("note"), body.get("category"));
        if (item == null) return ApiResponse.error("自选股不存在", 404);
        return ApiResponse.ok(item);
    }

    @DeleteMapping("/watchlist/{code}")
    public ApiResponse<?> deleteWatchlist(@PathVariable String code) {
        if (!watchlistService.remove(code)) return ApiResponse.error("自选股不存在", 404);
        return ApiResponse.ok(Map.of("removed", true));
    }

    // ====== Positions (兼容前端旧路由) ======

    @GetMapping("/positions")
    public ApiResponse<?> getPositions() {
        return ApiResponse.ok(positionService.getAll());
    }

    @PostMapping("/positions")
    public ApiResponse<?> addPosition(@RequestBody Map<String, Object> body) {
        String code = (String) body.get("code");
        String name = (String) body.get("name");
        Number costPrice = (Number) body.get("costPrice");
        Number shares = (Number) body.get("shares");
        if (code == null || name == null || costPrice == null || shares == null) {
            return ApiResponse.error("缺少必要参数", 400);
        }
        return ApiResponse.ok(positionService.add(code, name,
            (String) body.getOrDefault("market", ""),
            costPrice.doubleValue(), shares.doubleValue(), (String) body.get("note")));
    }

    @PatchMapping("/positions/{code}")
    public ApiResponse<?> updatePosition(@PathVariable String code, @RequestBody Map<String, Object> body) {
        Number costPrice = (Number) body.get("costPrice");
        Number shares = (Number) body.get("shares");
        var item = positionService.update(code,
            costPrice != null ? costPrice.doubleValue() : null,
            shares != null ? shares.doubleValue() : null,
            (String) body.get("note"));
        if (item == null) return ApiResponse.error("持仓不存在", 404);
        return ApiResponse.ok(item);
    }

    @DeleteMapping("/positions/{code}")
    public ApiResponse<?> deletePosition(@PathVariable String code) {
        if (!positionService.remove(code)) return ApiResponse.error("持仓不存在", 404);
        return ApiResponse.ok(Map.of("removed", true));
    }

    // ====== Positions Summary ======

    @GetMapping("/positions/summary")
    public ApiResponse<?> getPositionsSummary() {
        List<PositionItem> positions = positionService.getAll();
        if (positions.isEmpty()) {
            return ApiResponse.ok(Map.of("positions", List.of(), "totalCost", 0, "totalValue", 0, "totalProfit", 0, "totalProfitPercent", 0));
        }

        List<String> codes = positions.stream().map(p -> {
            String prefix = p.code().startsWith("6") ? "sh" : "sz";
            return prefix + p.code();
        }).toList();

        List<StockQuote> quotes = stockService.getRealTimeQuotes(codes);
        Map<String, Double> priceMap = new HashMap<>();
        for (StockQuote q : quotes) {
            priceMap.put(q.code(), q.price());
        }

        double totalCost = 0, totalValue = 0;
        for (PositionItem pos : positions) {
            double cost = pos.costPrice() * pos.shares();
            double value = (priceMap.getOrDefault(pos.code(), pos.costPrice())) * pos.shares();
            totalCost += cost;
            totalValue += value;
        }
        double totalProfit = totalValue - totalCost;
        double totalProfitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

        return ApiResponse.ok(Map.of(
            "positions", positions,
            "totalCost", round(totalCost),
            "totalValue", round(totalValue),
            "totalProfit", round(totalProfit),
            "totalProfitPercent", round(totalProfitPercent)
        ));
    }

    // ====== lili 数据源 ======

    @PostMapping("/lili/query")
    public ApiResponse<?> liliQuery(@RequestBody Map<String, Object> body) {
        String ticker = (String) body.get("ticker");
        if (ticker == null || ticker.isBlank()) {
            return ApiResponse.error("缺少 ticker 参数", 400);
        }
        return ApiResponse.error("lili 数据源需要配置 OAuth token，请联系管理员", 501);
    }

    private double round(double n) {
        return Math.round(n * 100) / 100.0;
    }
}
