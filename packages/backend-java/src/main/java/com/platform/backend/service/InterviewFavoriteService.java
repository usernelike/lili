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

    public List<InterviewFavorite> getAll() {
        return repo.findAll();
    }

    public void add(String itemId, String question, String category, String note) {
        repo.insert(itemId, question, category, note);
    }

    public boolean remove(int id) {
        return repo.deleteById(id) > 0;
    }
}
