package com.platform.backend.config;

import jakarta.annotation.PostConstruct;
import org.springframework.dao.DataAccessException;
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

        // Remove old single-column unique indexes and add composite ones
        dropIndexIfExists("interview_favorites", "uk_item_id");
        addUniqueIfNotExists("interview_favorites", "uk_user_item", "user_id, item_id");

        dropIndexIfExists("watchlist_items", "code");
        addUniqueIfNotExists("watchlist_items", "uk_user_code", "user_id, code");

        dropIndexIfExists("positions", "code");
        addUniqueIfNotExists("positions", "uk_user_code", "user_id, code");
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

    private void dropIndexIfExists(String table, String indexName) {
        try {
            var list = jdbc.queryForList(
                "SELECT 1 FROM information_schema.STATISTICS WHERE table_schema = DATABASE() AND table_name = ? AND INDEX_NAME = ? LIMIT 1",
                table, indexName
            );
            if (list.isEmpty()) return;
            jdbc.execute("ALTER TABLE " + table + " DROP INDEX " + indexName);
        } catch (DataAccessException ignored) {}
    }

    private void addUniqueIfNotExists(String table, String indexName, String columns) {
        try {
            var list = jdbc.queryForList(
                "SELECT 1 FROM information_schema.STATISTICS WHERE table_schema = DATABASE() AND table_name = ? AND INDEX_NAME = ? LIMIT 1",
                table, indexName
            );
            if (!list.isEmpty()) return;
        } catch (DataAccessException ignored) {}
        try {
            jdbc.execute("ALTER TABLE " + table + " ADD CONSTRAINT " + indexName + " UNIQUE (" + columns + ")");
        } catch (DataAccessException ignored) {}
    }
}
