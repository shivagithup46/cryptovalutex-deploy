package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "market_id", nullable = false)
    private Market market;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderSide side;

    @Column(precision = 19, scale = 8)
    private BigDecimal price;

    @Column(precision = 19, scale = 8)
    private BigDecimal stopPrice;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal quantity = BigDecimal.ZERO;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal filledQuantity = BigDecimal.ZERO;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal remainingQuantity = BigDecimal.ZERO;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal fee = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;
}
