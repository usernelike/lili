package com.platform.backend.service;

import com.platform.backend.model.WatchlistItem;
import com.platform.backend.repository.WatchlistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WatchlistService {

    private final WatchlistRepository repo;

    public WatchlistService(WatchlistRepository repo) {
        this.repo = repo;
    }

    public List<WatchlistItem> getAll(int userId) {
        return repo.findAllByUserId(userId);
    }

    public WatchlistItem add(int userId, String code, String name, String market, String note, String category, Double holdCost, Double holdQuantity) {
        repo.upsert(userId, code, name, market, note, category, holdCost, holdQuantity);
        return repo.findByCodeAndUserId(code, userId);
    }

    public WatchlistItem update(int userId, String code, String note, String category) {
        repo.updateByCodeAndUserId(userId, code, note, category);
        return repo.findByCodeAndUserId(code, userId);
    }

    public boolean remove(int userId, String code) {
        return repo.deleteByCodeAndUserId(userId, code) > 0;
    }
}
