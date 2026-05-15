package com.platform.backend.repository;

import com.platform.backend.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbc;

    public UserRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<User> mapper = (rs, rowNum) -> new User(
        rs.getInt("id"),
        rs.getString("username"),
        rs.getString("phone"),
        rs.getString("password_hash"),
        rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null
    );

    public User findById(int id) {
        var list = jdbc.query("SELECT * FROM users WHERE id = ?", mapper, id);
        return list.isEmpty() ? null : list.get(0);
    }

    public User findByUsername(String username) {
        var list = jdbc.query("SELECT * FROM users WHERE username = ?", mapper, username);
        return list.isEmpty() ? null : list.get(0);
    }

    public User findByPhone(String phone) {
        var list = jdbc.query("SELECT * FROM users WHERE phone = ?", mapper, phone);
        return list.isEmpty() ? null : list.get(0);
    }

    public int insert(String username, String phone, String passwordHash) {
        return jdbc.update(
            "INSERT INTO users (username, phone, password_hash) VALUES (?, ?, ?)",
            username, phone, passwordHash
        );
    }
}
