package com.cryptovaultx.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class SettingsDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfileSettingsDto {
        private String firstName;
        private String lastName;
        private String phone;
        private String profilePhoto;
        private String country;
        private String timezone;
        private String language;
        private String email;
        private String role;
        private String joinedDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SecuritySettingsDto {
        private String currentPassword; // Used for updating password
        private String newPassword;     // Used for updating password
        private boolean isTwoFactorEnabled;
        private boolean isEmailVerified;
        private boolean isPhoneVerified;
        private boolean enableLoginNotifications;
        private String lastLogin;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotificationSettingsDto {
        private boolean tradeNotifications;
        private boolean buyNotifications;
        private boolean sellNotifications;
        private boolean portfolioAlerts;
        private boolean priceAlerts;
        private boolean marketNews;
        private boolean emailNotifications;
        private boolean browserNotifications;
        private boolean systemAnnouncements;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TradingSettingsDto {
        private String defaultCurrency;
        private String defaultTradingPair;
        private String chartTheme;
        private String defaultChartInterval;
        private boolean enableSoundEffects;
        private boolean autoRefresh;
        private boolean decimalPrecision;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrivacySettingsDto {
        private boolean hidePortfolioValue;
        private boolean hideWalletBalance;
        private boolean hideEmail;
        private boolean hidePhoneNumber;
        private boolean hideTotalProfit;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ThemeSettingsDto {
        private String themeMode;
        private String accentColor;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AllSettingsDto {
        private ProfileSettingsDto profile;
        private SecuritySettingsDto security;
        private NotificationSettingsDto notifications;
        private TradingSettingsDto trading;
        private PrivacySettingsDto privacy;
        private ThemeSettingsDto theme;
    }
}
