package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "kyc_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KycDetails extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Level 1
    @Column(nullable = false)
    private boolean isLevel1Verified = false;
    
    // Level 2
    @Column(unique = true)
    private String panNumber;
    private String panDocumentUrl;
    
    @Column(unique = true)
    private String aadhaarNumber;
    private String aadhaarDocumentUrl;
    private String selfieUrl;
    
    @Column(nullable = false)
    private boolean isLevel2Verified = false;

    // Level 3
    private String incomeProofUrl;
    private String bankStatementUrl;
    private String videoVerificationUrl;
    
    @Column(nullable = false)
    private boolean isLevel3Verified = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KycStatus overallStatus = KycStatus.PENDING;
    
    private String adminRemarks;
}
