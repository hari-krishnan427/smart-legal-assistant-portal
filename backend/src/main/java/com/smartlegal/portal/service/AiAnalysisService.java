package com.smartlegal.portal.service;

import com.smartlegal.portal.dto.ai.AiAnalysisResponse;
import com.smartlegal.portal.dto.ai.AiDashboardStats;
import com.smartlegal.portal.dto.ai.ChatRequest;
import com.smartlegal.portal.dto.ai.ChatResponse;

public interface AiAnalysisService {

    AiAnalysisResponse analyzeDocument(Long documentId, String userEmail);

    AiAnalysisResponse getAnalysisResult(Long documentId, String userEmail);

    ChatResponse chatWithDocument(Long documentId, ChatRequest request, String userEmail);

    AiDashboardStats getDashboardStats(String userEmail);
}
