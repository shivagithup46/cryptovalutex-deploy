package com.cryptovaultx.service;

import com.cryptovaultx.entity.*;
import com.cryptovaultx.repository.AmlAlertRepository;
import com.cryptovaultx.repository.RiskScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RiskEngineService {

    private final RiskScoreRepository riskScoreRepository;
    private final AmlAlertRepository amlAlertRepository;

    @Transactional
    public void analyzeTransaction(User user, BigDecimal fiatValueInr, String transactionId) {
        RiskScore score = riskScoreRepository.findByUserId(user.getId())
                .orElse(RiskScore.builder()
                        .user(user)
                        .score(0)
                        .riskLevel(RiskLevel.LOW)
                        .build());

        boolean ruleTriggered = false;
        String ruleDesc = "";
        RiskLevel alertLevel = RiskLevel.LOW;

        // Rule 1: Large Transaction (> 5,00,000 INR)
        if (fiatValueInr.compareTo(new BigDecimal("500000")) > 0) {
            score.setScore(score.getScore() + 30);
            ruleTriggered = true;
            ruleDesc = "LARGE_TRANSACTION_DETECTED";
            alertLevel = RiskLevel.HIGH;
        }

        // Rule 2: Medium Transaction (> 1,00,000 INR)
        else if (fiatValueInr.compareTo(new BigDecimal("100000")) > 0) {
            score.setScore(score.getScore() + 10);
            if (!ruleTriggered) {
                ruleTriggered = true;
                ruleDesc = "MEDIUM_TRANSACTION_DETECTED";
                alertLevel = RiskLevel.MEDIUM;
            }
        }

        if (score.getScore() >= 80) {
            score.setRiskLevel(RiskLevel.SEVERE);
            alertLevel = RiskLevel.SEVERE;
        } else if (score.getScore() >= 50) {
            score.setRiskLevel(RiskLevel.HIGH);
        } else if (score.getScore() >= 20) {
            score.setRiskLevel(RiskLevel.MEDIUM);
        }

        score.setLastAssessedAt(LocalDateTime.now());
        riskScoreRepository.save(score);

        if (ruleTriggered) {
            AmlAlert alert = AmlAlert.builder()
                    .user(user)
                    .transactionId(transactionId)
                    .ruleTriggered(ruleDesc)
                    .riskLevel(alertLevel)
                    .status(AmlStatus.OPEN)
                    .description("Value: " + fiatValueInr + " INR")
                    .build();
            amlAlertRepository.save(alert);
        }
    }
}
