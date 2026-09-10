package com.cryptovaultx.service;

import com.cryptovaultx.entity.Portfolio;
import com.cryptovaultx.entity.User;
import com.cryptovaultx.entity.Wallet;
import com.cryptovaultx.repository.PortfolioRepository;
import com.cryptovaultx.repository.UserRepository;
import com.cryptovaultx.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final MarketDataService marketDataService;

    @Transactional
    public Portfolio getOrCreatePortfolio(String userId) {
        return portfolioRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            Portfolio newPortfolio = Portfolio.builder()
                    .user(user)
                    .totalBalanceInr(BigDecimal.ZERO)
                    .totalProfitInr(BigDecimal.ZERO)
                    .todayProfitInr(BigDecimal.ZERO)
                    .roiPercentage(BigDecimal.ZERO)
                    .build();
            return portfolioRepository.save(newPortfolio);
        });
    }

    @Transactional
    public Portfolio updatePortfolio(String userId) {
        Portfolio portfolio = getOrCreatePortfolio(userId);
        List<Wallet> wallets = walletRepository.findByUserId(userId);
        
        BigDecimal totalValueInr = BigDecimal.ZERO;
        BigDecimal totalInvestedInr = BigDecimal.ZERO;

        for (Wallet wallet : wallets) {
            BigDecimal amount = wallet.getBalance();
            BigDecimal currentPrice = wallet.getToken().getCurrentPrice();
            BigDecimal avgBuyPrice = wallet.getAverageBuyPrice();
            if (avgBuyPrice == null) avgBuyPrice = BigDecimal.ZERO;

            if (wallet.getToken().getSymbol().equalsIgnoreCase("INR")) {
                totalValueInr = totalValueInr.add(amount);
                totalInvestedInr = totalInvestedInr.add(amount);
            } else if (wallet.getToken().getSymbol().equalsIgnoreCase("USDT")) {
                BigDecimal inrValue = amount.multiply(new BigDecimal("85")); // Approximate USDT to INR
                totalValueInr = totalValueInr.add(inrValue);
                totalInvestedInr = totalInvestedInr.add(inrValue);
            } else {
                BigDecimal currentVal = amount.multiply(currentPrice);
                BigDecimal investedVal = amount.multiply(avgBuyPrice);
                totalValueInr = totalValueInr.add(currentVal);
                totalInvestedInr = totalInvestedInr.add(investedVal);
            }
        }

        portfolio.setTotalBalanceInr(totalValueInr);
        
        // Calculate unrealized profit/loss based on current holdings vs invested amount
        BigDecimal totalProfit = totalValueInr.subtract(totalInvestedInr);
        portfolio.setTotalProfitInr(totalProfit);
        
        if (totalInvestedInr.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal roi = totalProfit.divide(totalInvestedInr, 8, RoundingMode.HALF_UP).multiply(new BigDecimal("100"));
            portfolio.setRoiPercentage(roi);
        } else {
            portfolio.setRoiPercentage(BigDecimal.ZERO);
        }

        return portfolioRepository.save(portfolio);
    }

    @Transactional(readOnly = true)
    public com.cryptovaultx.dto.AccountSummaryDTO getAccountSummary(String userId, String marketSymbol) {
        String baseSymbol = marketSymbol.split("_")[0];
        String quoteSymbol = marketSymbol.split("_").length > 1 ? marketSymbol.split("_")[1] : "INR";

        Wallet baseWallet = walletRepository.findByUserIdAndTokenSymbol(userId, baseSymbol).orElse(null);
        Wallet quoteWallet = walletRepository.findByUserIdAndTokenSymbol(userId, quoteSymbol).orElse(null);

        BigDecimal baseBalance = baseWallet != null ? baseWallet.getBalance() : BigDecimal.ZERO;
        BigDecimal quoteBalance = quoteWallet != null ? quoteWallet.getBalance() : BigDecimal.ZERO;
        BigDecimal averageBuyPrice = baseWallet != null && baseWallet.getAverageBuyPrice() != null ? baseWallet.getAverageBuyPrice() : BigDecimal.ZERO;

        com.cryptovaultx.dto.MarketDataDTO marketData = marketDataService.getMarketDataForSymbol(marketSymbol);
        BigDecimal currentPrice = marketData != null ? BigDecimal.valueOf(marketData.getCurrentPrice()) : BigDecimal.ZERO;
        String marketStatus = marketData != null ? "ACTIVE" : "UNAVAILABLE";

        BigDecimal estimatedValue = quoteBalance.add(baseBalance.multiply(currentPrice));

        BigDecimal currentRoi = BigDecimal.ZERO;
        if (averageBuyPrice.compareTo(BigDecimal.ZERO) > 0) {
            currentRoi = currentPrice.subtract(averageBuyPrice).divide(averageBuyPrice, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"));
        }

        // Calculate Portfolio-wide Risk Meter
        List<Wallet> allWallets = walletRepository.findByUserId(userId);
        BigDecimal totalCryptoValue = BigDecimal.ZERO;
        BigDecimal totalPortfolioValue = BigDecimal.ZERO;

        for (Wallet w : allWallets) {
            BigDecimal amt = w.getBalance();
            if (w.getToken().getSymbol().equalsIgnoreCase("INR")) {
                totalPortfolioValue = totalPortfolioValue.add(amt);
            } else {
                // Approximate all crypto to current price or use avg buy price as fallback
                BigDecimal price = BigDecimal.ZERO;
                if (w.getToken().getCurrentPrice() != null) {
                    price = w.getToken().getCurrentPrice();
                } else if (w.getAverageBuyPrice() != null) {
                    price = w.getAverageBuyPrice();
                }
                BigDecimal val = amt.multiply(price);
                totalCryptoValue = totalCryptoValue.add(val);
                totalPortfolioValue = totalPortfolioValue.add(val);
            }
        }

        int riskPercentage = 0;
        if (totalPortfolioValue.compareTo(BigDecimal.ZERO) > 0) {
            riskPercentage = totalCryptoValue.divide(totalPortfolioValue, 2, RoundingMode.HALF_UP).multiply(new BigDecimal("100")).intValue();
        }

        String riskLevel;
        if (riskPercentage <= 25) riskLevel = "LOW";
        else if (riskPercentage <= 50) riskLevel = "MODERATE";
        else if (riskPercentage <= 75) riskLevel = "HIGH";
        else riskLevel = "VERY HIGH";

        return com.cryptovaultx.dto.AccountSummaryDTO.builder()
                .baseBalance(baseBalance)
                .quoteBalance(quoteBalance)
                .estimatedValue(estimatedValue)
                .averageBuyPrice(averageBuyPrice)
                .currentRoi(currentRoi)
                .marketStatus(marketStatus)
                .makerFee(new BigDecimal("0.10"))
                .takerFee(new BigDecimal("0.10"))
                .riskLevel(riskLevel)
                .riskPercentage(riskPercentage)
                .build();
    }
}
