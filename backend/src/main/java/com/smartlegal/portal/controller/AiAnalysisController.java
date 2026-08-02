package com.smartlegal.portal.controller;

import com.smartlegal.portal.common.ApiResponse;
import com.smartlegal.portal.dto.ai.*;
import com.smartlegal.portal.service.AiAnalysisService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
public class AiAnalysisController {

    private final AiAnalysisService aiAnalysisService;

    public AiAnalysisController(AiAnalysisService aiAnalysisService) {
        this.aiAnalysisService = aiAnalysisService;
    }

    @PostMapping("/analyze/{documentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<AiAnalysisResponse>> analyzeDocument(
            @PathVariable Long documentId,
            Authentication authentication) {

        AiAnalysisResponse response = aiAnalysisService.analyzeDocument(documentId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Document analyzed successfully with AI", response));
    }

    @GetMapping("/result/{documentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<AiAnalysisResponse>> getAnalysisResult(
            @PathVariable Long documentId,
            Authentication authentication) {

        AiAnalysisResponse response = aiAnalysisService.getAnalysisResult(documentId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("AI analysis result retrieved", response));
    }

    @PostMapping("/chat/{documentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ChatResponse>> chatWithDocument(
            @PathVariable Long documentId,
            @Valid @RequestBody ChatRequest request,
            Authentication authentication) {

        ChatResponse response = aiAnalysisService.chatWithDocument(documentId, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("AI response generated", response));
    }

    @GetMapping("/dashboard-stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<AiDashboardStats>> getDashboardStats(Authentication authentication) {
        AiDashboardStats stats = aiAnalysisService.getDashboardStats(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("AI dashboard statistics retrieved", stats));
    }
}
