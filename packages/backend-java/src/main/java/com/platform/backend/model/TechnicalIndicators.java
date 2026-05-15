package com.platform.backend.model;

public record TechnicalIndicators(
    Ma ma,
    Macd macd,
    Kdj kdj,
    Rsi rsi,
    Boll boll
) {
    public record Ma(double ma5, double ma10, double ma20, double ma60) {}
    public record Macd(double dif, double dea, double macd) {}
    public record Kdj(double k, double d, double j) {}
    public record Rsi(double rsi6, double rsi12, double rsi24) {}
    public record Boll(double upper, double middle, double lower) {}
}
