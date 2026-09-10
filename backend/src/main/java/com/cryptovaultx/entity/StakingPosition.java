package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "staking_positions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StakingPosition extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private StakingProduct product;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal stakedAmount;

    @Column(nullable = false, precision = 38, scale = 18)
    private BigDecimal accumulatedReward = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private StakingStatus status = StakingStatus.ACTIVE;

    @Column(nullable = false)
    private boolean autoCompound;

    @Column(nullable = false)
    private LocalDateTime startDate;

    private LocalDateTime endDate;
}
