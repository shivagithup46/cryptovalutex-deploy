package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "risk_scores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskScore extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private Integer score; // 0-100

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private RiskLevel riskLevel = RiskLevel.LOW;

    private LocalDateTime lastAssessedAt;
}
