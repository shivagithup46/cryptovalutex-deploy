package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "ai_predictions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiPrediction extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "token_id", nullable = false)
    private Token token;

    @Column(nullable = false, length = 20)
    private String timeframe;

    @Column(nullable = false, precision = 19, scale = 8)
    private BigDecimal predictedPrice;

    @Column(nullable = false)
    private Integer confidenceScore;

    @Column(name = "`signal`", nullable = false, length = 20)
    private String signal;

    @Column(precision = 19, scale = 8)
    private BigDecimal supportLevel;

    @Column(precision = 19, scale = 8)
    private BigDecimal resistanceLevel;
}
