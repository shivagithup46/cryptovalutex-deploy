package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "aml_alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmlAlert extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String transactionId; // Reference to a trade or transaction

    @Column(nullable = false)
    private String ruleTriggered;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private RiskLevel riskLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private AmlStatus status = AmlStatus.OPEN;

    @Column(columnDefinition = "TEXT")
    private String description;
}
