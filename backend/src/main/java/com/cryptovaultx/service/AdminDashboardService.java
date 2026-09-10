package com.cryptovaultx.service;

import com.cryptovaultx.repository.UserRepository;
import com.cryptovaultx.repository.WalletRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;

    public DashboardMetrics getMetrics() {
        DashboardMetrics metrics = new DashboardMetrics();
        metrics.setTotalUsers(userRepository.count());
        metrics.setTotalWallets(walletRepository.count());
        metrics.setDailyActiveUsers(2450); // Mocked for now
        metrics.setMonthlyActiveUsers(18000); // Mocked
        metrics.setTradingVolume24h(3450000.00); // Mocked
        return metrics;
    }
}

@Data
class DashboardMetrics {
    private long totalUsers;
    private long totalWallets;
    private int dailyActiveUsers;
    private int monthlyActiveUsers;
    private double tradingVolume24h;
}
