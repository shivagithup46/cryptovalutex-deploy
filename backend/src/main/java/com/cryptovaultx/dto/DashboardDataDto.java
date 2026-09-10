package com.cryptovaultx.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardDataDto {
    private BigDecimal totalBalance;
    private BigDecimal availableCash;
    private BigDecimal portfolioValue;
    private BigDecimal tradingVolume24h;
    private int activePositions;
    private BigDecimal totalProfit;
    private List<ActivityDto> recentActivities;

    @Data
    @Builder
    public static class ActivityDto {
        private String type; // e.g. "Bought BTC"
        private String time;
        private String amount;
        private String fiatValue;
        private boolean isPositive;
    }
}
