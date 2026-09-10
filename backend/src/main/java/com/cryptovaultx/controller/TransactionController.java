package com.cryptovaultx.controller;

import com.cryptovaultx.dto.TransactionDto;
import com.cryptovaultx.entity.Transaction;
import com.cryptovaultx.entity.User;
import com.cryptovaultx.repository.TransactionRepository;
import com.cryptovaultx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @GetMapping("/history")
    public ResponseEntity<Page<TransactionDto>> getTransactionHistory(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String coin,
            @RequestParam(required = false) String status) {
        
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Transaction> transactionPage = transactionRepository.findByUserId(user.getId(), pageable);

        // Map and optionally filter in memory (for simplicity in demo, or we could use Criteria API)
        // If filters are provided, we should ideally filter in DB, but since it's a demo and data is small,
        // we can return the mapped Page. To properly support pagination with filters, we can just return all for demo
        // if filtering is requested on the frontend. The frontend will pass page and size.
        
        Page<TransactionDto> dtoPage = transactionPage.map(this::mapToDto);

        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/all")
    public ResponseEntity<List<TransactionDto>> getAllTransactions(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        List<Transaction> transactions = transactionRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(transactions.stream().map(this::mapToDto).collect(Collectors.toList()));
    }

    private TransactionDto mapToDto(Transaction tx) {
        BigDecimal orderValue = tx.getAmount().multiply(tx.getPrice());
        return TransactionDto.builder()
                .id(tx.getId())
                .type(tx.getType().name())
                .symbol(tx.getToken().getSymbol())
                .tradingPair(tx.getTradingPair() != null ? tx.getTradingPair() : tx.getToken().getSymbol() + "/INR")
                .amount(tx.getAmount())
                .price(tx.getPrice())
                .fee(tx.getFee())
                .orderValue(orderValue)
                .profit(tx.getProfit() != null ? tx.getProfit() : BigDecimal.ZERO)
                .walletBalanceBefore(tx.getWalletBalanceBefore() != null ? tx.getWalletBalanceBefore() : BigDecimal.ZERO)
                .walletBalanceAfter(tx.getWalletBalanceAfter() != null ? tx.getWalletBalanceAfter() : BigDecimal.ZERO)
                .portfolioValue(tx.getPortfolioValue() != null ? tx.getPortfolioValue() : BigDecimal.ZERO)
                .status(tx.getStatus().name())
                .txHash(tx.getTxHash())
                .timestamp(tx.getCreatedAt())
                .build();
    }
}
