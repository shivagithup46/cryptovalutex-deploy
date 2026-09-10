package com.cryptovaultx.service;

import com.cryptovaultx.dto.AuthDtos.*;
import com.cryptovaultx.dto.AuthResponse;
import com.cryptovaultx.dto.LoginRequest;
import com.cryptovaultx.dto.RegisterRequest;
import com.cryptovaultx.entity.Role;
import com.cryptovaultx.entity.User;
import com.cryptovaultx.repository.UserRepository;
import com.cryptovaultx.security.JwtUtils;
import com.cryptovaultx.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.TimeUnit;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final RedisService redisService;
    private final EmailService emailService;
    private final WalletService walletService;
    private final com.cryptovaultx.repository.BankAccountRepository bankAccountRepository;
    private final com.cryptovaultx.repository.PortfolioRepository portfolioRepository;
    private final com.cryptovaultx.repository.NotificationPreferencesRepository notificationPreferencesRepository;
    private final com.cryptovaultx.repository.UserSettingsRepository userSettingsRepository;
    private final com.cryptovaultx.repository.LoginHistoryRepository loginHistoryRepository;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateJwtToken(authentication);
        String refreshToken = jwtUtils.generateRefreshToken();

        // Store refresh token in Redis (7 days TTL)
        redisService.save("refreshToken:" + refreshToken, userDetails.getUsername(), 7, TimeUnit.DAYS);

        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");

        User user = userRepository.findById(userDetails.getId()).orElse(null);
        if (user != null) {
            user.setLastLogin(java.time.LocalDateTime.now());
            userRepository.save(user);

            com.cryptovaultx.entity.LoginHistory history = com.cryptovaultx.entity.LoginHistory.builder()
                    .user(user)
                    .ipAddress("127.0.0.1")
                    .userAgent("Chrome / Desktop Web")
                    .location("India")
                    .isSuccess(true)
                    .loginTime(java.time.LocalDateTime.now())
                    .build();
            loginHistoryRepository.save(history);
        }

        return AuthResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken)
                .email(userDetails.getEmail())
                .role(role)
                .build();
    }

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(encoder.encode(request.getPassword()))
                .role(Role.USER)
                .isEmailVerified(false)
                .isPhoneVerified(false)
                .isTwoFactorEnabled(false)
                .build();

        user = userRepository.save(user);

        // Create Virtual Bank Account
        com.cryptovaultx.entity.BankAccount bankAccount = com.cryptovaultx.entity.BankAccount.builder()
                .user(user)
                .accountHolderName(user.getFirstName() + " " + user.getLastName())
                .accountNumber("DEMO-" + user.getId().substring(0, 8).toUpperCase())
                .ifscCode("DEMO0000123")
                .bankName("CryptoVaultX Virtual Bank")
                .upiId(user.getEmail().split("@")[0] + "@demoupi")
                .isVerified(true)
                .balance(new java.math.BigDecimal("10000000.00")) // Bank has 10M
                .currency("INR")
                .status("ACTIVE")
                .build();
        bankAccountRepository.save(bankAccount);

        // Give 10,000,000 INR welcome bonus for testing in the Wallet
        walletService.processDeposit(user.getId(), "INR", new java.math.BigDecimal("10000000.00"));
        
        // Initialize Portfolio
        com.cryptovaultx.entity.Portfolio portfolio = com.cryptovaultx.entity.Portfolio.builder()
                .user(user)
                .totalBalanceInr(java.math.BigDecimal.ZERO)
                .totalProfitInr(java.math.BigDecimal.ZERO)
                .todayProfitInr(java.math.BigDecimal.ZERO)
                .roiPercentage(java.math.BigDecimal.ZERO)
                .build();
        portfolioRepository.save(portfolio);
        
        // Initialize User Settings
        com.cryptovaultx.entity.UserSettings userSettings = com.cryptovaultx.entity.UserSettings.builder()
                .user(user)
                .build();
        userSettingsRepository.save(userSettings);
        
        // Initialize Notification Settings
        com.cryptovaultx.entity.NotificationPreferences prefs = com.cryptovaultx.entity.NotificationPreferences.builder()
                .user(user)
                .emailAlerts(true)
                .smsAlerts(false)
                .pushNotifications(true)
                .marketingEmails(false)
                .build();
        notificationPreferencesRepository.save(prefs);
        
        // Generate OTP and send email

        generateAndSendOtp(user.getEmail(), "email_verify:");
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        if (redisService.hasKey("refreshToken:" + refreshToken)) {
            String email = (String) redisService.get("refreshToken:" + refreshToken);
            String newJwt = jwtUtils.generateTokenFromUsername(email);
            
            // Delete old refresh token, generate new one (rotation)
            redisService.delete("refreshToken:" + refreshToken);
            String newRefreshToken = jwtUtils.generateRefreshToken();
            redisService.save("refreshToken:" + newRefreshToken, email, 7, TimeUnit.DAYS);
            
            User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

            return AuthResponse.builder()
                    .token(newJwt)
                    .refreshToken(newRefreshToken)
                    .email(email)
                    .role("ROLE_" + user.getRole().name())
                    .build();
        } else {
            throw new RuntimeException("Invalid or expired refresh token!");
        }
    }

    public void logout(LogoutRequest request) {
        String token = request.getToken();
        // Add JWT to blacklist in Redis with a TTL of 1 day (max JWT life)
        redisService.save("blacklist:" + token, "blacklisted", 1, TimeUnit.DAYS);
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            generateAndSendOtp(request.getEmail(), "pwd_reset:");
        }
        // If it doesn't exist, we don't throw error to prevent email enumeration attacks
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String key = "pwd_reset:" + request.getEmail();
        if (redisService.hasKey(key) && redisService.get(key).equals(request.getOtp())) {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setPassword(encoder.encode(request.getNewPassword()));
            userRepository.save(user);
            redisService.delete(key);
        } else {
            throw new RuntimeException("Invalid or expired OTP");
        }
    }

    @Transactional
    public void verifyEmail(VerifyEmailRequest request) {
        String key = "email_verify:" + request.getEmail();
        if (redisService.hasKey(key) && redisService.get(key).equals(request.getOtp())) {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setEmailVerified(true);
            userRepository.save(user);
            redisService.delete(key);
        } else {
            throw new RuntimeException("Invalid or expired OTP");
        }
    }
    
    private void generateAndSendOtp(String email, String prefix) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        redisService.save(prefix + email, otp, 15, TimeUnit.MINUTES);
        emailService.sendOtp(email, otp);
    }
}
