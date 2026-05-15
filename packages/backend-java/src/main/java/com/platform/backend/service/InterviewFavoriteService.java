package com.platform.backend.service;

import com.platform.backend.model.InterviewFavorite;
import com.platform.backend.repository.InterviewFavoriteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InterviewFavoriteService {

    private final InterviewFavoriteRepository repo;

    public InterviewFavoriteService(InterviewFavoriteRepository repo) {
        this.repo = repo;
    }

    public List<InterviewFavorite> getAll(int userId) {
        return repo.findAllByUserId(userId);
    }

    public void add(int userId, String itemId, String question, String category, String note) {
        var existing = repo.findByItemIdAndUserId(itemId, userId);
        if (existing.isEmpty()) {
            repo.insert(userId, itemId, question, category, note);
        }
    }

    public boolean remove(int userId, int id) {
        return repo.deleteByIdAndUserId(id, userId) > 0;
    }
}
