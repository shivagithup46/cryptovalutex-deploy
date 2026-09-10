package com.cryptovaultx.controller;

import com.cryptovaultx.dto.DashboardDataDto;
import com.cryptovaultx.entity.Transaction;
import com.cryptovaultx.entity.Wallet;
import com.cryptovaultx.repository.TransactionRepository;
import com.cryptovaultx.repository.WalletRepository;
import com.cryptovaultx.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final com.cryptovaultx.repository.PortfolioRepository portfolioRepository;

    @GetMapping("/overview")
    public ResponseEntity<DashboardDataDto> getDashboardOverview(Authentication authentication) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        
        List<Wallet> wallets = walletRepository.findByUserId(userId);
        
        BigDecimal availableCash = BigDecimal.ZERO;
        BigDecimal portfolioValue = BigDecimal.ZERO;
        int activePositions = 0;
        
        for (Wallet w : wallets) {
            if (w.getToken().getSymbol().equalsIgnoreCase("INR")) {
                availableCash = availableCash.add(w.getBalance());
            } else {
                BigDecimal tokenValue = w.getBalance().multiply(w.getToken().getCurrentPrice());
                portfolioValue = portfolioValue.add(tokenValue);
                if (w.getBalance().compareTo(BigDecimal.ZERO) > 0) {
                    activePositions++;
                }
            }
        }
        
        BigDecimal totalBalance = availableCash.add(portfolioValue);
        
        com.cryptovaultx.entity.Portfolio portfolio = portfolioRepository.findByUserId(userId).orElse(null);
        BigDecimal totalProfit = (portfolio != null && portfolio.getTotalProfitInr() != null) ? portfolio.getTotalProfitInr() : BigDecimal.ZERO;

        List<Transaction> txs = transactionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        List<DashboardDataDto.ActivityDto> recentActivities = txs.stream().limit(5).map(tx -> {
            boolean isPositive = tx.getType().name().equals("DEPOSIT") || tx.getType().name().equals("SELL");
            String sign = isPositive ? "+" : "-";
            String fiatSign = tx.getType().name().equals("BUY") || tx.getType().name().equals("WITHDRAWAL") ? "-" : "+";
            
            SimpleDateFormat sdf = new SimpleDateFormat("MMM dd, HH:mm");
            String timeStr = sdf.format(java.sql.Timestamp.valueOf(tx.getCreatedAt()));

            return DashboardDataDto.ActivityDto.builder()
                    .type(tx.getType().name() + " " + tx.getToken().getSymbol())
                    .time(timeStr)
                    .amount(sign + tx.getAmount().stripTrailingZeros().toPlainString() + " " + tx.getToken().getSymbol())
                    .fiatValue(fiatSign + "₹" + tx.getAmount().multiply(tx.getPrice()).setScale(2, java.math.RoundingMode.HALF_UP).stripTrailingZeros().toPlainString())
                    .isPositive(isPositive)
                    .build();
        }).collect(Collectors.toList());

        DashboardDataDto data = DashboardDataDto.builder()
                .totalBalance(totalBalance)
                .availableCash(availableCash)
                .portfolioValue(portfolioValue)
                .tradingVolume24h(new BigDecimal("0")) // Mock for now unless we calculate
                .activePositions(activePositions)
                .totalProfit(totalProfit)
                .recentActivities(recentActivities)
                .build();
                
        return ResponseEntity.ok(data);
    }
}
