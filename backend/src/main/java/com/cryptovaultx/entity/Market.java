package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "markets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Market extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String symbol;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "base_token_id", nullable = false)
    private Token baseToken;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quote_token_id", nullable = false)
    private Token quoteToken;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal baseMinSize = BigDecimal.ZERO;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal baseMaxSize = BigDecimal.ZERO;

    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal quoteTickSize = BigDecimal.ZERO;

    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal baseTickSize = BigDecimal.ZERO;

    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal makerFeeRate = BigDecimal.ZERO;

    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal takerFeeRate = BigDecimal.ZERO;

    @Column(nullable = false)
    private boolean isActive = true;
}
