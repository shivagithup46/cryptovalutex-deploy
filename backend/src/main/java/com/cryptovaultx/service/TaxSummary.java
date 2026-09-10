package com.cryptovaultx.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaxSummary {
    private BigDecimal totalTds;
    private BigDecimal totalProfit;
    private BigDecimal totalLoss;
    private BigDecimal totalTaxLiability;
}
