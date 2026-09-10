package com.cryptovaultx.dto;

import com.cryptovaultx.entity.KycStatus;
import lombok.Data;

@Data
public class KycDetailsDto {
    private String id;
    private String userId;
    private boolean isLevel1Verified;
    private String panNumber;
    private String panDocumentUrl;
    private String aadhaarNumber;
    private String aadhaarDocumentUrl;
    private String selfieUrl;
    private boolean isLevel2Verified;
    private String incomeProofUrl;
    private String bankStatementUrl;
    private String videoVerificationUrl;
    private boolean isLevel3Verified;
    private KycStatus overallStatus;
    private String adminRemarks;
}
