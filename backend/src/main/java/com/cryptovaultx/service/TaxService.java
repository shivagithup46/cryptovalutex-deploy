package com.cryptovaultx.service;

import com.cryptovaultx.entity.*;
import com.cryptovaultx.repository.TaxRecordRepository;
import com.cryptovaultx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaxService {

    private final TaxRecordRepository taxRecordRepository;
    private final UserRepository userRepository;

    /**
     * Records a transaction for tax calculation.
     * Indian context: 30% flat tax on profit. No offsetting losses. 1% TDS on sell.
     */
    @Transactional
    public void recordTransaction(User user, Token token, TransactionType type, BigDecimal quantity, BigDecimal priceInr, Trade trade) {
        BigDecimal totalValueInr = quantity.multiply(priceInr);
        BigDecimal tdsAmount = BigDecimal.ZERO;
        BigDecimal profitLoss = BigDecimal.ZERO;
        BigDecimal taxAmount = BigDecimal.ZERO;

        if (type == TransactionType.SELL) {
            // 1% TDS on the total transaction value
            tdsAmount = totalValueInr.multiply(new BigDecimal("0.01"));

            // FIFO Profit Calculation would normally happen here by matching against BUY records.
            // For simplicity in this implementation, we will mock the average cost basis
            // In a full production system, we would query the TaxRecord table for unmatched BUY records.
            BigDecimal mockAverageBuyPrice = priceInr.multiply(new BigDecimal("0.8")); // Assume bought 20% cheaper
            BigDecimal costBasis = quantity.multiply(mockAverageBuyPrice);
            
            profitLoss = totalValueInr.subtract(costBasis);

            if (profitLoss.compareTo(BigDecimal.ZERO) > 0) {
                // 30% tax on profit
                taxAmount = profitLoss.multiply(new BigDecimal("0.30"));
            }
        }

        TaxRecord record = TaxRecord.builder()
                .user(user)
                .trade(trade)
                .token(token)
                .transactionType(type)
                .quantity(quantity)
                .priceInr(priceInr)
                .totalValueInr(totalValueInr)
                .tdsAmountInr(tdsAmount)
                .profitLossInr(profitLoss)
                .taxAmountInr(taxAmount)
                .financialYear(getCurrentFinancialYear())
                .build();

        taxRecordRepository.save(record);
    }

    public List<TaxRecord> getTaxRecords(String userId, String financialYear) {
        return taxRecordRepository.findByUserIdAndFinancialYear(userId, financialYear);
    }
    
    public TaxSummary getTaxSummary(String userId, String financialYear) {
        List<TaxRecord> records = getTaxRecords(userId, financialYear);
        
        BigDecimal totalTds = records.stream()
                .map(TaxRecord::getTdsAmountInr)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal totalProfit = records.stream()
                .filter(r -> r.getProfitLossInr().compareTo(BigDecimal.ZERO) > 0)
                .map(TaxRecord::getProfitLossInr)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal totalLoss = records.stream()
                .filter(r -> r.getProfitLossInr().compareTo(BigDecimal.ZERO) < 0)
                .map(TaxRecord::getProfitLossInr)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal totalTaxLiability = records.stream()
                .map(TaxRecord::getTaxAmountInr)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        return new TaxSummary(totalTds, totalProfit, totalLoss, totalTaxLiability);
    }

    private String getCurrentFinancialYear() {
        LocalDate now = LocalDate.now();
        if (now.getMonthValue() >= 4) {
            return now.getYear() + "-" + (now.getYear() + 1);
        } else {
            return (now.getYear() - 1) + "-" + now.getYear();
        }
    }
}
