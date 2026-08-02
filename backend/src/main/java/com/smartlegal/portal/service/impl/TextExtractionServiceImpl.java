package com.smartlegal.portal.service.impl;

import com.smartlegal.portal.service.TextExtractionService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

@Service
public class TextExtractionServiceImpl implements TextExtractionService {

    @Override
    public String extractText(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return "";
        }

        String originalFilename = Objects.requireNonNull(file.getOriginalFilename()).toLowerCase();
        String contentType = file.getContentType() != null ? file.getContentType().toLowerCase() : "";

        try {
            if (originalFilename.endsWith(".pdf") || contentType.contains("pdf")) {
                return extractTextFromPdf(file);
            } else if (originalFilename.endsWith(".docx") || contentType.contains("wordprocessingml")) {
                return extractTextFromDocx(file);
            } else if (originalFilename.endsWith(".txt") || contentType.contains("text/plain")) {
                return new String(file.getBytes(), StandardCharsets.UTF_8);
            } else {
                return "Unsupported file format for text extraction. Metadata stored.";
            }
        } catch (Exception ex) {
            return "Failed to extract text content: " + ex.getMessage();
        }
    }

    private String extractTextFromPdf(MultipartFile file) throws Exception {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper pdfStripper = new PDFTextStripper();
            return pdfStripper.getText(document).trim();
        }
    }

    private String extractTextFromDocx(MultipartFile file) throws Exception {
        try (InputStream is = file.getInputStream();
             XWPFDocument docx = new XWPFDocument(is);
             XWPFWordExtractor extractor = new XWPFWordExtractor(docx)) {
            return extractor.getText().trim();
        }
    }
}
