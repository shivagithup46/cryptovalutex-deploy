package com.cryptovaultx.service;

import com.cryptovaultx.entity.KycDetails;
import com.cryptovaultx.entity.KycStatus;
import com.cryptovaultx.entity.User;
import com.cryptovaultx.repository.KycDetailsRepository;
import com.cryptovaultx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class KycService {

    private final KycDetailsRepository kycDetailsRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;
    private final EmailService emailService;

    @Transactional
    public KycDetails getOrCreateKycDetails(String userId) {
        return kycDetailsRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId).orElseThrow();
            KycDetails newDetails = KycDetails.builder()
                    .user(user)
                    .overallStatus(KycStatus.PENDING)
                    .isLevel1Verified(user.isEmailVerified() && user.isPhoneVerified())
                    .build();
            return kycDetailsRepository.save(newDetails);
        });
    }

    @Transactional
    public KycDetails submitLevel2Kyc(String userId, String pan, String panUrl, String aadhaar, String aadhaarUrl, String selfieUrl) {
        KycDetails kyc = getOrCreateKycDetails(userId);
        
        kyc.setPanNumber(pan);
        kyc.setPanDocumentUrl(panUrl);
        kyc.setAadhaarNumber(aadhaar);
        kyc.setAadhaarDocumentUrl(aadhaarUrl);
        kyc.setSelfieUrl(selfieUrl);
        kyc.setOverallStatus(KycStatus.PENDING);
        
        KycDetails saved = kycDetailsRepository.save(kyc);
        
        auditService.logAction(userId, "KYC_L2_SUBMIT", "User submitted Level 2 KYC details", null, null, null);
        
        return saved;
    }

    @Transactional
    public KycDetails submitLevel3Kyc(String userId, String incomeProofUrl, String bankStatementUrl) {
        KycDetails kyc = getOrCreateKycDetails(userId);
        
        kyc.setIncomeProofUrl(incomeProofUrl);
        kyc.setBankStatementUrl(bankStatementUrl);
        kyc.setOverallStatus(KycStatus.PENDING);
        
        KycDetails saved = kycDetailsRepository.save(kyc);
        
        auditService.logAction(userId, "KYC_L3_SUBMIT", "User submitted Level 3 KYC details", null, null, null);
        
        return saved;
    }

    @Transactional
    public void approveKyc(String userId, int level, String remarks, String adminId) {
        KycDetails kyc = kycDetailsRepository.findByUserId(userId).orElseThrow();
        
        if (level == 2) {
            kyc.setLevel2Verified(true);
        } else if (level == 3) {
            kyc.setLevel3Verified(true);
        }
        
        kyc.setOverallStatus(KycStatus.APPROVED);
        kyc.setAdminRemarks(remarks);
        kycDetailsRepository.save(kyc);
        
        auditService.logAction(adminId, "KYC_APPROVE", "Approved KYC Level " + level + " for user " + userId, null, null, null);
        emailService.sendKycStatusUpdate(kyc.getUser().getEmail(), "APPROVED", remarks);
    }

    @Transactional
    public void rejectKyc(String userId, String remarks, String adminId) {
        KycDetails kyc = kycDetailsRepository.findByUserId(userId).orElseThrow();
        
        kyc.setOverallStatus(KycStatus.REJECTED);
        kyc.setAdminRemarks(remarks);
        kycDetailsRepository.save(kyc);
        
        auditService.logAction(adminId, "KYC_REJECT", "Rejected KYC for user " + userId, null, null, null);
        emailService.sendKycStatusUpdate(kyc.getUser().getEmail(), "REJECTED", remarks);
    }
}
