---
name: stock-data-parser
description: Reference for parsing Tencent Stock API data formats used in the lili Hub project's StockService.java. Use when modifying stock data parsing logic, adding new fields from Tencent API, debugging data display issues, or working with real-time quotes, K-line, minute data, or commodity prices. Contains field index mappings, encoding details (GBK), and format specifications.
---

# Tencent Stock Data Parser Reference

## Overview

The `StockService.java` (`packages/backend-java/src/main/java/com/platform/backend/service/StockService.java`) fetches data from **Tencent Finance APIs** and parses proprietary text-based formats.

**Critical**: All responses from `qt.gtimg.cn` are **GBK-encoded**. Always decode with `Charset.forName("GBK")`.

## API Endpoints Used

| Endpoint | Purpose | Format |
|----------|---------|--------|
| `https://qt.gtimg.cn/q={codes}` | Real-time quotes | `~`-delimited, GBK |
| `https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param={code},day,{start},{end},{count},qfq` | Daily K-line | JSON |
| `https://web.ifzq.gtimg.cn/appstock/app/minute/query?code={code}` | Minute data | JSON |

## Real-Time Quote Format (`~` delimited)

### Request

```
GET https://qt.gtimg.cn/q=sh600519,sz000001
```

Multiple codes comma-separated. Prefix with `sh` (Shanghai/6xxxxx) or `sz` (Shenzhen/others).

### Response Format

```
v_sh600519="1~贵州茅台~600519~1676.00~1650.00~1680.00~...~2024-05-19 15:00:00";v_sz000001="1~平安银行~000001~...";
```

Each stock is separated by `;`. Each field within a stock is separated by `~`.

### Field Index Mapping (parts[])

| Index | Field | Type | Example |
|-------|-------|------|---------|
| `parts[1]` | Name | String | `贵州茅台` |
| `parts[2]` | Code | String | `600519` |
| `parts[3]` | Current Price | double | `1676.00` |
| `parts[4]` | Previous Close | double | `1650.00` |
| `parts[5]` | Open | double | `1680.00` |
| `parts[6]` | Volume (lots) | long | `1234567` |
| `parts[7]` | (skipped) | - | - |
| ... | ... | ... | ... |
| `parts[33]` | High | double | `1690.00` |
| `parts[34]` | Low | double | `1640.00` |
| `parts[37]` | Amount (CNY) | double | `987654321.00` |
| `parts[45]` | Update Time | String | `2024-05-19 15:00:00` |

**Minimum array length check**: Require `parts.length >= 45` before parsing.

### Derived Fields

```java
double change = price - prevClose;                                    // 涨跌额
double changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0; // 涨跌幅%
String market = code.startsWith("6") ? "上海" : "深圳";                // 市场
```

## Commodity Format (comma-delimited)

Commodities use a **different delimiter** — commas instead of `~`.

### Request

```
GET https://qt.gtimg.cn/q=hf_GC,hf_CL,hf_HG,hf_SI,hf_NG
```

Prefix: `hf_` + commodity code.

### Response Format

```
hf_GC="2500.50,1.25,2490.00,2480.00,2510.00,2520.00,2024-05-19 14:59:00";
```

### Field Index Mapping (comma-split)

| Index | Field | Example |
|-------|-------|---------|
| `[0]` | Current Price | `2500.50` |
| `[1]` | Change % | `1.25` |
| `[2]` | Open | `2490.00` |
| `[3]` | Previous Close | `2480.00` |
| `[4]` | High | `2510.00` |
| `[5]` | Low | `2520.00` |
| `[6]` | Update Time | `2024-05-19 14:59:00` |

**Minimum length check**: Require `parts.length >= 8`.

## K-Line Data Format (JSON)

### Request

```
GET https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=sh600519,day,20240101,20240519,120,qfq
```

Parameters: `{fullCode},{period},{startDate},{endDate},{count},{option}`

### Response Parsing (manual string parsing)

The response is JSON but parsed manually via string operations (not ObjectMapper) due to the specific nested structure:

```java
// Navigate to the day[] array for the given stock code:
// 1. Find "\"data\":" index
// 2. Find "\"{stockCode}\":" index after that
// 3. Find "\"day\":" after that
// 4. Extract array between [ and ]
// 5. Split by "],[" to get each day's data
```

### Day Data Format (within `],[` split)

Each element: `{date},{open},{close},{high},{low},{volume},{amount}`

Example: `20240519,1680.00,1676.00,1690.00,1640.00,12345,987654321.00`

| Index | Field |
|-------|-------|
| `[0]` | Date (yyyyMMdd) |
| `[1]` | Open |
| `[2]` | Close |
| `[3]` | High |
| `[4]` | Low |
| `[5]` | Volume |
| `[6]` | Amount |

**Minimum parts per day**: `parts.length >= 6`

## Minute Data Format (JSON)

### Request

```
GET https://web.ifzq.gtimg.cn/appstock/app/minute/query?code=sh600519
```

### Response Parsing

```java
// 1. Find "\"{code}\":" 
// 2. Find first "\"data\":" after that
// 3. Find second/nested "\"data\":" after that
// 4. Extract array between [ and ]
// 5. Split by "," to get each minute point
```

### Minute Point Format

Each element: `{time} {price} {volume}{amount}` (space-separated, amount may be fused with volume)

| Part | Field |
|------|-------|
| `[0]` | Time (e.g., `09:30`) |
| `[1]` | Price |
| `[2]` | Volume |
| `[3]` | Amount |

**Minimum parts**: `parts.length >= 4`

## Code Prefix Rules

When constructing full stock codes:

| Market | Prefix Condition | Example |
|--------|-----------------|---------|
| Shanghai (A股) | Code starts with `6` | `sh600519` |
| Shenzhen (A股) | Otherwise | `sz000001`, `sz300033` |
| Index (上证) | Known list | `sh000001` |
| Index (深证) | Known list | `sz399001` |

## Caching Strategy

All external API calls are cached in a `ConcurrentHashMap<String, CacheEntry<T>>`:

- **TTL**: 5000ms (5 seconds)
- **Key**: Comma-separated codes string
- **Type parameter**: Generic, supports any return type

```java
private <T> T getCached(String key, Supplier<T> supplier) {
    CacheEntry<T> entry = (CacheEntry<T>) cache.get(key);
    if (entry != null && System.currentTimeMillis() - entry.timestamp < CACHE_TTL) {
        return entry.data;
    }
    T data = supplier.get();
    cache.put(key, new CacheEntry<>(data, System.currentTimeMillis()));
    return data;
}
```

## Utility Methods

```java
private double parseDouble(String s) {
    try { return Double.parseDouble(s); } catch (Exception e) { return 0; }
}

private long parseLong(String s) {
    try { return Long.parseLong(s); } catch (Exception e) { return 0; }
}

private double round(double n) {
    return Math.round(n * 100) / 100.0;  // 2 decimal places
}
```

**Always use these helpers** when parsing string values from the API. Never assume valid numeric input.

## Stock List Source

Stocks are loaded from `/stocks.json` on the classpath at service initialization:

```java
JsonNode root = mapper.readTree(getClass().getResourceAsStream("/stocks.json"));
// Each node: { "code": "sh600519", "name": "贵州茅台", "market": "上海" }
```

Fallback minimal list of 6 stocks if file missing. The file contains ~93 A-stock entries.

## Common Pitfalls

1. **Forgetting GBK decode** → garbled Chinese characters
2. **Wrong prefix** (sh/sz) → no data returned
3. **Array index out of bounds** → always check `length >= N` before accessing
4. **Cache staliness during debug** → remember 5s TTL
5. **K-line date range** → max ~120 days of daily data available
6. **Commodity vs stock format confusion** → commodities use commas, stocks use `~`
