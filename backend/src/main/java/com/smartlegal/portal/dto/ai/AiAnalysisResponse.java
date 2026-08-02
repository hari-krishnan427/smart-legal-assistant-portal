package com.smartlegal.portal.dto.ai;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class AiAnalysisResponse {

    private Long id;
    private Long documentId;
    private String documentTitle;
    private String summary;
    private Integer riskScore; // 0-100
    private String riskLevel;  // LOW, MEDIUM, HIGH
    private List<Map<String, String>> keyClauses; // name, status, excerpt, analysis
    private List<String> missingClauses;
    private List<String> potentialRisks;
    private List<String> recommendations;
    private List<String> importantDates;
    private List<String> partiesInvolved;
    private Map<String, List<String>> partyObligations;
    private LocalDateTime createdAt;

    public AiAnalysisResponse() {
    }

    public AiAnalysisResponse(Long id, Long documentId, String documentTitle, String summary, Integer riskScore, String riskLevel, List<Map<String, String>> keyClauses, List<String> missingClauses, List<String> potentialRisks, List<String> recommendations, List<String> importantDates, List<String> partiesInvolved, Map<String, List<String>> partyObligations, LocalDateTime createdAt) {
        this.id = id;
        this.documentId = documentId;
        this.documentTitle = documentTitle;
        this.summary = summary;
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.keyClauses = keyClauses;
        this.missingClauses = missingClauses;
        this.potentialRisks = potentialRisks;
        this.recommendations = recommendations;
        this.importantDates = importantDates;
        this.partiesInvolved = partiesInvolved;
        this.partyObligations = partyObligations;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public String getDocumentTitle() {
        return documentTitle;
    }

    public void setDocumentTitle(String documentTitle) {
        this.documentTitle = documentTitle;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public List<Map<String, String>> getKeyClauses() {
        return keyClauses;
    }

    public void setKeyClauses(List<Map<String, String>> keyClauses) {
        this.keyClauses = keyClauses;
    }

    public List<String> getMissingClauses() {
        return missingClauses;
    }

    public void setMissingClauses(List<String> missingClauses) {
        this.missingClauses = missingClauses;
    }

    public List<String> getPotentialRisks() {
        return potentialRisks;
    }

    public void setPotentialRisks(List<String> potentialRisks) {
        this.potentialRisks = potentialRisks;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }

    public List<String> getImportantDates() {
        return importantDates;
    }

    public void setImportantDates(List<String> importantDates) {
        this.importantDates = importantDates;
    }

    public List<String> getPartiesInvolved() {
        return partiesInvolved;
    }

    public void setPartiesInvolved(List<String> partiesInvolved) {
        this.partiesInvolved = partiesInvolved;
    }

    public Map<String, List<String>> getPartyObligations() {
        return partyObligations;
    }

    public void setPartyObligations(Map<String, List<String>> partyObligations) {
        this.partyObligations = partyObligations;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
