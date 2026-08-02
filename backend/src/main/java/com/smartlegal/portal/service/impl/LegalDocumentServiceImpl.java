package com.smartlegal.portal.service.impl;

import com.smartlegal.portal.dto.document.DocumentResponse;
import com.smartlegal.portal.entity.LegalDocument;
import com.smartlegal.portal.entity.Role;
import com.smartlegal.portal.entity.User;
import com.smartlegal.portal.repository.LegalDocumentRepository;
import com.smartlegal.portal.repository.UserRepository;
import com.smartlegal.portal.service.FileStorageService;
import com.smartlegal.portal.service.LegalDocumentService;
import com.smartlegal.portal.service.TextExtractionService;
import org.springframework.core.io.Resource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class LegalDocumentServiceImpl implements LegalDocumentService {

    private final LegalDocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final TextExtractionService textExtractionService;

    public LegalDocumentServiceImpl(LegalDocumentRepository documentRepository,
                                    UserRepository userRepository,
                                    FileStorageService fileStorageService,
                                    TextExtractionService textExtractionService) {
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.textExtractionService = textExtractionService;
    }

    @Override
    @Transactional
    public DocumentResponse uploadDocument(MultipartFile file, String category, String currentUserEmail) {
        User user = getUser(currentUserEmail);

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file.");
        }

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String storedFilename = fileStorageService.storeFile(file);
        Path targetPath = fileStorageService.getFilePath(storedFilename);

        String extractedText = textExtractionService.extractText(file);

        LegalDocument document = new LegalDocument();
        document.setFilename(storedFilename);
        document.setOriginalFilename(originalFilename);
        document.setContentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream");
        document.setFileSize(file.getSize());
        document.setFilePath(targetPath.toString());
        document.setExtractedText(extractedText);
        document.setFileCategory(category != null && !category.trim().isEmpty() ? category : "General Legal Document");
        document.setUser(user);

        LegalDocument savedDocument = documentRepository.save(document);

        return mapToDocumentResponse(savedDocument);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> getDocuments(String currentUserEmail, String searchQuery) {
        User currentUser = getUser(currentUserEmail);
        List<LegalDocument> documents;

        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;

        if (StringUtils.hasText(searchQuery)) {
            documents = isAdmin ?
                    documentRepository.searchAllDocuments(searchQuery.trim()) :
                    documentRepository.searchUserDocuments(currentUser, searchQuery.trim());
        } else {
            documents = isAdmin ?
                    documentRepository.findAllByOrderByCreatedAtDesc() :
                    documentRepository.findByUserOrderByCreatedAtDesc(currentUser);
        }

        return documents.stream().map(this::mapToDocumentResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentResponse getDocumentById(Long id, String currentUserEmail) {
        LegalDocument document = getDocumentWithSecurityCheck(id, currentUserEmail);
        return mapToDocumentResponse(document);
    }

    @Override
    @Transactional(readOnly = true)
    public Resource downloadDocument(Long id, String currentUserEmail) {
        LegalDocument document = getDocumentWithSecurityCheck(id, currentUserEmail);
        return fileStorageService.loadFileAsResource(document.getFilename());
    }

    @Override
    @Transactional
    public void deleteDocument(Long id, String currentUserEmail) {
        LegalDocument document = getDocumentWithSecurityCheck(id, currentUserEmail);
        fileStorageService.deleteFile(document.getFilename());
        documentRepository.delete(document);
    }

    private LegalDocument getDocumentWithSecurityCheck(Long id, String currentUserEmail) {
        User currentUser = getUser(currentUserEmail);
        LegalDocument document = documentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Document not found with id: " + id));

        boolean isOwner = document.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("Access Denied: You do not own this document.");
        }

        return document;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
    }

    private DocumentResponse mapToDocumentResponse(LegalDocument doc) {
        String fullText = doc.getExtractedText() != null ? doc.getExtractedText() : "";
        String snippet = fullText.length() > 250 ? fullText.substring(0, 250) + "..." : fullText;

        return new DocumentResponse(
                doc.getId(),
                doc.getFilename(),
                doc.getOriginalFilename(),
                doc.getContentType(),
                doc.getFileSize(),
                doc.getFileCategory(),
                fullText,
                snippet,
                doc.getUser().getId(),
                doc.getUser().getFullName(),
                doc.getCreatedAt()
        );
    }
}
