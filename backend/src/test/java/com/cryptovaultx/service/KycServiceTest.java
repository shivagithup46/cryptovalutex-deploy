package com.cryptovaultx.service;

import com.cryptovaultx.entity.KycDetails;
import com.cryptovaultx.entity.KycStatus;
import com.cryptovaultx.entity.User;
import com.cryptovaultx.repository.KycDetailsRepository;
import com.cryptovaultx.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class KycServiceTest {

    @Mock
    private KycDetailsRepository kycDetailsRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuditService auditService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private KycService kycService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void submitLevel2Kyc_Success() {
        String userId = "user123";
        User user = new User();
        user.setId(userId);
        
        KycDetails kyc = new KycDetails();
        kyc.setUser(user);
        kyc.setOverallStatus(KycStatus.PENDING);
        
        when(kycDetailsRepository.findByUserId(userId)).thenReturn(Optional.of(kyc));
        when(kycDetailsRepository.save(any(KycDetails.class))).thenReturn(kyc);
        
        KycDetails result = kycService.submitLevel2Kyc(userId, "ABCDE1234F", "url1", "123456789012", "url2", "url3");
        
        assertEquals("ABCDE1234F", result.getPanNumber());
        assertEquals("123456789012", result.getAadhaarNumber());
        assertEquals(KycStatus.PENDING, result.getOverallStatus());
        
        verify(auditService, times(1)).logAction(any(), any(), any(), any(), any(), any());
    }
}
