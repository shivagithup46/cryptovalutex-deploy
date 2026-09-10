package com.cryptovaultx.dto;

import lombok.Data;

@Data
public class FiatTransactionRequest {
    private double amount;
    private String currency; // e.g. "INR", "USD"
    private String gateway; // e.g. "RAZORPAY", "UPI"
    private String type; // "DEPOSIT" or "WITHDRAWAL"
    private String paymentReferenceId; // From the gateway
}
