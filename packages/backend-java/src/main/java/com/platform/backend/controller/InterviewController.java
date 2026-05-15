package com.platform.backend.controller;

import com.platform.backend.model.ApiResponse;
import com.platform.backend.service.InterviewFavoriteService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/interview")
public class InterviewController {

    private final InterviewFavoriteService service;

    public InterviewController(InterviewFavoriteService service) {
        this.service = service;
    }

    @GetMapping("/favorites")
    public ApiResponse<?> getFavorites() {
        return ApiResponse.ok(service.getAll());
    }

    @PostMapping("/favorites")
    public ApiResponse<?> addFavorite(@RequestBody Map<String, String> body) {
        String itemId = body.get("item_id");
        String question = body.get("question");
        String category = body.get("category");
        if (itemId == null || question == null || category == null) {
            return ApiResponse.error("缺少必要参数", 400);
        }
        service.add(itemId, question, category, body.get("note"));
        return ApiResponse.ok(Map.of("id", 1));
    }

    @DeleteMapping("/favorites/{id}")
    public ApiResponse<?> deleteFavorite(@PathVariable int id) {
        if (!service.remove(id)) {
            return ApiResponse.error("收藏不存在", 404);
        }
        return ApiResponse.ok(Map.of("removed", true));
    }
}
