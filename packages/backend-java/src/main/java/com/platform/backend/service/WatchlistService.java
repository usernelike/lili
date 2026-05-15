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

    public List<WatchlistItem> getAll() {
        return repo.findAll();
    }

    public WatchlistItem add(String code, String name, String market, String note, String category, Double holdCost, Double holdQuantity) {
        repo.upsert(code, name, market, note, category, holdCost, holdQuantity);
        return repo.findByCode(code);
    }

    public WatchlistItem update(String code, String note, String category) {
        repo.updateByCode(code, note, category);
        return repo.findByCode(code);
    }

    public boolean remove(String code) {
        return repo.deleteByCode(code) > 0;
    }
}
