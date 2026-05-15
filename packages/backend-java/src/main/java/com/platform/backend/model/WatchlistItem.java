package com.platform.backend.model;

import java.time.LocalDateTime;

public record WatchlistItem(
    Integer id,
    String code,
    String name,
    String market,
    String note,
    String category,
    Double holdCost,
    Double holdQuantity,
    LocalDateTime createdAt
) {}
