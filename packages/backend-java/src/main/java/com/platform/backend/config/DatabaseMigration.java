package com.platform.backend.config;

import jakarta.annotation.PostConstruct;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigration {

    private final JdbcTemplate jdbc;

    public DatabaseMigration(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @PostConstruct
    public void migrate() {
        addColumnIfNotExists("interview_favorites", "user_id", "INT NOT NULL DEFAULT 0");
        addColumnIfNotExists("watchlist_items", "user_id", "INT NOT NULL DEFAULT 0");
        addColumnIfNotExists("positions", "user_id", "INT NOT NULL DEFAULT 0");
    }

    private void addColumnIfNotExists(String table, String column, String def) {
        try {
            jdbc.queryForObject(
                "SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?",
                Integer.class, table, column
            );
        } catch (EmptyResultDataAccessException e) {
            jdbc.execute("ALTER TABLE " + table + " ADD COLUMN " + column + " " + def);
        }
    }
}
