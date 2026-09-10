package com.cryptovaultx.service;

import com.cryptovaultx.dto.UserProfileDto;
import com.cryptovaultx.entity.User;
import com.cryptovaultx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final com.cryptovaultx.repository.WalletRepository walletRepository;
    private final com.cryptovaultx.repository.TransactionRepository transactionRepository;
    private final com.cryptovaultx.repository.OrderRepository orderRepository;
    private final com.cryptovaultx.repository.BankAccountRepository bankAccountRepository;
    private final com.cryptovaultx.repository.PortfolioRepository portfolioRepository;
    private final WalletService walletService;

    public UserProfileDto getUserProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
                
        return UserProfileDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .isEmailVerified(user.isEmailVerified())
                .isTwoFactorEnabled(user.isTwoFactorEnabled())
                .build();
    }

    @org.springframework.transaction.annotation.Transactional
    public void resetDemoAccount(String userId) {
        // Delete orders
        orderRepository.deleteAll(orderRepository.findByUserId(userId));
        
        // Delete transactions
        transactionRepository.deleteAll(transactionRepository.findByUserIdOrderByCreatedAtDesc(userId));
        
        // Delete wallets
        walletRepository.deleteAll(walletRepository.findByUserId(userId));
        
        // Reset bank account balance
        com.cryptovaultx.entity.BankAccount bankAccount = bankAccountRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Demo Bank Account not found"));
        bankAccount.setBalance(new java.math.BigDecimal("10000000.00"));
        bankAccountRepository.save(bankAccount);
        
        com.cryptovaultx.entity.Portfolio portfolio = portfolioRepository.findByUserId(userId).orElse(null);
        if (portfolio != null) {
            portfolio.setTotalBalanceInr(java.math.BigDecimal.ZERO);
            portfolio.setTotalProfitInr(java.math.BigDecimal.ZERO);
            portfolio.setTodayProfitInr(java.math.BigDecimal.ZERO);
            portfolioRepository.save(portfolio);
        }
        
        // Add 10,000,000 INR welcome bonus again to wallet
        walletService.processDeposit(userId, "INR", new java.math.BigDecimal("10000000.00"));
    }
}
