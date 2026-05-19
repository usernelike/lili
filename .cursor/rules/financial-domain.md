# Financial Domain Knowledge Rules

## Stock Metrics
| Metric | Chinese | Description |
|--------|---------|-------------|
| Current Price | 现价 | Latest traded price |
| Open | 开盘价 | First trade price of the day |
| Close | 昨收 | Yesterday's closing price |
| High / Low | 最高/最低 | Day's highest/lowest price |
| Volume | 成交量 | Total shares traded (手=100 shares) |
| Turnover | 成交额 | Total money traded (万元) |
| Turnover Rate | 换手率 | Volume / Circulating shares × 100% |
| PE Ratio | 市盈率 | Price / Earnings per share |
| Market Cap | 总市值 | Total shares × current price |
| Circulating Cap | 流通市值 | Circulating shares × current price |
| Bid/Ask | 买/卖盘 | Top 5 bid/ask prices with volumes |
| Limit Up/Down | 涨/跌停价 | Max daily price movement boundary |

## Trading Rules (A-Share)
- Main board: ±10% daily limit
- STAR board (科创板 688xxx) / ChiNext (创业板 300xxx): ±20%
- T+1 settlement: buy today, sell tomorrow
- Lot size: 100 shares minimum

## Color Convention
- Red = price up (Chinese convention, opposite to US)
- Green = price down
- Gray = flat / no change

## Watchlist Feature
- User adds stocks to personal watchlist
- Real-time SSE price updates
- Fields: stockCode, stockName, currentPrice, changePercent, addedAt

## Search Feature
- Fuzzy search by stock code or name
- Returns top N matches sorted by relevance
