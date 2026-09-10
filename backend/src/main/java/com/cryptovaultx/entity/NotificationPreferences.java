package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notification_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationPreferences extends AuditableEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Builder.Default
    @Column(nullable = false)
    private boolean emailAlerts = true;

    @Builder.Default
    @Column(nullable = false)
    private boolean smsAlerts = false;

    @Builder.Default
    @Column(nullable = false)
    private boolean pushNotifications = true;
    
    @Builder.Default
    @Column(nullable = false)
    private boolean marketingEmails = false;

    @Builder.Default
    @Column(nullable = false)
    private boolean tradeExecutionAlerts = true;

    @Builder.Default
    @Column(nullable = false)
    private boolean buyAlerts = true;

    @Builder.Default
    @Column(nullable = false)
    private boolean sellAlerts = true;

    @Builder.Default
    @Column(nullable = false)
    private boolean portfolioUpdates = true;

    @Builder.Default
    @Column(nullable = false)
    private boolean priceAlerts = true;

    @Builder.Default
    @Column(nullable = false)
    private boolean depositAlerts = true;

    @Builder.Default
    @Column(nullable = false)
    private boolean withdrawalAlerts = true;
}

