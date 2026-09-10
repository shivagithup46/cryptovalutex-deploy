package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "staking_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StakingProduct extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "token_id", nullable = false)
    private Token token;

    @Column(nullable = false)
    private Integer durationDays; // 0 for flexible

    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal apy;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal minStakeAmount;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal maxStakeAmount;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal totalStaked = BigDecimal.ZERO;

    @Column(nullable = false)
    private boolean isActive = true;
}
