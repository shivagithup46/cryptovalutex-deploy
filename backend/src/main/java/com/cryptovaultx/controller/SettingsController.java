package com.cryptovaultx.controller;

import com.cryptovaultx.dto.SettingsDto.*;
import com.cryptovaultx.security.UserDetailsImpl;
import com.cryptovaultx.service.SettingsService;
import com.cryptovaultx.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<AllSettingsDto> getSettings(Authentication authentication) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return ResponseEntity.ok(settingsService.getAllSettings(userId));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody ProfileSettingsDto dto) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        try {
            ProfileSettingsDto updatedProfile = settingsService.updateProfile(userId, dto);
            return ResponseEntity.ok(updatedProfile);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/security")
    public ResponseEntity<?> updateSecurity(Authentication authentication, @RequestBody SecuritySettingsDto dto) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        try {
            settingsService.updateSecurity(userId, dto);
            return ResponseEntity.ok("Security settings updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/notifications")
    public ResponseEntity<?> updateNotifications(Authentication authentication, @RequestBody NotificationSettingsDto dto) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        settingsService.updateNotifications(userId, dto);
        return ResponseEntity.ok("Notification settings updated successfully");
    }

    @PutMapping("/trading")
    public ResponseEntity<?> updateTrading(Authentication authentication, @RequestBody TradingSettingsDto dto) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        settingsService.updateTrading(userId, dto);
        return ResponseEntity.ok("Trading settings updated successfully");
    }

    @PutMapping("/privacy")
    public ResponseEntity<?> updatePrivacy(Authentication authentication, @RequestBody PrivacySettingsDto dto) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        settingsService.updatePrivacy(userId, dto);
        return ResponseEntity.ok("Privacy settings updated successfully");
    }

    @PutMapping("/theme")
    public ResponseEntity<?> updateTheme(Authentication authentication, @RequestBody ThemeSettingsDto dto) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        settingsService.updateTheme(userId, dto);
        return ResponseEntity.ok("Theme settings updated successfully");
    }

    @PostMapping("/reset-demo")
    public ResponseEntity<?> resetDemo(Authentication authentication) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        userService.resetDemoAccount(userId);
        return ResponseEntity.ok("Demo account has been reset successfully! Your balance is now ₹10,00,000 INR.");
    }
}
