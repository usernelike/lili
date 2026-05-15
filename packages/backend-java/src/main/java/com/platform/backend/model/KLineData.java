package com.platform.backend.model;

public record KLineData(
    String date,
    double open,
    double close,
    double high,
    double low,
    long volume,
    double amount
) {}
