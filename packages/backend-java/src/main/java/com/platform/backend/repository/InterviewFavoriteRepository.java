package com.platform.backend.repository;

import com.platform.backend.model.InterviewFavorite;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class InterviewFavoriteRepository {

    private final JdbcTemplate jdbc;

    public InterviewFavoriteRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<InterviewFavorite> mapper = (rs, rowNum) -> new InterviewFavorite(
        rs.getInt("id"),
        rs.getString("item_id"),
        rs.getString("question"),
        rs.getString("category"),
        rs.getString("note"),
        rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null
    );

    public List<InterviewFavorite> findAll() {
        return jdbc.query("SELECT * FROM interview_favorites ORDER BY created_at DESC", mapper);
    }

    public int insert(String itemId, String question, String category, String note) {
        return jdbc.update(
            "INSERT INTO interview_favorites (item_id, question, category, note) VALUES (?, ?, ?, ?)",
            itemId, question, category, note
        );
    }

    public int deleteById(int id) {
        return jdbc.update("DELETE FROM interview_favorites WHERE id = ?", id);
    }
}
