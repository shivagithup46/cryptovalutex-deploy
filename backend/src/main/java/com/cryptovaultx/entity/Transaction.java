package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "token_id", nullable = false)
    private Token token;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal amount;

    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal price; // Price per token at the time of transaction

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal fee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;

    @Column(unique = true)
    private String txHash; // For blockchain transactions

    @Column
    private String tradingPair;

    @Column(precision = 38, scale = 18)
    private BigDecimal profit;

    @Column(precision = 38, scale = 18)
    private BigDecimal walletBalanceBefore;

    @Column(precision = 38, scale = 18)
    private BigDecimal walletBalanceAfter;

    @Column(precision = 38, scale = 18)
    private BigDecimal portfolioValue;
}
