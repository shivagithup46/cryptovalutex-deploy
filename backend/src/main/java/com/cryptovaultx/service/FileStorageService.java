package com.cryptovaultx.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String storeFile(MultipartFile file, String userId, String documentType);
    void deleteFile(String fileUrl);
}
