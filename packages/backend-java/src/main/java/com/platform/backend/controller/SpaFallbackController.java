package com.platform.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * SPA fallback controller: forwards all non-API, non-static-resource paths to index.html.
 * This eliminates the need to manually register every new frontend route in WebConfig.
 *
 * Exclusions:
 * - /api/**    -> REST API routes (handled by @RestControllers)
 * - /assets/** -> bundled JS/CSS files
 * - paths containing "." -> static resources (favicon.ico, images, fonts, etc.)
 *
 * Spring's RequestMappingHandlerMapping already prioritizes exact matches over wildcard
 * patterns, so existing @RestController/@Controller mappings are NOT affected.
 */
@Controller
public class SpaFallbackController {

    /**
     * Matches up to 4 path segments, each not containing a dot.
     * This covers frontend routes like:
     *   /divination
     *   /worldcup/team/argentina
     *   /stock/600519
     * While excluding static resources like:
     *   /assets/index-abc.js
     *   /favicon.ico
     */
    @RequestMapping(value = {
        "/{path:[^.]+}",
        "/{path1:[^.]+}/{path2:[^.]+}",
        "/{path1:[^.]+}/{path2:[^.]+}/{path3:[^.]+}",
        "/{path1:[^.]+}/{path2:[^.]+}/{path3:[^.]+}/{path4:[^.]+}"
    })
    public String forward(HttpServletRequest request) {
        String uri = request.getRequestURI();

        // Don't interfere with API routes
        if (uri.startsWith("/api/")) {
            return null;
        }
        // Don't interfere with static assets directory
        if (uri.startsWith("/assets/")) {
            return null;
        }

        return "forward:/index.html";
    }
}
