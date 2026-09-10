package com.cryptovaultx.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountSummaryDTO {
    private BigDecimal baseBalance;
    private BigDecimal quoteBalance;
    private BigDecimal estimatedValue;
    private BigDecimal averageBuyPrice;
    private BigDecimal currentRoi;
    private String marketStatus;
    private BigDecimal makerFee;
    private BigDecimal takerFee;
    private String riskLevel;
    private int riskPercentage;
}
