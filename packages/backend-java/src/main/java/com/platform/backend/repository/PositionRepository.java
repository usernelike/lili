package com.platform.backend.repository;

import com.platform.backend.model.PositionItem;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PositionRepository {

    private final JdbcTemplate jdbc;

    public PositionRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<PositionItem> mapper = (rs, rowNum) -> new PositionItem(
        rs.getInt("id"),
        rs.getString("code"),
        rs.getString("name"),
        rs.getString("market"),
        rs.getObject("cost_price") != null ? rs.getDouble("cost_price") : null,
        rs.getObject("shares") != null ? rs.getDouble("shares") : null,
        rs.getString("note"),
        rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null,
        rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null
    );

    public List<PositionItem> findAllByUserId(int userId) {
        return jdbc.query("SELECT * FROM positions WHERE user_id = ? ORDER BY created_at DESC", mapper, userId);
    }

    public PositionItem findByCodeAndUserId(String code, int userId) {
        var list = jdbc.query("SELECT * FROM positions WHERE code = ? AND user_id = ?", mapper, code, userId);
        return list.isEmpty() ? null : list.get(0);
    }

    public int insert(int userId, String code, String name, String market, Double costPrice, Double shares, String note) {
        return jdbc.update(
            "INSERT INTO positions (user_id, code, name, market, cost_price, shares, note) VALUES (?, ?, ?, ?, ?, ?, ?)",
            userId, code, name, market, costPrice, shares, note
        );
    }

    public int updateByCodeAndUserId(int userId, String code, Double costPrice, Double shares, String note) {
        return jdbc.update(
            "UPDATE positions SET cost_price = ?, shares = ?, note = ? WHERE code = ? AND user_id = ?",
            costPrice, shares, note, code, userId
        );
    }

    public int deleteByCodeAndUserId(int userId, String code) {
        return jdbc.update("DELETE FROM positions WHERE code = ? AND user_id = ?", code, userId);
    }
}
