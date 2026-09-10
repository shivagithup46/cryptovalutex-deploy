package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "price_alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceAlert extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "market_id", nullable = false)
    private Market market;

    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal targetPrice = BigDecimal.ZERO;

    @Column(nullable = false)
    private boolean isAbove;

    @Column(nullable = false)
    private boolean isActive = true;

    @Column(nullable = false)
    private boolean isTriggered = false;
}
