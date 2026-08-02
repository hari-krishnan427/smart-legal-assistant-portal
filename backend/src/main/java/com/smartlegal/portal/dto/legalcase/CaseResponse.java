package com.smartlegal.portal.dto.legalcase;

import com.smartlegal.portal.dto.document.DocumentResponse;
import com.smartlegal.portal.entity.enums.CasePriority;
import com.smartlegal.portal.entity.enums.CaseStatus;
import com.smartlegal.portal.entity.enums.CaseType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class CaseResponse {

    private Long id;
    private String caseNumber;
    private String title;
    private CaseType caseType;
    private CaseStatus status;
    private CasePriority priority;
    private String courtName;
    private String judgeName;
    private String clientName;
    private String clientEmail;
    private String clientPhone;
    private String description;
    private String assignedLawyerName;
    private LocalDate filingDate;
    private LocalDate nextHearingDate;
    private List<DocumentResponse> documents;
    private List<CaseNoteResponse> notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CaseResponse() {
    }

    public CaseResponse(Long id, String caseNumber, String title, CaseType caseType, CaseStatus status, CasePriority priority, String courtName, String judgeName, String clientName, String clientEmail, String clientPhone, String description, String assignedLawyerName, LocalDate filingDate, LocalDate nextHearingDate, List<DocumentResponse> documents, List<CaseNoteResponse> notes, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.caseNumber = caseNumber;
        this.title = title;
        this.caseType = caseType;
        this.status = status;
        this.priority = priority;
        this.courtName = courtName;
        this.judgeName = judgeName;
        this.clientName = clientName;
        this.clientEmail = clientEmail;
        this.clientPhone = clientPhone;
        this.description = description;
        this.assignedLawyerName = assignedLawyerName;
        this.filingDate = filingDate;
        this.nextHearingDate = nextHearingDate;
        this.documents = documents;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCaseNumber() {
        return caseNumber;
    }

    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public CaseType getCaseType() {
        return caseType;
    }

    public void setCaseType(CaseType caseType) {
        this.caseType = caseType;
    }

    public CaseStatus getStatus() {
        return status;
    }

    public void setStatus(CaseStatus status) {
        this.status = status;
    }

    public CasePriority getPriority() {
        return priority;
    }

    public void setPriority(CasePriority priority) {
        this.priority = priority;
    }

    public String getCourtName() {
        return courtName;
    }

    public void setCourtName(String courtName) {
        this.courtName = courtName;
    }

    public String getJudgeName() {
        return judgeName;
    }

    public void setJudgeName(String judgeName) {
        this.judgeName = judgeName;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getClientEmail() {
        return clientEmail;
    }

    public void setClientEmail(String clientEmail) {
        this.clientEmail = clientEmail;
    }

    public String getClientPhone() {
        return clientPhone;
    }

    public void setClientPhone(String clientPhone) {
        this.clientPhone = clientPhone;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAssignedLawyerName() {
        return assignedLawyerName;
    }

    public void setAssignedLawyerName(String assignedLawyerName) {
        this.assignedLawyerName = assignedLawyerName;
    }

    public LocalDate getFilingDate() {
        return filingDate;
    }

    public void setFilingDate(LocalDate filingDate) {
        this.filingDate = filingDate;
    }

    public LocalDate getNextHearingDate() {
        return nextHearingDate;
    }

    public void setNextHearingDate(LocalDate nextHearingDate) {
        this.nextHearingDate = nextHearingDate;
    }

    public List<DocumentResponse> getDocuments() {
        return documents;
    }

    public void setDocuments(List<DocumentResponse> documents) {
        this.documents = documents;
    }

    public List<CaseNoteResponse> getNotes() {
        return notes;
    }

    public void setNotes(List<CaseNoteResponse> notes) {
        this.notes = notes;
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
