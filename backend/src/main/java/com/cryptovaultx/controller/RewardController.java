package com.cryptovaultx.controller;

import com.cryptovaultx.entity.Transaction;
import com.cryptovaultx.entity.TransactionStatus;
import com.cryptovaultx.entity.TransactionType;
import com.cryptovaultx.entity.User;
import com.cryptovaultx.repository.TransactionRepository;
import com.cryptovaultx.repository.UserRepository;
import com.cryptovaultx.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/reward")
@RequiredArgsConstructor
public class RewardController {

    private final UserRepository userRepository;
    private final WalletService walletService;
    private final TransactionRepository transactionRepository;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getRewardStatus(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok(Map.of("claimed", false));
        }
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(Map.of("claimed", user.isHasClaimedDemoFunds()));
    }

    @PostMapping("/claim")
    public ResponseEntity<Map<String, Object>> claimRewardFunds(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isHasClaimedDemoFunds()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Demo funds already claimed"));
        }

        BigDecimal rewardAmount = new BigDecimal("100000000");

        // Credit to wallet
        walletService.addFunds(user.getId(), "INR", rewardAmount);

        // Mark as claimed
        user.setHasClaimedDemoFunds(true);
        userRepository.save(user);

        // Record transaction
        Transaction transaction = Transaction.builder()
                .user(user)
                .token(walletService.getOrCreateWallet(user.getId(), "INR").getToken())
                .type(TransactionType.LOGIN_REWARD)
                .amount(rewardAmount)
                .price(new BigDecimal("1")) // INR base price is 1
                .fee(BigDecimal.ZERO)
                .status(TransactionStatus.COMPLETED)
                .txHash("DEMO-" + System.currentTimeMillis())
                .tradingPair("INR/INR")
                .profit(BigDecimal.ZERO)
                .walletBalanceBefore(BigDecimal.ZERO)
                .walletBalanceAfter(rewardAmount)
                .portfolioValue(rewardAmount)
                .build();
        transactionRepository.save(transaction);

        return ResponseEntity.ok(Map.of(
                "message", "Successfully claimed 100,000,000 INR for demo trading.",
                "claimed", true
        ));
    }
}
