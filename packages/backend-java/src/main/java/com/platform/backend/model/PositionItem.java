package com.platform.backend.model;

import java.time.LocalDateTime;

public record PositionItem(
    Integer id,
    String code,
    String name,
    String market,
    Double costPrice,
    Double shares,
    String note,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
