package com.platform.backend.model;

public record MinuteData(
    String time,
    double price,
    long volume,
    double amount
) {}
