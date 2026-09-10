package com.cryptovaultx.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class TransactionDto {
    private String id;
    private String type;
    private String symbol;
    private String tradingPair;
    private BigDecimal amount;
    private BigDecimal price;
    private BigDecimal fee;
    private BigDecimal orderValue;
    private BigDecimal profit;
    private BigDecimal walletBalanceBefore;
    private BigDecimal walletBalanceAfter;
    private BigDecimal portfolioValue;
    private String status;
    private String txHash;
    private LocalDateTime timestamp;
}
