package com.platform.backend.service;

import com.platform.backend.model.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.nio.charset.Charset;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class StockService {

    private static final String TENCENT_API = "https://qt.gtimg.cn/q=";
    private static final String KLINE_API = "https://web.ifzq.gtimg.cn/appstock/app/fqkline/get";
    private static final String MINUTE_API = "https://web.ifzq.gtimg.cn/appstock/app/minute/query";
    private static final long CACHE_TTL = 5000;

    private final RestTemplate restTemplate = new RestTemplate();
    private final Map<String, CacheEntry<?>> cache = new ConcurrentHashMap<>();

    private record CacheEntry<T>(T data, long timestamp) {}

    private final List<StockInfo> stockList;

    public StockService() {
        List<StockInfo> loaded = new ArrayList<>();
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(getClass().getResourceAsStream("/stocks.json"));
            for (JsonNode node : root) {
                loaded.add(new StockInfo(
                    node.get("code").asText(),
                    node.get("name").asText(),
                    node.get("market").asText()
                ));
            }
        } catch (Exception e) {
            // Fallback to minimal list if file missing
            loaded.addAll(List.of(
                new StockInfo("sh600519", "贵州茅台", "上海"),
                new StockInfo("sz000001", "平安银行", "深圳"),
                new StockInfo("sz000002", "万科A", "深圳"),
                new StockInfo("sz300033", "同花顺", "深圳"),
                new StockInfo("sz000858", "五粮液", "深圳"),
                new StockInfo("sz002594", "比亚迪", "深圳")
            ));
        }
        this.stockList = List.copyOf(loaded);
    }

    private final List<StockInfo> indexList = List.of(
        new StockInfo("sh000001", "上证指数", ""),
        new StockInfo("sz399001", "深证成指", ""),
        new StockInfo("sz399006", "创业板指", ""),
        new StockInfo("sh000688", "科创50", "")
    );

    private final List<CommodityInfo> commodityList = List.of(
        new CommodityInfo("hf_GC", "COMEX黄金"),
        new CommodityInfo("hf_CL", "NYMEX原油"),
        new CommodityInfo("hf_HG", "COMEX铜"),
        new CommodityInfo("hf_SI", "COMEX白银"),
        new CommodityInfo("hf_NG", "NYMEX天然气")
    );

    public record StockInfo(String code, String name, String market) {}
    private record CommodityInfo(String code, String name) {}

    @SuppressWarnings("unchecked")
    private <T> T getCached(String key, java.util.function.Supplier<T> supplier) {
        CacheEntry<T> entry = (CacheEntry<T>) cache.get(key);
        if (entry != null && System.currentTimeMillis() - entry.timestamp < CACHE_TTL) {
            return entry.data;
        }
        T data = supplier.get();
        cache.put(key, new CacheEntry<>(data, System.currentTimeMillis()));
        return data;
    }

    private String fetchTencentGBK(String url) {
        ResponseEntity<byte[]> response = restTemplate.getForEntity(url, byte[].class);
        byte[] body = response.getBody();
        if (body == null) return "";
        return new String(body, Charset.forName("GBK"));
    }

    public List<StockQuote> getRealTimeQuotes(List<String> codes) {
        List<String> targetCodes = (codes != null && !codes.isEmpty()) ? codes : stockList.stream().map(StockInfo::code).toList();
        String cacheKey = String.join(",", targetCodes);
        return getCached(cacheKey, () -> {
            String url = TENCENT_API + String.join(",", targetCodes);
            String raw = fetchTencentGBK(url);
            return parseTencentResponse(raw);
        });
    }

    public List<StockInfo> getStockList() {
        return stockList;
    }

    public List<StockInfo> searchStocks(String keyword) {
        if (keyword == null || keyword.isBlank()) return List.of();
        String kw = keyword.toLowerCase();
        return stockList.stream()
            .filter(s -> s.code().toLowerCase().contains(kw) || s.name().contains(keyword))
            .toList();
    }

    public List<StockQuote> getMarketIndices() {
        return getCached("indices", () -> {
            String url = TENCENT_API + indexList.stream().map(StockInfo::code).collect(java.util.stream.Collectors.joining(","));
            String raw = fetchTencentGBK(url);
            return parseTencentResponse(raw);
        });
    }

    public List<CommodityQuote> getCommodities() {
        return getCached("commodities", () -> {
            String url = TENCENT_API + commodityList.stream().map(CommodityInfo::code).collect(java.util.stream.Collectors.joining(","));
            String raw = fetchTencentGBK(url);
            return parseCommodityResponse(raw);
        });
    }

    public StockDetail getStockDetail(String code) {
        String prefix = code.startsWith("6") ? "sh" : "sz";
        String fullCode = prefix + code;

        String url = TENCENT_API + fullCode;
        String raw = fetchTencentGBK(url);
        StockDetail detail = parseStockDetail(raw, code);
        if (detail == null) return null;

        // K线数据
        try {
            LocalDate today = LocalDate.now();
            LocalDate start = today.minusDays(120);
            String startStr = start.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String endStr = today.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String klineUrl = KLINE_API + "?param=" + fullCode + ",day," + startStr + "," + endStr + ",120,qfq";
            String klineRaw = restTemplate.getForObject(klineUrl, String.class);
            List<KLineData> kline = parseKLineResponse(klineRaw, fullCode);
            detail = new StockDetail(
                detail.code(), detail.name(), detail.price(), detail.change(), detail.changePercent(),
                detail.volume(), detail.amount(), detail.high(), detail.low(), detail.open(), detail.prevClose(),
                detail.market(), detail.updateTime(), detail.bidPrice(), detail.bidVolume(), detail.askPrice(), detail.askVolume(),
                detail.turnoverRate(), detail.peRatio(), detail.pbRatio(), detail.totalMarketCap(), detail.floatMarketCap(),
                detail.totalShares(), detail.floatShares(), detail.amplitude(), detail.volumeRatio(), detail.commissionRatio(),
                detail.avgPrice(), detail.week52High(), detail.week52Low(), detail.change5d(), detail.change10d(), detail.change20d(),
                kline
            );
        } catch (Exception e) {
            // ignore
        }
        return detail;
    }

    public List<MinuteData> getMinuteData(String code) {
        String prefix = code.startsWith("6") ? "sh" : "sz";
        String fullCode = prefix + code;
        String url = MINUTE_API + "?code=" + fullCode;
        try {
            String raw = restTemplate.getForObject(url, String.class);
            return parseMinuteResponse(raw, fullCode);
        } catch (Exception e) {
            return List.of();
        }
    }

    // ========== Parsers ==========

    private List<StockQuote> parseTencentResponse(String raw) {
        List<StockQuote> results = new ArrayList<>();
        String[] lines = raw.trim().split(";");
        for (String line : lines) {
            if (line.isBlank()) continue;
            int eq = line.indexOf("=\"");
            if (eq == -1) continue;
            int end = line.lastIndexOf('"');
            if (end <= eq) continue;
            String content = line.substring(eq + 2, end);
            String[] parts = content.split("~");
            if (parts.length < 45) continue;

            String name = parts[1];
            String code = parts[2];
            double price = parseDouble(parts[3]);
            double prevClose = parseDouble(parts[4]);
            double open = parseDouble(parts[5]);
            long volume = parseLong(parts[6]);
            double high = parseDouble(parts[33]);
            double low = parseDouble(parts[34]);
            double amount = parseDouble(parts[37]);
            String updateTime = parts[45];

            double change = price - prevClose;
            double changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;

            String market = code.startsWith("6") ? "上海" : "深圳";
            String stockName = name;
            // Only override if the API didn't return a name
            if (stockName == null || stockName.isBlank()) {
                for (StockInfo info : stockList) {
                    if (info.code.equals("sh" + code) || info.code.equals("sz" + code)) {
                        stockName = info.name;
                        market = info.market;
                        break;
                    }
                }
                if (stockName == null || stockName.isBlank()) {
                    for (StockInfo info : indexList) {
                        if (info.code.equals("sh" + code) || info.code.equals("sz" + code)) {
                            stockName = info.name;
                            market = "";
                            break;
                        }
                    }
                }
            }

            results.add(new StockQuote(
                code, stockName, price, round(change), round(changePercent),
                volume, amount, high, low, open, prevClose, market, updateTime
            ));
        }
        return results;
    }

    private List<CommodityQuote> parseCommodityResponse(String raw) {
        List<CommodityQuote> results = new ArrayList<>();
        String[] lines = raw.trim().split(";");
        for (String line : lines) {
            if (line.isBlank()) continue;
            int eq = line.indexOf("=");
            if (eq == -1) continue;
            String codeKey = line.substring(2, eq);
            int q1 = line.indexOf('"', eq);
            int q2 = line.lastIndexOf('"');
            if (q1 == -1 || q2 <= q1) continue;
            String content = line.substring(q1 + 1, q2);
            String[] parts = content.split(",");
            if (parts.length < 8) continue;

            double price = parseDouble(parts[0]);
            double changePercent = parseDouble(parts[1]);
            double open = parseDouble(parts[2]);
            double prevClose = parseDouble(parts[3]);
            double high = parseDouble(parts[4]);
            double low = parseDouble(parts[5]);
            String updateTime = parts[6];

            String name = codeKey;
            for (CommodityInfo info : commodityList) {
                if (info.code.equals(codeKey)) {
                    name = info.name;
                    break;
                }
            }

            results.add(new CommodityQuote(
                codeKey, name, round(price), round(changePercent), round(open),
                round(prevClose), round(high), round(low), updateTime
            ));
        }
        return results;
    }

    private StockDetail parseStockDetail(String raw, String inputCode) {
        String[] lines = raw.trim().split(";");
        if (lines.length == 0) return null;
        String line = lines[0];
        int eq = line.indexOf("=\"");
        if (eq == -1) return null;
        int end = line.lastIndexOf('"');
        if (end <= eq) return null;
        String content = line.substring(eq + 2, end);
        String[] p = content.split("~");
        if (p.length < 50) return null;

        String code = p[2];
        double price = parseDouble(p[3]);
        double prevClose = parseDouble(p[4]);
        double open = parseDouble(p[5]);
        long volume = parseLong(p[6]);
        double high = parseDouble(p[33]);
        double low = parseDouble(p[34]);
        double amount = parseDouble(p[37]);

        List<Double> bidPrice = new ArrayList<>();
        List<Integer> bidVolume = new ArrayList<>();
        List<Double> askPrice = new ArrayList<>();
        List<Integer> askVolume = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            bidPrice.add(parseDouble(p[9 + i * 2]));
            bidVolume.add((int) parseLong(p[10 + i * 2]));
            askPrice.add(parseDouble(p[19 + i * 2]));
            askVolume.add((int) parseLong(p[20 + i * 2]));
        }

        double change = price - prevClose;
        double changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
        String market = code.startsWith("6") ? "上海" : "深圳";
        String name = p[1];
        if (name == null || name.isBlank()) {
            for (StockInfo info : stockList) {
                if (info.code.equals("sh" + code) || info.code.equals("sz" + code)) {
                    name = info.name;
                    market = info.market;
                    break;
                }
            }
            if (name == null || name.isBlank()) {
                for (StockInfo info : indexList) {
                    if (info.code.equals("sh" + code) || info.code.equals("sz" + code)) {
                        name = info.name;
                        market = "";
                        break;
                    }
                }
            }
        }

        return new StockDetail(
            code, name, price, round(change), round(changePercent), volume, amount, high, low, open, prevClose, market, p[30] != null ? p[30] : "",
            bidPrice, bidVolume, askPrice, askVolume,
            parseDouble(p[38]), parseDouble(p[39]), parseDouble(p[46]),
            parseDouble(p[44]), parseDouble(p[45]), parseDouble(p[67]), parseDouble(p[68]),
            parseDouble(p[43]), parseDouble(p[49]), parseDouble(p[50]), parseDouble(p[51]),
            parseDouble(p[47]), parseDouble(p[48]), parseDouble(p[62]), parseDouble(p[63]), parseDouble(p[64]),
            List.of()
        );
    }

    @SuppressWarnings("unchecked")
    private List<KLineData> parseKLineResponse(String raw, String stockCode) {
        if (raw == null) return List.of();
        try {
            // Simple JSON parsing for the specific Tencent format
            int dataIdx = raw.indexOf("\"data\":");
            if (dataIdx == -1) return List.of();
            int codeIdx = raw.indexOf("\"" + stockCode + "\":");
            if (codeIdx == -1) return List.of();
            int dayIdx = raw.indexOf("\"day\":", codeIdx);
            if (dayIdx == -1) return List.of();
            int arrStart = raw.indexOf("[", dayIdx);
            int arrEnd = raw.indexOf("]", arrStart);
            if (arrStart == -1 || arrEnd == -1) return List.of();
            String arrContent = raw.substring(arrStart + 1, arrEnd);
            List<KLineData> result = new ArrayList<>();
            // Split by "],[" to get each day's data
            String[] days = arrContent.split("\\],\\[");
            for (String day : days) {
                day = day.replace("[", "").replace("]", "").replace("\"", "");
                String[] parts = day.split(",");
                if (parts.length < 6) continue;
                result.add(new KLineData(
                    parts[0].trim(),
                    parseDouble(parts[1].trim()),
                    parseDouble(parts[2].trim()),
                    parseDouble(parts[3].trim()),
                    parseDouble(parts[4].trim()),
                    parseLong(parts[5].trim()),
                    parts.length > 6 ? parseDouble(parts[6].trim()) : 0
                ));
            }
            return result;
        } catch (Exception e) {
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    private List<MinuteData> parseMinuteResponse(String raw, String stockCode) {
        if (raw == null) return List.of();
        try {
            int codeIdx = raw.indexOf("\"" + stockCode + "\":");
            if (codeIdx == -1) return List.of();
            int dataIdx = raw.indexOf("\"data\":", codeIdx);
            if (dataIdx == -1) return List.of();
            int innerData = raw.indexOf("\"data\":", dataIdx + 7);
            if (innerData == -1) return List.of();
            int arrStart = raw.indexOf("[", innerData);
            int arrEnd = raw.indexOf("]", arrStart);
            if (arrStart == -1 || arrEnd == -1) return List.of();
            String arrContent = raw.substring(arrStart + 1, arrEnd);
            List<MinuteData> result = new ArrayList<>();
            String[] items = arrContent.split(",");
            for (String item : items) {
                item = item.replace("\"", "").trim();
                String[] parts = item.split(" ");
                if (parts.length < 4) continue;
                result.add(new MinuteData(
                    parts[0], parseDouble(parts[1]), parseLong(parts[2]), parseDouble(parts[3])
                ));
            }
            return result;
        } catch (Exception e) {
            return List.of();
        }
    }

    private double parseDouble(String s) {
        try { return Double.parseDouble(s); } catch (Exception e) { return 0; }
    }

    private long parseLong(String s) {
        try { return Long.parseLong(s); } catch (Exception e) { return 0; }
    }

    private double round(double n) {
        return Math.round(n * 100) / 100.0;
    }
}
