package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "trades")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trade extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "market_id", nullable = false)
    private Market market;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maker_order_id", nullable = false)
    private Order makerOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "taker_order_id", nullable = false)
    private Order takerOrder;

    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal price = BigDecimal.ZERO;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal quantity = BigDecimal.ZERO;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal makerFee = BigDecimal.ZERO;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal takerFee = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderSide side; // Taker side
}
