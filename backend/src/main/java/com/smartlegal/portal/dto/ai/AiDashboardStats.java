package com.smartlegal.portal.dto.ai;

import java.util.List;

public class AiDashboardStats {

    private long totalDocuments;
    private long documentsAnalyzed;
    private double averageRiskScore;
    private long highRiskCount;
    private long mediumRiskCount;
    private long lowRiskCount;
    private List<AiAnalysisResponse> recentAnalyses;

    public AiDashboardStats() {
    }

    public AiDashboardStats(long totalDocuments, long documentsAnalyzed, double averageRiskScore, long highRiskCount, long mediumRiskCount, long lowRiskCount, List<AiAnalysisResponse> recentAnalyses) {
        this.totalDocuments = totalDocuments;
        this.documentsAnalyzed = documentsAnalyzed;
        this.averageRiskScore = averageRiskScore;
        this.highRiskCount = highRiskCount;
        this.mediumRiskCount = mediumRiskCount;
        this.lowRiskCount = lowRiskCount;
        this.recentAnalyses = recentAnalyses;
    }

    public long getTotalDocuments() {
        return totalDocuments;
    }

    public void setTotalDocuments(long totalDocuments) {
        this.totalDocuments = totalDocuments;
    }

    public long getDocumentsAnalyzed() {
        return documentsAnalyzed;
    }

    public void setDocumentsAnalyzed(long documentsAnalyzed) {
        this.documentsAnalyzed = documentsAnalyzed;
    }

    public double getAverageRiskScore() {
        return averageRiskScore;
    }

    public void setAverageRiskScore(double averageRiskScore) {
        this.averageRiskScore = averageRiskScore;
    }

    public long getHighRiskCount() {
        return highRiskCount;
    }

    public void setHighRiskCount(long highRiskCount) {
        this.highRiskCount = highRiskCount;
    }

    public long getMediumRiskCount() {
        return mediumRiskCount;
    }

    public void setMediumRiskCount(long mediumRiskCount) {
        this.mediumRiskCount = mediumRiskCount;
    }

    public long getLowRiskCount() {
        return lowRiskCount;
    }

    public void setLowRiskCount(long lowRiskCount) {
        this.lowRiskCount = lowRiskCount;
    }

    public List<AiAnalysisResponse> getRecentAnalyses() {
        return recentAnalyses;
    }

    public void setRecentAnalyses(List<AiAnalysisResponse> recentAnalyses) {
        this.recentAnalyses = recentAnalyses;
    }
}
