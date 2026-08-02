package com.smartlegal.portal.controller;

import com.smartlegal.portal.common.ApiResponse;
import com.smartlegal.portal.dto.legalcase.*;
import com.smartlegal.portal.entity.enums.CaseStatus;
import com.smartlegal.portal.service.LegalCaseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cases")
public class LegalCaseController {

    private final LegalCaseService caseService;

    public LegalCaseController(LegalCaseService caseService) {
        this.caseService = caseService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('LAWYER', 'ADMIN')")
    public ResponseEntity<ApiResponse<CaseResponse>> createCase(
            @Valid @RequestBody CreateCaseRequest request,
            Authentication authentication) {

        CaseResponse response = caseService.createCase(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Legal case created successfully", response));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<CaseResponse>>> getCases(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) CaseStatus status,
            Authentication authentication) {

        List<CaseResponse> cases = caseService.getCases(query, status, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Cases retrieved successfully", cases));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CaseResponse>> getCaseById(
            @PathVariable Long id,
            Authentication authentication) {

        CaseResponse response = caseService.getCaseById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Case details retrieved", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('LAWYER', 'ADMIN')")
    public ResponseEntity<ApiResponse<CaseResponse>> updateCase(
            @PathVariable Long id,
            @RequestBody UpdateCaseRequest request,
            Authentication authentication) {

        CaseResponse response = caseService.updateCase(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Case updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('LAWYER', 'ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteCase(
            @PathVariable Long id,
            Authentication authentication) {

        caseService.deleteCase(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Case deleted successfully", "Case ID: " + id));
    }

    @PostMapping("/{id}/notes")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CaseNoteResponse>> addCaseNote(
            @PathVariable Long id,
            @Valid @RequestBody CreateCaseNoteRequest request,
            Authentication authentication) {

        CaseNoteResponse response = caseService.addCaseNote(id, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Case note added successfully", response));
    }

    @GetMapping("/{id}/notes")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<CaseNoteResponse>>> getCaseNotes(
            @PathVariable Long id,
            Authentication authentication) {

        List<CaseNoteResponse> notes = caseService.getCaseNotes(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Case notes retrieved", notes));
    }

    @PostMapping("/{id}/link-document/{documentId}")
    @PreAuthorize("hasAnyRole('LAWYER', 'ADMIN')")
    public ResponseEntity<ApiResponse<CaseResponse>> linkDocumentToCase(
            @PathVariable Long id,
            @PathVariable Long documentId,
            Authentication authentication) {

        CaseResponse response = caseService.linkDocumentToCase(id, documentId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Document linked to case successfully", response));
    }
}
