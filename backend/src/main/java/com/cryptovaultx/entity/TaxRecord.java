package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "tax_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaxRecord extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trade_id")
    private Trade trade; // Optional, links to exchange trade

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "token_id", nullable = false)
    private Token token;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private TransactionType transactionType;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal quantity;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal priceInr;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal totalValueInr;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal tdsAmountInr = BigDecimal.ZERO;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal profitLossInr = BigDecimal.ZERO;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal taxAmountInr = BigDecimal.ZERO;

    @Column(nullable = false, length = 20)
    private String financialYear;
}
