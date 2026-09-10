package com.cryptovaultx.service;

import com.cryptovaultx.entity.AuditLog;
import com.cryptovaultx.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Async
    @Transactional
    public void logAction(String userId, String action, String details, String ipAddress, String device, String browser) {
        AuditLog log = AuditLog.builder()
                .userId(userId)
                .action(action)
                .details(details)
                .ipAddress(ipAddress)
                .device(device)
                .browser(browser)
                .build();
        auditLogRepository.save(log);
    }
}
