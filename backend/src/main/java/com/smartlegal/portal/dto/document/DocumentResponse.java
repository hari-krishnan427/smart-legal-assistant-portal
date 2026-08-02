package com.smartlegal.portal.dto.document;

import java.time.LocalDateTime;

public class DocumentResponse {

    private Long id;
    private String filename;
    private String originalFilename;
    private String contentType;
    private Long fileSize;
    private String fileCategory;
    private String extractedText;
    private String extractedTextSnippet;
    private Long userId;
    private String userFullName;
    private LocalDateTime createdAt;

    public DocumentResponse() {
    }

    public DocumentResponse(Long id, String filename, String originalFilename, String contentType, Long fileSize, String fileCategory, String extractedText, String extractedTextSnippet, Long userId, String userFullName, LocalDateTime createdAt) {
        this.id = id;
        this.filename = filename;
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.fileCategory = fileCategory;
        this.extractedText = extractedText;
        this.extractedTextSnippet = extractedTextSnippet;
        this.userId = userId;
        this.userFullName = userFullName;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getFileCategory() {
        return fileCategory;
    }

    public void setFileCategory(String fileCategory) {
        this.fileCategory = fileCategory;
    }

    public String getExtractedText() {
        return extractedText;
    }

    public void setExtractedText(String extractedText) {
        this.extractedText = extractedText;
    }

    public String getExtractedTextSnippet() {
        return extractedTextSnippet;
    }

    public void setExtractedTextSnippet(String extractedTextSnippet) {
        this.extractedTextSnippet = extractedTextSnippet;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserFullName() {
        return userFullName;
    }

    public void setUserFullName(String userFullName) {
        this.userFullName = userFullName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
