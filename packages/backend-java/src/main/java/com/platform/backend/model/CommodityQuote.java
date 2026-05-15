package com.platform.backend.model;

public record CommodityQuote(
    String code,
    String name,
    double price,
    double changePercent,
    double open,
    double prevClose,
    double high,
    double low,
    String updateTime
) {}
