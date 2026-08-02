package com.smartlegal.portal.dto.legalcase;

import java.time.LocalDateTime;

public class CaseNoteResponse {

    private Long id;
    private Long caseId;
    private String authorName;
    private String authorRole;
    private String content;
    private LocalDateTime createdAt;

    public CaseNoteResponse() {
    }

    public CaseNoteResponse(Long id, Long caseId, String authorName, String authorRole, String content, LocalDateTime createdAt) {
        this.id = id;
        this.caseId = caseId;
        this.authorName = authorName;
        this.authorRole = authorRole;
        this.content = content;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCaseId() {
        return caseId;
    }

    public void setCaseId(Long caseId) {
        this.caseId = caseId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getAuthorRole() {
        return authorRole;
    }

    public void setAuthorRole(String authorRole) {
        this.authorRole = authorRole;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
