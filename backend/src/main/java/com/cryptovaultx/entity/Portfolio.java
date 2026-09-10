package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "portfolio")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Portfolio extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, precision = 38, scale = 18)
    @Builder.Default
    private BigDecimal totalBalanceInr = BigDecimal.ZERO;

    @Column(nullable = false, precision = 38, scale = 18)
    @Builder.Default
    private BigDecimal totalProfitInr = BigDecimal.ZERO;

    @Column(nullable = false, precision = 38, scale = 18)
    @Builder.Default
    private BigDecimal todayProfitInr = BigDecimal.ZERO;

    @Column(nullable = false, precision = 19, scale = 8)
    @Builder.Default
    private BigDecimal roiPercentage = BigDecimal.ZERO;
}
