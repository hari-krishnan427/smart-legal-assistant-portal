package com.smartlegal.portal.service;

import org.springframework.web.multipart.MultipartFile;

public interface TextExtractionService {

    String extractText(MultipartFile file);
}
