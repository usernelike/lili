package com.platform.backend.model;

import java.time.LocalDateTime;

public record InterviewFavorite(
    Integer id,
    String itemId,
    String question,
    String category,
    String note,
    LocalDateTime createdAt
) {}
