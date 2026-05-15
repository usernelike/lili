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

    public List<PositionItem> getAll() {
        return repo.findAll();
    }

    public PositionItem add(String code, String name, String market, Double costPrice, Double shares, String note) {
        // 如果已存在则合并（加权平均成本）
        var existing = repo.findByCode(code);
        if (existing != null) {
            double newShares = existing.shares() + shares;
            double newCostPrice = (existing.costPrice() * existing.shares() + costPrice * shares) / newShares;
            repo.updateByCode(code, newCostPrice, newShares, note != null ? note : existing.note());
            return repo.findByCode(code);
        }
        repo.insert(code, name, market, costPrice, shares, note);
        return repo.findByCode(code);
    }

    public PositionItem update(String code, Double costPrice, Double shares, String note) {
        repo.updateByCode(code, costPrice, shares, note);
        return repo.findByCode(code);
    }

    public boolean remove(String code) {
        return repo.deleteByCode(code) > 0;
    }
}
