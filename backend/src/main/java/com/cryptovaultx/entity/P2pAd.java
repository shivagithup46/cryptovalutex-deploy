package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "p2p_ads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class P2pAd extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "token_id", nullable = false)
    private Token token;

    @Column(nullable = false, length = 10)
    private String fiatCurrency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderSide type; // BUY or SELL

    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal price;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal totalQuantity;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal availableQuantity;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal minOrderLimit;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal maxOrderLimit;

    @Column(nullable = false)
    private String paymentMethods; // JSON or CSV format string

    @Column(columnDefinition = "TEXT")
    private String terms;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private P2pAdStatus status = P2pAdStatus.ACTIVE;
}
