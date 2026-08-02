package com.smartlegal.portal.controller;

import com.smartlegal.portal.common.ApiResponse;
import com.smartlegal.portal.dto.document.DocumentResponse;
import com.smartlegal.portal.service.LegalDocumentService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
public class LegalDocumentController {

    private final LegalDocumentService documentService;

    public LegalDocumentController(LegalDocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/upload")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<DocumentResponse>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", required = false, defaultValue = "General Legal Document") String category,
            Authentication authentication) {

        DocumentResponse response = documentService.uploadDocument(file, category, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Legal document uploaded and processed successfully", response));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<DocumentResponse>>> getDocuments(
            @RequestParam(value = "q", required = false) String searchQuery,
            Authentication authentication) {

        List<DocumentResponse> documents = documentService.getDocuments(authentication.getName(), searchQuery);
        return ResponseEntity.ok(ApiResponse.success("Document library retrieved", documents));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<DocumentResponse>> getDocumentById(
            @PathVariable Long id,
            Authentication authentication) {

        DocumentResponse response = documentService.getDocumentById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Document details retrieved", response));
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable Long id,
            Authentication authentication) {

        DocumentResponse docDetails = documentService.getDocumentById(id, authentication.getName());
        Resource resource = documentService.downloadDocument(id, authentication.getName());

        String contentType = docDetails.getContentType() != null ? docDetails.getContentType() : MediaType.APPLICATION_OCTET_STREAM_VALUE;

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + docDetails.getOriginalFilename() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(
            @PathVariable Long id,
            Authentication authentication) {

        documentService.deleteDocument(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Document deleted successfully"));
    }
}
