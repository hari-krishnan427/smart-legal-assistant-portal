package com.smartlegal.portal.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;

public interface FileStorageService {

    String storeFile(MultipartFile file);

    Path getFilePath(String filename);

    Resource loadFileAsResource(String filename);

    void deleteFile(String filename);
}
