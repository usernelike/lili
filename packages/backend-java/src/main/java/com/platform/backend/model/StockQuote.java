package com.platform.backend.model;

public record StockQuote(
    String code,
    String name,
    double price,
    double change,
    double changePercent,
    long volume,
    double amount,
    double high,
    double low,
    double open,
    double prevClose,
    String market,
    String updateTime
) {}
