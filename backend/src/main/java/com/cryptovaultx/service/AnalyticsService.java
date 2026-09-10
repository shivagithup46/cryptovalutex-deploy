package com.cryptovaultx.service;

import com.cryptovaultx.entity.Wallet;
import com.cryptovaultx.repository.WalletRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final WalletRepository walletRepository;

    public PortfolioAnalytics getPortfolioAnalytics(String userId) {
        List<Wallet> wallets = walletRepository.findByUserId(userId);
        
        BigDecimal totalValue = BigDecimal.ZERO;
        
        // Mock calculations
        for (Wallet wallet : wallets) {
            // Assume 1 crypto = 1000 USD for simplicity of mock
            BigDecimal price = new BigDecimal("1000");
            totalValue = totalValue.add(wallet.getBalance().multiply(price));
        }

        PortfolioAnalytics analytics = new PortfolioAnalytics();
        analytics.setTotalValueUsd(totalValue);
        analytics.setTodayProfitUsd(totalValue.multiply(new BigDecimal("0.02"))); // 2% mock profit
        analytics.setAllTimeProfitUsd(totalValue.multiply(new BigDecimal("0.15"))); // 15% mock
        analytics.setWinRatio("68%");
        analytics.setLossRatio("32%");
        analytics.setDiversificationScore("8.5/10");
        
        return analytics;
    }
}

@Data
class PortfolioAnalytics {
    private BigDecimal totalValueUsd;
    private BigDecimal todayProfitUsd;
    private BigDecimal allTimeProfitUsd;
    private String winRatio;
    private String lossRatio;
    private String diversificationScore;
}
