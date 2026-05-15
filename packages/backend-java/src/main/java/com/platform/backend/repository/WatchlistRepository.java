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

    public List<WatchlistItem> findAll() {
        return jdbc.query("SELECT * FROM watchlist_items ORDER BY created_at DESC", mapper);
    }

    public WatchlistItem findByCode(String code) {
        var list = jdbc.query("SELECT * FROM watchlist_items WHERE code = ?", mapper, code);
        return list.isEmpty() ? null : list.get(0);
    }

    public int upsert(String code, String name, String market, String note, String category, Double holdCost, Double holdQuantity) {
        return jdbc.update(
            "INSERT INTO watchlist_items (code, name, market, note, category, hold_cost, hold_quantity) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?) " +
            "ON DUPLICATE KEY UPDATE name = VALUES(name), market = VALUES(market), " +
            "note = VALUES(note), category = VALUES(category), hold_cost = VALUES(hold_cost), hold_quantity = VALUES(hold_quantity)",
            code, name, market, note, category, holdCost, holdQuantity
        );
    }

    public int updateByCode(String code, String note, String category) {
        return jdbc.update(
            "UPDATE watchlist_items SET note = ?, category = ? WHERE code = ?",
            note, category, code
        );
    }

    public int deleteByCode(String code) {
        return jdbc.update("DELETE FROM watchlist_items WHERE code = ?", code);
    }
}
