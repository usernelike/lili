package com.platform.backend.model;

import java.time.LocalDateTime;

public record User(
    Integer id,
    String username,
    String phone,
    String passwordHash,
    LocalDateTime createdAt
) {}
