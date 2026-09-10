package com.cryptovaultx.service;

import com.cryptovaultx.entity.*;
import com.cryptovaultx.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StakingService {

    private final StakingProductRepository productRepository;
    private final StakingPositionRepository positionRepository;
    private final RewardHistoryRepository rewardHistoryRepository;
    private final WalletService walletService;
    private final UserRepository userRepository;

    public List<StakingProduct> getActiveProducts() {
        return productRepository.findByIsActiveTrue();
    }

    @Transactional
    public StakingPosition stake(String userId, String productId, BigDecimal amount, boolean autoCompound) {
        User user = userRepository.findById(userId).orElseThrow();
        StakingProduct product = productRepository.findById(productId).orElseThrow();

        if (!product.isActive()) throw new RuntimeException("Product is inactive");
        if (amount.compareTo(product.getMinStakeAmount()) < 0) throw new RuntimeException("Amount below minimum");
        if (amount.compareTo(product.getMaxStakeAmount()) > 0) throw new RuntimeException("Amount above maximum");

        // Deduct funds and lock them logically by just deducting from wallet
        // Wait, better to lock them using WalletService
        walletService.lockFunds(userId, product.getToken().getSymbol(), amount);

        product.setTotalStaked(product.getTotalStaked().add(amount));
        productRepository.save(product);

        LocalDateTime endDate = product.getDurationDays() > 0 ? LocalDateTime.now().plusDays(product.getDurationDays()) : null;

        StakingPosition position = StakingPosition.builder()
                .user(user)
                .product(product)
                .stakedAmount(amount)
                .accumulatedReward(BigDecimal.ZERO)
                .status(StakingStatus.ACTIVE)
                .autoCompound(autoCompound)
                .startDate(LocalDateTime.now())
                .endDate(endDate)
                .build();

        return positionRepository.save(position);
    }

    @Transactional
    public void unstake(String userId, String positionId) {
        StakingPosition position = positionRepository.findById(positionId).orElseThrow();
        if (!position.getUser().getId().equals(userId)) throw new RuntimeException("Unauthorized");
        if (position.getStatus() != StakingStatus.ACTIVE) throw new RuntimeException("Not active");

        boolean isEarly = position.getEndDate() != null && LocalDateTime.now().isBefore(position.getEndDate());
        
        BigDecimal returnAmount = position.getStakedAmount();
        BigDecimal reward = position.getAccumulatedReward();

        if (isEarly) {
            // Penalize early withdrawal (e.g. lose all accumulated rewards and take a 5% fee on principal)
            reward = BigDecimal.ZERO;
            BigDecimal penalty = returnAmount.multiply(new BigDecimal("0.05"));
            returnAmount = returnAmount.subtract(penalty);
            position.setStatus(StakingStatus.EARLY_REDEMPTION);
        } else {
            position.setStatus(StakingStatus.REDEEMED);
        }

        String tokenSymbol = position.getProduct().getToken().getSymbol();

        // Unlock funds - but since we deducted locked funds, we must first unlock then deduct or directly add to available?
        // walletService.lockFunds deducts from balance and adds to locked.
        // We need to unlock it, then it goes back to balance.
        walletService.unlockFunds(userId, tokenSymbol, position.getStakedAmount());
        
        // If there was a penalty, we need to deduct it from the unlocked balance
        if (isEarly) {
             BigDecimal penalty = position.getStakedAmount().multiply(new BigDecimal("0.05"));
             // Deduct the penalty from the user's available balance since it was just unlocked
             walletService.deductLockedFunds(userId, tokenSymbol, BigDecimal.ZERO); // dummy
             // Actually, the cleanest is just setting balances manually or using add/deduct
             // Since walletService doesn't have an explicit burn/penalty method, we'll withdraw the penalty
             // Wait, locking moved balance to lockedBalance.
             // Unlocking moves lockedBalance to balance.
             // We can just withdraw the penalty from balance.
             // But let's keep it simple: 
        }

        // We will just do a manual adjustment for now since WalletService logic might be rigid.
        // Let's rely on WalletService:
        if (isEarly) {
            BigDecimal penalty = position.getStakedAmount().multiply(new BigDecimal("0.05"));
            walletService.lockFunds(userId, tokenSymbol, penalty); // Re-lock penalty to "burn" it
            walletService.deductLockedFunds(userId, tokenSymbol, penalty); // burn
        }

        if (reward.compareTo(BigDecimal.ZERO) > 0) {
            walletService.addFunds(userId, tokenSymbol, reward);
        }

        position.setAccumulatedReward(BigDecimal.ZERO);
        positionRepository.save(position);

        StakingProduct product = position.getProduct();
        product.setTotalStaked(product.getTotalStaked().subtract(position.getStakedAmount()));
        productRepository.save(product);
    }

    @Scheduled(cron = "0 0 0 * * ?") // Daily at midnight
    @Transactional
    public void calculateDailyRewards() {
        List<StakingPosition> activePositions = positionRepository.findByStatus(StakingStatus.ACTIVE);
        
        for (StakingPosition position : activePositions) {
            StakingProduct product = position.getProduct();
            BigDecimal apy = product.getApy(); // e.g., 0.05 for 5%
            
            // Daily rate = APY / 365
            BigDecimal dailyRate = apy.divide(new BigDecimal("365"), 8, RoundingMode.HALF_UP);
            BigDecimal dailyReward = position.getStakedAmount().multiply(dailyRate);

            position.setAccumulatedReward(position.getAccumulatedReward().add(dailyReward));

            RewardHistory history = RewardHistory.builder()
                    .position(position)
                    .user(position.getUser())
                    .token(product.getToken())
                    .amount(dailyReward)
                    .build();
            rewardHistoryRepository.save(history);

            if (position.isAutoCompound()) {
                position.setStakedAmount(position.getStakedAmount().add(dailyReward));
                position.setAccumulatedReward(position.getAccumulatedReward().subtract(dailyReward));
                product.setTotalStaked(product.getTotalStaked().add(dailyReward));
                productRepository.save(product);
            }

            positionRepository.save(position);
        }
    }
}
