package com.smartlegal.portal.service;

import com.smartlegal.portal.dto.document.DocumentResponse;
import com.smartlegal.portal.entity.LegalDocument;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface LegalDocumentService {

    DocumentResponse uploadDocument(MultipartFile file, String category, String currentUserEmail);

    List<DocumentResponse> getDocuments(String currentUserEmail, String searchQuery);

    DocumentResponse getDocumentById(Long id, String currentUserEmail);

    Resource downloadDocument(Long id, String currentUserEmail);

    void deleteDocument(Long id, String currentUserEmail);
}
