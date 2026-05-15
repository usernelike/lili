package com.platform.backend.controller;

import com.platform.backend.model.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enterprise")
public class EnterpriseController {

    @GetMapping("/search")
    public ApiResponse<?> search(@RequestParam(required = false) String keyword) {
        return ApiResponse.ok(Map.of(
            "list", List.of(),
            "total", 0,
            "page", 1,
            "pageSize", 10,
            "totalPages", 0,
            "_notice", keyword != null
                ? "搜索关键词\"" + keyword + "\"暂未接入真实数据源。请在环境变量中配置天眼查API Token后启用。"
                : "企业查询功能需要天眼查API Token。请在环境变量中配置 TIANYANCHA_TOKEN。",
            "_availablePlatforms", List.of(
                Map.of("name", "天眼查", "url", "https://www.tianyancha.com"),
                Map.of("name", "爱企查", "url", "https://aiqicha.baidu.com"),
                Map.of("name", "企查查", "url", "https://www.qcc.com")
            )
        ));
    }

    @GetMapping("/{id}")
    public ApiResponse<?> getDetail(@PathVariable String id) {
        return ApiResponse.error("企业详情查询需要配置天眼查API Token。请在环境变量中设置 TIANYANCHA_TOKEN。", 404);
    }
}
