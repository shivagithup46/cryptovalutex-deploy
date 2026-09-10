package com.cryptovaultx.dto;

import lombok.Data;

@Data
public class Web3AuthRequest {
    private String walletAddress;
    private String signature;
    private String message;
}
