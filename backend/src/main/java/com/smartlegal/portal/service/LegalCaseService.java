package com.smartlegal.portal.service;

import com.smartlegal.portal.dto.legalcase.*;
import com.smartlegal.portal.entity.enums.CaseStatus;

import java.util.List;

public interface LegalCaseService {

    CaseResponse createCase(CreateCaseRequest request, String currentUserEmail);

    CaseResponse updateCase(Long id, UpdateCaseRequest request, String currentUserEmail);

    CaseResponse getCaseById(Long id, String currentUserEmail);

    List<CaseResponse> getCases(String searchQuery, CaseStatus statusFilter, String currentUserEmail);

    void deleteCase(Long id, String currentUserEmail);

    CaseNoteResponse addCaseNote(Long caseId, CreateCaseNoteRequest request, String currentUserEmail);

    List<CaseNoteResponse> getCaseNotes(Long caseId, String currentUserEmail);

    CaseResponse linkDocumentToCase(Long caseId, Long documentId, String currentUserEmail);
}
