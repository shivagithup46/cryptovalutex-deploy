package com.cryptovaultx.service;

import com.cryptovaultx.dto.SettingsDto.*;
import com.cryptovaultx.entity.User;
import com.cryptovaultx.entity.UserSettings;
import com.cryptovaultx.repository.UserRepository;
import com.cryptovaultx.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final UserRepository userRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public AllSettingsDto getAllSettings(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        UserSettings settings = userSettingsRepository.findByUserId(userId)
                .orElseGet(() -> {
                    // Fallback create if not exists
                    UserSettings newSettings = UserSettings.builder().user(user).build();
                    return userSettingsRepository.save(newSettings);
                });

        return AllSettingsDto.builder()
                .profile(ProfileSettingsDto.builder()
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .phone(user.getPhone())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .joinedDate(user.getCreatedAt().toString())
                        .profilePhoto(settings.getProfilePhoto())
                        .country(settings.getCountry())
                        .timezone(settings.getTimezone())
                        .language(settings.getLanguage())
                        .build())
                .security(SecuritySettingsDto.builder()
                        .isTwoFactorEnabled(user.isTwoFactorEnabled())
                        .isEmailVerified(user.isEmailVerified())
                        .isPhoneVerified(user.isPhoneVerified())
                        .enableLoginNotifications(settings.isEnableLoginNotifications())
                        .lastLogin(user.getLastLogin() != null ? user.getLastLogin().toString() : "Never")
                        .build())
                .notifications(NotificationSettingsDto.builder()
                        .tradeNotifications(settings.isTradeNotifications())
                        .buyNotifications(settings.isBuyNotifications())
                        .sellNotifications(settings.isSellNotifications())
                        .portfolioAlerts(settings.isPortfolioAlerts())
                        .priceAlerts(settings.isPriceAlerts())
                        .marketNews(settings.isMarketNews())
                        .emailNotifications(settings.isEmailNotifications())
                        .browserNotifications(settings.isBrowserNotifications())
                        .systemAnnouncements(settings.isSystemAnnouncements())
                        .build())
                .trading(TradingSettingsDto.builder()
                        .defaultCurrency(settings.getDefaultCurrency())
                        .defaultTradingPair(settings.getDefaultTradingPair())
                        .chartTheme(settings.getChartTheme())
                        .defaultChartInterval(settings.getDefaultChartInterval())
                        .enableSoundEffects(settings.isEnableSoundEffects())
                        .autoRefresh(settings.isAutoRefresh())
                        .decimalPrecision(settings.isDecimalPrecision())
                        .build())
                .privacy(PrivacySettingsDto.builder()
                        .hidePortfolioValue(settings.isHidePortfolioValue())
                        .hideWalletBalance(settings.isHideWalletBalance())
                        .hideEmail(settings.isHideEmail())
                        .hidePhoneNumber(settings.isHidePhoneNumber())
                        .hideTotalProfit(settings.isHideTotalProfit())
                        .build())
                .theme(ThemeSettingsDto.builder()
                        .themeMode(settings.getThemeMode())
                        .accentColor(settings.getAccentColor())
                        .build())
                .build();
    }

    @Transactional
    public ProfileSettingsDto updateProfile(String userId, ProfileSettingsDto dto) {
        User user = userRepository.findById(userId).orElseThrow();
        UserSettings settings = getOrCreateSettings(user);

        // Validate and format Phone Number
        if (dto.getPhone() != null && !dto.getPhone().trim().isEmpty()) {
            String phoneStr = dto.getPhone().trim().replaceAll("[^0-9]", "");
            if (phoneStr.startsWith("91") && phoneStr.length() == 12) {
                phoneStr = phoneStr.substring(2);
            }
            if (!phoneStr.matches("^\\d{10}$")) {
                throw new IllegalArgumentException("Please enter a valid 10-digit phone number.");
            }
            
            if (userRepository.existsByPhoneAndIdNot(phoneStr, userId)) {
                throw new com.cryptovaultx.exception.DuplicatePhoneNumberException("Phone number is already registered with another account.");
            }
            
            user.setPhone(phoneStr);
        } else {
            user.setPhone(null);
        }

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        userRepository.save(user);

        settings.setProfilePhoto(dto.getProfilePhoto());
        settings.setCountry(dto.getCountry());
        settings.setTimezone(dto.getTimezone());
        settings.setLanguage(dto.getLanguage());
        userSettingsRepository.save(settings);

        return ProfileSettingsDto.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .role(user.getRole().name())
                .joinedDate(user.getCreatedAt().toString())
                .profilePhoto(settings.getProfilePhoto())
                .country(settings.getCountry())
                .timezone(settings.getTimezone())
                .language(settings.getLanguage())
                .build();
    }

    @Transactional
    public void updateSecurity(String userId, SecuritySettingsDto dto) {
        User user = userRepository.findById(userId).orElseThrow();
        UserSettings settings = getOrCreateSettings(user);

        if (dto.getNewPassword() != null && !dto.getNewPassword().isEmpty()) {
            if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("Current password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        }

        user.setTwoFactorEnabled(dto.isTwoFactorEnabled());
        userRepository.save(user);

        settings.setEnableLoginNotifications(dto.isEnableLoginNotifications());
        userSettingsRepository.save(settings);
    }

    @Transactional
    public void updateNotifications(String userId, NotificationSettingsDto dto) {
        UserSettings settings = getOrCreateSettings(userRepository.findById(userId).orElseThrow());
        
        settings.setTradeNotifications(dto.isTradeNotifications());
        settings.setBuyNotifications(dto.isBuyNotifications());
        settings.setSellNotifications(dto.isSellNotifications());
        settings.setPortfolioAlerts(dto.isPortfolioAlerts());
        settings.setPriceAlerts(dto.isPriceAlerts());
        settings.setMarketNews(dto.isMarketNews());
        settings.setEmailNotifications(dto.isEmailNotifications());
        settings.setBrowserNotifications(dto.isBrowserNotifications());
        settings.setSystemAnnouncements(dto.isSystemAnnouncements());
        
        userSettingsRepository.save(settings);
    }

    @Transactional
    public void updateTrading(String userId, TradingSettingsDto dto) {
        UserSettings settings = getOrCreateSettings(userRepository.findById(userId).orElseThrow());
        
        settings.setDefaultCurrency(dto.getDefaultCurrency());
        settings.setDefaultTradingPair(dto.getDefaultTradingPair());
        settings.setChartTheme(dto.getChartTheme());
        settings.setDefaultChartInterval(dto.getDefaultChartInterval());
        settings.setEnableSoundEffects(dto.isEnableSoundEffects());
        settings.setAutoRefresh(dto.isAutoRefresh());
        settings.setDecimalPrecision(dto.isDecimalPrecision());
        
        userSettingsRepository.save(settings);
    }

    @Transactional
    public void updatePrivacy(String userId, PrivacySettingsDto dto) {
        UserSettings settings = getOrCreateSettings(userRepository.findById(userId).orElseThrow());
        
        settings.setHidePortfolioValue(dto.isHidePortfolioValue());
        settings.setHideWalletBalance(dto.isHideWalletBalance());
        settings.setHideEmail(dto.isHideEmail());
        settings.setHidePhoneNumber(dto.isHidePhoneNumber());
        settings.setHideTotalProfit(dto.isHideTotalProfit());
        
        userSettingsRepository.save(settings);
    }

    @Transactional
    public void updateTheme(String userId, ThemeSettingsDto dto) {
        UserSettings settings = getOrCreateSettings(userRepository.findById(userId).orElseThrow());
        
        settings.setThemeMode(dto.getThemeMode());
        settings.setAccentColor(dto.getAccentColor());
        
        userSettingsRepository.save(settings);
    }

    private UserSettings getOrCreateSettings(User user) {
        return userSettingsRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    UserSettings newSettings = UserSettings.builder().user(user).build();
                    return userSettingsRepository.save(newSettings);
                });
    }
}
