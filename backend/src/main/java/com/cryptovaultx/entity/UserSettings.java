package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSettings extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Profile Settings
    @Column
    private String profilePhoto;
    
    @Column(nullable = false)
    @Builder.Default
    private String country = "India";
    
    @Column(nullable = false)
    @Builder.Default
    private String timezone = "UTC+05:30";
    
    @Column(nullable = false)
    @Builder.Default
    private String language = "en";

    // Notification Settings
    @Column(nullable = false)
    @Builder.Default
    private boolean tradeNotifications = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean buyNotifications = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean sellNotifications = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean portfolioAlerts = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean priceAlerts = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean marketNews = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean emailNotifications = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean browserNotifications = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean systemAnnouncements = true;

    // Trading Settings
    @Column(nullable = false)
    @Builder.Default
    private String defaultCurrency = "INR";

    @Column(nullable = false)
    @Builder.Default
    private String defaultTradingPair = "BTC/INR";

    @Column(nullable = false)
    @Builder.Default
    private String chartTheme = "dark";

    @Column(nullable = false)
    @Builder.Default
    private String defaultChartInterval = "15m";

    @Column(nullable = false)
    @Builder.Default
    private boolean enableSoundEffects = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean autoRefresh = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean decimalPrecision = true;

    // Privacy Settings
    @Column(nullable = false)
    @Builder.Default
    private boolean hidePortfolioValue = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean hideWalletBalance = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean hideEmail = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean hidePhoneNumber = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean hideTotalProfit = false;

    // Theme Settings
    @Column(nullable = false)
    @Builder.Default
    private String themeMode = "dark";

    @Column(nullable = false)
    @Builder.Default
    private String accentColor = "purple";

    // Security Options
    @Column(nullable = false)
    @Builder.Default
    private boolean enableLoginNotifications = true;
}
