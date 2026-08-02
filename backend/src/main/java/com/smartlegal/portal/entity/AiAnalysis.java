package com.smartlegal.portal.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_analyses")
public class AiAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false, unique = true)
    private LegalDocument document;

    @Column(name = "summary", columnDefinition = "LONGTEXT")
    private String summary;

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore; // 0 to 100

    @Column(name = "risk_level", nullable = false, length = 20)
    private String riskLevel; // LOW, MEDIUM, HIGH

    @Column(name = "key_clauses_json", columnDefinition = "LONGTEXT")
    private String keyClausesJson;

    @Column(name = "missing_clauses_json", columnDefinition = "LONGTEXT")
    private String missingClausesJson;

    @Column(name = "potential_risks_json", columnDefinition = "LONGTEXT")
    private String potentialRisksJson;

    @Column(name = "recommendations_json", columnDefinition = "LONGTEXT")
    private String recommendationsJson;

    @Column(name = "important_dates_json", columnDefinition = "LONGTEXT")
    private String importantDatesJson;

    @Column(name = "parties_json", columnDefinition = "LONGTEXT")
    private String partiesJson;

    @Column(name = "party_obligations_json", columnDefinition = "LONGTEXT")
    private String partyObligationsJson;

    @Column(name = "raw_ai_response", columnDefinition = "LONGTEXT")
    private String rawAiResponse;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public AiAnalysis() {
    }

    public AiAnalysis(Long id, LegalDocument document, String summary, Integer riskScore, String riskLevel, String keyClausesJson, String missingClausesJson, String potentialRisksJson, String recommendationsJson, String importantDatesJson, String partiesJson, String partyObligationsJson, String rawAiResponse, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.document = document;
        this.summary = summary;
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.keyClausesJson = keyClausesJson;
        this.missingClausesJson = missingClausesJson;
        this.potentialRisksJson = potentialRisksJson;
        this.recommendationsJson = recommendationsJson;
        this.importantDatesJson = importantDatesJson;
        this.partiesJson = partiesJson;
        this.partyObligationsJson = partyObligationsJson;
        this.rawAiResponse = rawAiResponse;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LegalDocument getDocument() {
        return document;
    }

    public void setDocument(LegalDocument document) {
        this.document = document;
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

    public String getKeyClausesJson() {
        return keyClausesJson;
    }

    public void setKeyClausesJson(String keyClausesJson) {
        this.keyClausesJson = keyClausesJson;
    }

    public String getMissingClausesJson() {
        return missingClausesJson;
    }

    public void setMissingClausesJson(String missingClausesJson) {
        this.missingClausesJson = missingClausesJson;
    }

    public String getPotentialRisksJson() {
        return potentialRisksJson;
    }

    public void setPotentialRisksJson(String potentialRisksJson) {
        this.potentialRisksJson = potentialRisksJson;
    }

    public String getRecommendationsJson() {
        return recommendationsJson;
    }

    public void setRecommendationsJson(String recommendationsJson) {
        this.recommendationsJson = recommendationsJson;
    }

    public String getImportantDatesJson() {
        return importantDatesJson;
    }

    public void setImportantDatesJson(String importantDatesJson) {
        this.importantDatesJson = importantDatesJson;
    }

    public String getPartiesJson() {
        return partiesJson;
    }

    public void setPartiesJson(String partiesJson) {
        this.partiesJson = partiesJson;
    }

    public String getPartyObligationsJson() {
        return partyObligationsJson;
    }

    public void setPartyObligationsJson(String partyObligationsJson) {
        this.partyObligationsJson = partyObligationsJson;
    }

    public String getRawAiResponse() {
        return rawAiResponse;
    }

    public void setRawAiResponse(String rawAiResponse) {
        this.rawAiResponse = rawAiResponse;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
