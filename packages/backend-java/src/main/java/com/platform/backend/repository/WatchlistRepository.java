package com.platform.backend.repository;

import com.platform.backend.model.WatchlistItem;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class WatchlistRepository {

    private final JdbcTemplate jdbc;

    public WatchlistRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<WatchlistItem> mapper = (rs, rowNum) -> new WatchlistItem(
        rs.getInt("id"),
        rs.getString("code"),
        rs.getString("name"),
        rs.getString("market"),
        rs.getString("note"),
        rs.getString("category"),
        rs.getObject("hold_cost") != null ? rs.getDouble("hold_cost") : null,
        rs.getObject("hold_quantity") != null ? rs.getDouble("hold_quantity") : null,
        rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null
    );

    public List<WatchlistItem> findAllByUserId(int userId) {
        return jdbc.query("SELECT * FROM watchlist_items WHERE user_id = ? ORDER BY created_at DESC", mapper, userId);
    }

    public WatchlistItem findByCodeAndUserId(String code, int userId) {
        var list = jdbc.query("SELECT * FROM watchlist_items WHERE code = ? AND user_id = ?", mapper, code, userId);
        return list.isEmpty() ? null : list.get(0);
    }

    public int upsert(int userId, String code, String name, String market, String note, String category, Double holdCost, Double holdQuantity) {
        return jdbc.update(
            "INSERT INTO watchlist_items (user_id, code, name, market, note, category, hold_cost, hold_quantity) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?) " +
            "ON DUPLICATE KEY UPDATE name = VALUES(name), market = VALUES(market), " +
            "note = VALUES(note), category = VALUES(category), hold_cost = VALUES(hold_cost), hold_quantity = VALUES(hold_quantity)",
            userId, code, name, market, note, category, holdCost, holdQuantity
        );
    }

    public int updateByCodeAndUserId(int userId, String code, String note, String category) {
        return jdbc.update(
            "UPDATE watchlist_items SET note = ?, category = ? WHERE code = ? AND user_id = ?",
            note, category, code, userId
        );
    }

    public int deleteByCodeAndUserId(int userId, String code) {
        return jdbc.update("DELETE FROM watchlist_items WHERE code = ? AND user_id = ?", code, userId);
    }
}
