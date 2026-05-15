package com.platform.backend.service;

import com.platform.backend.model.PositionItem;
import com.platform.backend.repository.PositionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PositionService {

    private final PositionRepository repo;

    public PositionService(PositionRepository repo) {
        this.repo = repo;
    }

    public List<PositionItem> getAll(int userId) {
        return repo.findAllByUserId(userId);
    }

    public PositionItem add(int userId, String code, String name, String market, Double costPrice, Double shares, String note) {
        var existing = repo.findByCodeAndUserId(code, userId);
        if (existing != null) {
            double newShares = existing.shares() + shares;
            double newCostPrice = (existing.costPrice() * existing.shares() + costPrice * shares) / newShares;
            repo.updateByCodeAndUserId(userId, code, newCostPrice, newShares, note != null ? note : existing.note());
            return repo.findByCodeAndUserId(code, userId);
        }
        repo.insert(userId, code, name, market, costPrice, shares, note);
        return repo.findByCodeAndUserId(code, userId);
    }

    public PositionItem update(int userId, String code, Double costPrice, Double shares, String note) {
        repo.updateByCodeAndUserId(userId, code, costPrice, shares, note);
        return repo.findByCodeAndUserId(code, userId);
    }

    public boolean remove(int userId, String code) {
        return repo.deleteByCodeAndUserId(userId, code) > 0;
    }
}
