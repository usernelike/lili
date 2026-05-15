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

    public List<PositionItem> findAll() {
        return jdbc.query("SELECT * FROM positions ORDER BY created_at DESC", mapper);
    }

    public PositionItem findByCode(String code) {
        var list = jdbc.query("SELECT * FROM positions WHERE code = ?", mapper, code);
        return list.isEmpty() ? null : list.get(0);
    }

    public int insert(String code, String name, String market, Double costPrice, Double shares, String note) {
        return jdbc.update(
            "INSERT INTO positions (code, name, market, cost_price, shares, note) VALUES (?, ?, ?, ?, ?, ?)",
            code, name, market, costPrice, shares, note
        );
    }

    public int updateByCode(String code, Double costPrice, Double shares, String note) {
        return jdbc.update(
            "UPDATE positions SET cost_price = ?, shares = ?, note = ?, updated_at = CURRENT_TIMESTAMP WHERE code = ?",
            costPrice, shares, note, code
        );
    }

    public int deleteByCode(String code) {
        return jdbc.update("DELETE FROM positions WHERE code = ?", code);
    }
}
