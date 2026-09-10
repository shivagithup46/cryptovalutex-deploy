package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "p2p_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class P2pOrder extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ad_id", nullable = false)
    private P2pAd ad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "token_id", nullable = false)
    private Token token;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal fiatAmount;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal cryptoAmount;

    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal price;

    @Column(nullable = false, length = 50)
    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private P2pOrderStatus status = P2pOrderStatus.PENDING;

    @Column(length = 500)
    private String paymentProofUrl;

    @Column(nullable = false)
    private LocalDateTime expiresAt;
}
