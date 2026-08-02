package com.smartlegal.portal.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartlegal.portal.dto.ai.*;
import com.smartlegal.portal.entity.AiAnalysis;
import com.smartlegal.portal.entity.LegalDocument;
import com.smartlegal.portal.entity.Role;
import com.smartlegal.portal.entity.User;
import com.smartlegal.portal.exception.AiAnalysisException;
import com.smartlegal.portal.repository.AiAnalysisRepository;
import com.smartlegal.portal.repository.LegalDocumentRepository;
import com.smartlegal.portal.repository.UserRepository;
import com.smartlegal.portal.service.AiAnalysisService;
import com.smartlegal.portal.service.GeminiApiClient;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiAnalysisServiceImpl implements AiAnalysisService {

    private final AiAnalysisRepository aiAnalysisRepository;
    private final LegalDocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final GeminiApiClient geminiApiClient;
    private final ObjectMapper objectMapper;

    public AiAnalysisServiceImpl(AiAnalysisRepository aiAnalysisRepository,
                                 LegalDocumentRepository documentRepository,
                                 UserRepository userRepository,
                                 GeminiApiClient geminiApiClient) {
        this.aiAnalysisRepository = aiAnalysisRepository;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.geminiApiClient = geminiApiClient;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    @Transactional
    public AiAnalysisResponse analyzeDocument(Long documentId, String userEmail) {
        LegalDocument document = getDocumentWithSecurityCheck(documentId, userEmail);

        // Check if analysis record already exists for this document ID
        AiAnalysis analysis = aiAnalysisRepository.findByDocumentId(documentId)
                .orElseGet(() -> {
                    AiAnalysis newAnalysis = new AiAnalysis();
                    newAnalysis.setDocument(document);
                    return newAnalysis;
                });

        String extractedText = document.getExtractedText();
        if (extractedText == null || extractedText.trim().isEmpty()) {
            extractedText = "No text extracted. Document filename: " + document.getOriginalFilename();
        }

        try {
            // Call Gemini API / Heuristic Analyzer
            Map<String, Object> aiResult = geminiApiClient.analyzeLegalDocument(
                    document.getOriginalFilename(),
                    document.getFileCategory(),
                    extractedText
            );

            analysis.setSummary((String) aiResult.getOrDefault("summary", "Analysis completed for " + document.getOriginalFilename()));
            analysis.setRiskScore(((Number) aiResult.getOrDefault("riskScore", 50)).intValue());
            analysis.setRiskLevel((String) aiResult.getOrDefault("riskLevel", "MEDIUM"));

            analysis.setKeyClausesJson(objectMapper.writeValueAsString(aiResult.getOrDefault("keyClauses", List.of())));
            analysis.setMissingClausesJson(objectMapper.writeValueAsString(aiResult.getOrDefault("missingClauses", List.of())));
            analysis.setPotentialRisksJson(objectMapper.writeValueAsString(aiResult.getOrDefault("potentialRisks", List.of())));
            analysis.setRecommendationsJson(objectMapper.writeValueAsString(aiResult.getOrDefault("recommendations", List.of())));
            analysis.setImportantDatesJson(objectMapper.writeValueAsString(aiResult.getOrDefault("importantDates", List.of())));
            analysis.setPartiesJson(objectMapper.writeValueAsString(aiResult.getOrDefault("partiesInvolved", List.of())));
            analysis.setPartyObligationsJson(objectMapper.writeValueAsString(aiResult.getOrDefault("partyObligations", Map.of())));
            analysis.setRawAiResponse(objectMapper.writeValueAsString(aiResult));

            AiAnalysis savedAnalysis = aiAnalysisRepository.save(analysis);

            return mapToAiAnalysisResponse(savedAnalysis);
        } catch (Exception ex) {
            throw new AiAnalysisException("Failed to analyze document with AI: " + ex.getMessage(), ex);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public AiAnalysisResponse getAnalysisResult(Long documentId, String userEmail) {
        LegalDocument document = getDocumentWithSecurityCheck(documentId, userEmail);

        AiAnalysis analysis = aiAnalysisRepository.findByDocumentId(documentId)
                .orElseThrow(() -> new IllegalArgumentException("No AI analysis found for document id: " + documentId + ". Please trigger analysis first."));

        return mapToAiAnalysisResponse(analysis);
    }

    @Override
    @Transactional(readOnly = true)
    public ChatResponse chatWithDocument(Long documentId, ChatRequest request, String userEmail) {
        LegalDocument document = getDocumentWithSecurityCheck(documentId, userEmail);

        String text = document.getExtractedText() != null ? document.getExtractedText() : "";
        String answer = geminiApiClient.generateChatAnswer(document.getOriginalFilename(), text, request.getQuestion());

        return new ChatResponse(request.getQuestion(), answer);
    }

    @Override
    @Transactional(readOnly = true)
    public AiDashboardStats getDashboardStats(String userEmail) {
        User currentUser = getUser(userEmail);
        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;

        long totalDocuments = isAdmin ? documentRepository.count() : documentRepository.findByUserOrderByCreatedAtDesc(currentUser).size();
        long documentsAnalyzed = isAdmin ? aiAnalysisRepository.count() : aiAnalysisRepository.countByDocument_User(currentUser);

        Double avgScoreObj = isAdmin ? aiAnalysisRepository.findGlobalAverageRiskScore() : aiAnalysisRepository.findAverageRiskScoreByUser(currentUser);
        double averageRiskScore = avgScoreObj != null ? Math.round(avgScoreObj * 10.0) / 10.0 : 0.0;

        long highRiskCount = isAdmin ? aiAnalysisRepository.findAll().stream().filter(a -> "HIGH".equals(a.getRiskLevel())).count() : aiAnalysisRepository.countByDocument_UserAndRiskLevel(currentUser, "HIGH");
        long mediumRiskCount = isAdmin ? aiAnalysisRepository.findAll().stream().filter(a -> "MEDIUM".equals(a.getRiskLevel())).count() : aiAnalysisRepository.countByDocument_UserAndRiskLevel(currentUser, "MEDIUM");
        long lowRiskCount = isAdmin ? aiAnalysisRepository.findAll().stream().filter(a -> "LOW".equals(a.getRiskLevel())).count() : aiAnalysisRepository.countByDocument_UserAndRiskLevel(currentUser, "LOW");

        List<AiAnalysis> recentEntities = isAdmin ?
                aiAnalysisRepository.findTop5ByOrderByCreatedAtDesc() :
                aiAnalysisRepository.findTop5ByDocument_UserOrderByCreatedAtDesc(currentUser);

        List<AiAnalysisResponse> recentAnalyses = recentEntities.stream()
                .map(this::mapToAiAnalysisResponse)
                .collect(Collectors.toList());

        return new AiDashboardStats(
                totalDocuments,
                documentsAnalyzed,
                averageRiskScore,
                highRiskCount,
                mediumRiskCount,
                lowRiskCount,
                recentAnalyses
        );
    }

    private LegalDocument getDocumentWithSecurityCheck(Long documentId, String currentUserEmail) {
        User currentUser = getUser(currentUserEmail);
        LegalDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found with id: " + documentId));

        boolean isOwner = document.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("Access Denied: You do not own this document.");
        }

        return document;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
    }

    private AiAnalysisResponse mapToAiAnalysisResponse(AiAnalysis entity) {
        List<Map<String, String>> keyClauses = parseJsonListMap(entity.getKeyClausesJson());
        List<String> missingClauses = parseJsonList(entity.getMissingClausesJson());
        List<String> potentialRisks = parseJsonList(entity.getPotentialRisksJson());
        List<String> recommendations = parseJsonList(entity.getRecommendationsJson());
        List<String> importantDates = parseJsonList(entity.getImportantDatesJson());
        List<String> partiesInvolved = parseJsonList(entity.getPartiesJson());
        Map<String, List<String>> partyObligations = parseJsonMapList(entity.getPartyObligationsJson());

        return new AiAnalysisResponse(
                entity.getId(),
                entity.getDocument().getId(),
                entity.getDocument().getOriginalFilename(),
                entity.getSummary(),
                entity.getRiskScore(),
                entity.getRiskLevel(),
                keyClauses,
                missingClauses,
                potentialRisks,
                recommendations,
                importantDates,
                partiesInvolved,
                partyObligations,
                entity.getCreatedAt()
        );
    }

    private List<String> parseJsonList(String json) {
        if (json == null || json.trim().isEmpty()) return List.of();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception ex) {
            return List.of();
        }
    }

    private List<Map<String, String>> parseJsonListMap(String json) {
        if (json == null || json.trim().isEmpty()) return List.of();
        try {
            return objectMapper.readValue(json, new TypeReference<List<Map<String, String>>>() {});
        } catch (Exception ex) {
            return List.of();
        }
    }

    private Map<String, List<String>> parseJsonMapList(String json) {
        if (json == null || json.trim().isEmpty()) return Map.of();
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, List<String>>>() {});
        } catch (Exception ex) {
            return Map.of();
        }
    }
}
