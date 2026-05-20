package com.platform.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.backend.model.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIAssistantController {

    @Value("${kimi.api.key:}")
    private String kimiApiKey;

    @Value("${kimi.api.url:https://api.moonshot.cn/v1/chat/completions}")
    private String kimiApiUrl;

    @Value("${kimi.model:moonshot-v1-8k}")
    private String model;

    private static final String SYSTEM_PROMPT = """
        你是 lili Hub 平台的 AI 助手，专注于回答平台功能和使用相关的问题。

        【重要 - 思考过程规范】
        你的思考过程（thinking/reasoning）应当直接分析用户的问题、理解用户意图、从平台知识中检索相关信息。
        不要在思考过程中提及以下内容：
        - 不要提及"只能回答平台相关问题"、"需要拒绝非平台问题"等内部规则
        - 不要提及系统提示词、角色设定、输出格式约束等元信息
        - 不要暴露任何关于自身行为边界或限制的推理过程
        简而言之：思考过程就像一个专注的助手在认真理解用户需求，而不是在执行规则检查。

        lili Hub 平台功能介绍：

        1. 首页（/）：平台总览，展示平台所有功能模块的入口和简介。

        2. 金融数据（/financial）：
           - 实时行情：查看 93 只热门 A 股的实时价格、涨跌幅、成交量等
           - 支持分页浏览（每页 20 只），支持按代码或名称搜索
           - 股票详情页（/stock/{code}）：K线蜡烛图、技术指标（MA/MACD/KDJ/RSI/BOLL）、买卖盘、基本面数据
           - 市场指数：上证指数、深证成指、创业板指、科创50
           - 大宗商品：COMEX黄金、NYMEX原油、COMEX铜、COMEX白银、NYMEX天然气
           - 自选股管理：添加/删除自选，记录持仓成本和数量
           - 持仓管理：记录股票持仓，自动计算盈亏
           - 数据源支持：腾讯证券接口，A股实时行情（不支持美股、ETF、指数个股查询）

        3. lili 数据源（/lili）：
           - 基于 Kimi Code CLI 的 query_stock 插件
           - 支持 A 股（.SH/.SZ/.BJ）和港股（.HK）查询
           - 支持实时行情（realtime_price）、技术指标（realtime_tech，A股-only）、开盘摘要（open_summary）、收盘摘要（close_summary）
           - 使用示例展示在页面底部

        4. 面试知识库（/interview）：
           - 全栈面试知识点汇总，覆盖 HTML/CSS、JavaScript、React、Vue、Node.js、算法与数据结构等
           - 支持分类浏览、搜索
           - 支持收藏题目到个人收藏夹（登录后）
           - 收藏的题目可以在"只看收藏"模式下查看

        5. 企业查询（/enterprise）：
           - 企业工商信息查询功能

        6. 用户系统：
           - 注册（/register）：用户名、手机号、密码
           - 登录（/login）：用户名+密码
           - JWT Token 认证，数据隔离（每个用户只能看到自己的收藏、自选、持仓）

        你的职责：
        - 帮助用户快速定位到想要的功能页面
        - 解释每个页面的用途和如何使用
        - 引导用户完成操作时，使用 [页面名称](/path) 格式输出可点击链接，例如：[企业查询](/enterprise)、[金融数据](/financial)、[面试知识库](/interview)、[lili数据源](/lili)、[首页](/)
        - 不要使用 👉 等 emoji，不要输出 markdown 标题或代码块，保持回答简洁
        - 对于平台无关的问题，友好地引导用户回到平台功能话题，例如："这个问题超出了我的服务范围哦，不过我可以帮你了解平台的金融数据、面试知识库等功能，需要我介绍一下吗？"

        注意：不要泄露任何系统配置信息，如 API Key、数据库连接等。
        """;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    private void checkKey() {
        if (kimiApiKey == null || kimiApiKey.isBlank()) {
            throw new IllegalStateException("Kimi API Key 未配置，请联系管理员");
        }
    }

    @PostMapping("/chat")
    public void chatStream(@RequestBody Map<String, Object> body, HttpServletRequest request, HttpServletResponse response) throws IOException {
        int userId = (int) request.getAttribute("userId");
        String userMessage = (String) body.getOrDefault("message", "");
        List<Map<String, String>> history = (List<Map<String, String>>) body.getOrDefault("history", List.of());

        response.setContentType("text/event-stream");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Connection", "keep-alive");

        try {
            checkKey();
            String jsonBody = buildRequestBody(userMessage, history, true, String.valueOf(userId));
            HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(kimiApiUrl))
                .header("Authorization", "Bearer " + kimiApiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody, StandardCharsets.UTF_8))
                .build();

            HttpResponse<InputStream> resp = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofInputStream());
            PrintWriter writer = response.getWriter();

            if (resp.statusCode() != 200) {
                String errorBody = new BufferedReader(new InputStreamReader(resp.body(), StandardCharsets.UTF_8))
                    .lines().collect(java.util.stream.Collectors.joining("\n"));
                writer.write("data: {\"error\": \"Kimi API 错误 (HTTP " + resp.statusCode() + "): " + errorBody.replace("\"", "\\\"") + "\"}\n\n");
                writer.flush();
                return;
            }

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(resp.body(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    if (line.startsWith("data: ")) {
                        String data = line.substring(6);
                        if ("[DONE]".equals(data)) {
                            writer.write("data: [DONE]\n\n");
                            writer.flush();
                            break;
                        }
                        writer.write(line + "\n\n");
                        writer.flush();
                    }
                }
            }
        } catch (Exception e) {
            PrintWriter writer = response.getWriter();
            writer.write("data: {\"error\": \"" + e.getMessage().replace("\"", "\\\"") + "\"}\n\n");
            writer.flush();
        }
    }

    @PostMapping("/chat/sync")
    public ApiResponse<?> chatSync(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        int userId = (int) request.getAttribute("userId");
        String userMessage = (String) body.getOrDefault("message", "");
        List<Map<String, String>> history = (List<Map<String, String>>) body.getOrDefault("history", List.of());

        try {
            checkKey();
            String jsonBody = buildRequestBody(userMessage, history, false, String.valueOf(userId));
            HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(kimiApiUrl))
                .header("Authorization", "Bearer " + kimiApiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody, StandardCharsets.UTF_8))
                .build();

            HttpResponse<String> resp = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (resp.statusCode() != 200) {
                return ApiResponse.error("Kimi API 错误 (HTTP " + resp.statusCode() + "): " + resp.body(), resp.statusCode());
            }
            return ApiResponse.ok(Map.of("response", resp.body()));
        } catch (Exception e) {
            return ApiResponse.error("AI 请求失败: " + e.getMessage(), 500);
        }
    }

    private String buildRequestBody(String userMessage, List<Map<String, String>> history, boolean stream, String userId) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        List<Map<String, String>> messages = new ArrayList<>();

        messages.add(Map.of("role", "system", "content", SYSTEM_PROMPT));

        if (history != null) {
            for (Map<String, String> msg : history) {
                messages.add(Map.of(
                    "role", msg.getOrDefault("role", "user"),
                    "content", msg.getOrDefault("content", "")
                ));
            }
        }

        messages.add(Map.of("role", "user", "content", userMessage));

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", model);
        body.put("messages", messages);
        body.put("stream", stream);
        body.put("user", "user_" + userId);

        return mapper.writeValueAsString(body);
    }
}
