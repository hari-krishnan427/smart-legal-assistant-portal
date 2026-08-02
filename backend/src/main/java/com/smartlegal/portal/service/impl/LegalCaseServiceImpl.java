package com.smartlegal.portal.service.impl;

import com.smartlegal.portal.dto.legalcase.*;
import com.smartlegal.portal.dto.document.DocumentResponse;
import com.smartlegal.portal.entity.*;
import com.smartlegal.portal.entity.enums.CaseStatus;
import com.smartlegal.portal.repository.*;
import com.smartlegal.portal.service.LegalCaseService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class LegalCaseServiceImpl implements LegalCaseService {

    private final LegalCaseRepository caseRepository;
    private final CaseNoteRepository caseNoteRepository;
    private final LegalDocumentRepository documentRepository;
    private final UserRepository userRepository;

    public LegalCaseServiceImpl(LegalCaseRepository caseRepository,
                                CaseNoteRepository caseNoteRepository,
                                LegalDocumentRepository documentRepository,
                                UserRepository userRepository) {
        this.caseRepository = caseRepository;
        this.caseNoteRepository = caseNoteRepository;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public CaseResponse createCase(CreateCaseRequest request, String currentUserEmail) {
        User currentUser = getUser(currentUserEmail);

        LegalCase legalCase = new LegalCase();
        legalCase.setCaseNumber(generateCaseNumber());
        legalCase.setTitle(request.getTitle());
        legalCase.setCaseType(request.getCaseType());
        legalCase.setStatus(request.getStatus());
        legalCase.setPriority(request.getPriority());
        legalCase.setCourtName(request.getCourtName());
        legalCase.setJudgeName(request.getJudgeName());
        legalCase.setClientName(request.getClientName());
        legalCase.setClientEmail(request.getClientEmail());
        legalCase.setClientPhone(request.getClientPhone());
        legalCase.setDescription(request.getDescription());
        legalCase.setFilingDate(request.getFilingDate());
        legalCase.setNextHearingDate(request.getNextHearingDate());
        legalCase.setAssignedLawyer(currentUser);

        if (request.getClientEmail() != null && !request.getClientEmail().trim().isEmpty()) {
            userRepository.findByEmail(request.getClientEmail()).ifPresent(legalCase::setClientUser);
        }

        LegalCase savedCase = caseRepository.save(legalCase);
        return mapToCaseResponse(savedCase);
    }

    @Override
    @Transactional
    public CaseResponse updateCase(Long id, UpdateCaseRequest request, String currentUserEmail) {
        LegalCase legalCase = getCaseWithSecurityCheck(id, currentUserEmail, true);

        if (request.getTitle() != null) legalCase.setTitle(request.getTitle());
        if (request.getCaseType() != null) legalCase.setCaseType(request.getCaseType());
        if (request.getStatus() != null) legalCase.setStatus(request.getStatus());
        if (request.getPriority() != null) legalCase.setPriority(request.getPriority());
        if (request.getCourtName() != null) legalCase.setCourtName(request.getCourtName());
        if (request.getJudgeName() != null) legalCase.setJudgeName(request.getJudgeName());
        if (request.getClientName() != null) legalCase.setClientName(request.getClientName());
        if (request.getClientEmail() != null) legalCase.setClientEmail(request.getClientEmail());
        if (request.getClientPhone() != null) legalCase.setClientPhone(request.getClientPhone());
        if (request.getDescription() != null) legalCase.setDescription(request.getDescription());
        if (request.getFilingDate() != null) legalCase.setFilingDate(request.getFilingDate());
        if (request.getNextHearingDate() != null) legalCase.setNextHearingDate(request.getNextHearingDate());

        LegalCase updatedCase = caseRepository.save(legalCase);
        return mapToCaseResponse(updatedCase);
    }

    @Override
    @Transactional(readOnly = true)
    public CaseResponse getCaseById(Long id, String currentUserEmail) {
        LegalCase legalCase = getCaseWithSecurityCheck(id, currentUserEmail, false);
        return mapToCaseResponse(legalCase);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CaseResponse> getCases(String searchQuery, CaseStatus statusFilter, String currentUserEmail) {
        User currentUser = getUser(currentUserEmail);
        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;

        List<LegalCase> cases;
        if (isAdmin) {
            cases = caseRepository.searchAllCases(statusFilter, searchQuery);
        } else {
            cases = caseRepository.searchLawyerCases(currentUser, statusFilter, searchQuery);
        }

        return cases.stream().map(this::mapToCaseResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteCase(Long id, String currentUserEmail) {
        LegalCase legalCase = getCaseWithSecurityCheck(id, currentUserEmail, true);
        caseRepository.delete(legalCase);
    }

    @Override
    @Transactional
    public CaseNoteResponse addCaseNote(Long caseId, CreateCaseNoteRequest request, String currentUserEmail) {
        LegalCase legalCase = getCaseWithSecurityCheck(caseId, currentUserEmail, false);
        User author = getUser(currentUserEmail);

        CaseNote note = new CaseNote();
        note.setLegalCase(legalCase);
        note.setAuthor(author);
        note.setContent(request.getContent());

        CaseNote savedNote = caseNoteRepository.save(note);
        return mapToCaseNoteResponse(savedNote);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CaseNoteResponse> getCaseNotes(Long caseId, String currentUserEmail) {
        LegalCase legalCase = getCaseWithSecurityCheck(caseId, currentUserEmail, false);
        return caseNoteRepository.findByLegalCaseOrderByCreatedAtDesc(legalCase)
                .stream()
                .map(this::mapToCaseNoteResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CaseResponse linkDocumentToCase(Long caseId, Long documentId, String currentUserEmail) {
        LegalCase legalCase = getCaseWithSecurityCheck(caseId, currentUserEmail, true);
        LegalDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found with id: " + documentId));

        document.setLegalCase(legalCase);
        documentRepository.save(document);

        return mapToCaseResponse(caseRepository.findById(caseId).get());
    }

    private synchronized String generateCaseNumber() {
        long count = caseRepository.count() + 1;
        return String.format("LGL-2026-%04d", count);
    }

    private LegalCase getCaseWithSecurityCheck(Long caseId, String currentUserEmail, boolean requireModifyRights) {
        User currentUser = getUser(currentUserEmail);
        LegalCase legalCase = caseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Case not found with id: " + caseId));

        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;
        boolean isAssignedLawyer = legalCase.getAssignedLawyer() != null && legalCase.getAssignedLawyer().getId().equals(currentUser.getId());
        boolean isClient = legalCase.getClientUser() != null && legalCase.getClientUser().getId().equals(currentUser.getId());

        if (requireModifyRights) {
            if (!isAdmin && !isAssignedLawyer) {
                throw new AccessDeniedException("Access Denied: Only the assigned lawyer or admin can modify this case.");
            }
        } else {
            if (!isAdmin && !isAssignedLawyer && !isClient) {
                throw new AccessDeniedException("Access Denied: You do not have permission to view this case.");
            }
        }

        return legalCase;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
    }

    private CaseResponse mapToCaseResponse(LegalCase legalCase) {
        List<DocumentResponse> docs = legalCase.getDocuments() != null ?
                legalCase.getDocuments().stream().map(this::mapToDocumentResponse).collect(Collectors.toList()) : List.of();

        List<CaseNoteResponse> notes = legalCase.getNotes() != null ?
                legalCase.getNotes().stream().map(this::mapToCaseNoteResponse).collect(Collectors.toList()) : List.of();

        String lawyerName = legalCase.getAssignedLawyer() != null ? legalCase.getAssignedLawyer().getFullName() : "Unassigned";

        return new CaseResponse(
                legalCase.getId(),
                legalCase.getCaseNumber(),
                legalCase.getTitle(),
                legalCase.getCaseType(),
                legalCase.getStatus(),
                legalCase.getPriority(),
                legalCase.getCourtName(),
                legalCase.getJudgeName(),
                legalCase.getClientName(),
                legalCase.getClientEmail(),
                legalCase.getClientPhone(),
                legalCase.getDescription(),
                lawyerName,
                legalCase.getFilingDate(),
                legalCase.getNextHearingDate(),
                docs,
                notes,
                legalCase.getCreatedAt(),
                legalCase.getUpdatedAt()
        );
    }

    private CaseNoteResponse mapToCaseNoteResponse(CaseNote note) {
        return new CaseNoteResponse(
                note.getId(),
                note.getLegalCase().getId(),
                note.getAuthor().getFullName(),
                note.getAuthor().getRole().name(),
                note.getContent(),
                note.getCreatedAt()
        );
    }

    private DocumentResponse mapToDocumentResponse(LegalDocument doc) {
        String snippet = doc.getExtractedText() != null && doc.getExtractedText().length() > 200 ?
                doc.getExtractedText().substring(0, 200) + "..." : doc.getExtractedText();

        return new DocumentResponse(
                doc.getId(),
                doc.getFilename(),
                doc.getOriginalFilename(),
                doc.getContentType(),
                doc.getFileSize(),
                doc.getFileCategory(),
                doc.getExtractedText(),
                snippet,
                doc.getUser().getId(),
                doc.getUser().getFullName(),
                doc.getCreatedAt()
        );
    }
}
