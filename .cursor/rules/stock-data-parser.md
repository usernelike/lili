# Stock Data Parser Rules

## Data Source: Tencent Finance API
GBK-encoded, tilde(`~`)-delimited text format.

## Key Index Mapping for Security Data

```
Index 0:  Unknown
Index 1:  Stock Name (e.g. "贵州茅台")
Index 2:  Stock Code (e.g. "600519")
Index 3:  Current Price
Index 4:  Yesterday Close
Index 5:  Open Price
Index 6:  Volume (手)
Index 7:  Outer Volume
Index 8:  Inner Volume
Index 9:  Bid1 Price
Index 10: Bid1 Volume
Index 11: Ask1 Price
Index 12: Ask1 Volume
Index 13-22: Bid2-5 Prices & Volumes (alternating)
Index 23-32: Ask2-5 Prices & Volumes (alternating)
Index 33: Last Trade Time
Index 34: Price Change (¥)
Index 35: Price Change (%)
Index 36: Highest Price
Index 37: Lowest Price
Index 38: Price-Volume Info
Index 39: Turnover (万元)
Index 40: Turnover Rate
Index 41: PE Ratio
Index 42: Unknown
Index 43: Total Market Cap
Index 44: Circulating Market Cap
Index 45: Price Limit Up
Index 46: Price Limit Down
```

## Parsing Code Pattern (Java)
```java
String raw = new String(responseBytes, Charset.forName("GBK"));
String[] parts = raw.split("~");
// Access: parts[1] name, parts[3] currentPrice, parts[35] changePercent, etc.
```

## Stock Code Prefix Convention
- Shanghai: `sh` prefix (e.g. sh600519)
- Shenzhen: `sz` prefix (e.g. sz000001)
- Hong Kong: `hk` prefix (e.g. hk00700)

## Data Validation
- Always null-check parts array length before accessing indices
- Parse prices with `Double.parseDouble()` wrapped in try-catch
- Volume may be 0 for suspended stocks — treat as valid
