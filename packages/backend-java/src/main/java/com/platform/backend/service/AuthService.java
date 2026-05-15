package com.platform.backend.service;

import com.platform.backend.model.User;
import com.platform.backend.repository.UserRepository;
import com.platform.backend.util.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository repo;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository repo, JwtUtil jwtUtil) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
    }

    public User register(String username, String phone, String password) {
        if (repo.findByUsername(username) != null) {
            throw new IllegalArgumentException("用户名已存在");
        }
        if (repo.findByPhone(phone) != null) {
            throw new IllegalArgumentException("手机号已注册");
        }
        String hash = encoder.encode(password);
        repo.insert(username, phone, hash);
        return repo.findByUsername(username);
    }

    public String login(String username, String password) {
        User user = repo.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("用户不存在");
        }
        if (!encoder.matches(password, user.passwordHash())) {
            throw new IllegalArgumentException("密码错误");
        }
        return jwtUtil.generateToken(user.id());
    }

    public User getUserById(int id) {
        return repo.findById(id);
    }
}
