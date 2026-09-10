package com.cryptovaultx.service;

import com.cryptovaultx.entity.EmailOtp;
import com.cryptovaultx.repository.EmailOtpRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.cryptovaultx.entity.User;
import com.cryptovaultx.repository.UserRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpService {

    private final EmailOtpRepository emailOtpRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public String sendEmailOtp(String email) {
        String normalizedEmail = email.trim().toLowerCase();

        // Invalidate previous OTPs for this email that are unverified
        List<EmailOtp> previousOtps = emailOtpRepository.findByEmailAndVerifiedFalse(normalizedEmail);
        for (EmailOtp previous : previousOtps) {
            previous.setVerified(false);
            previous.setExpiresAt(LocalDateTime.now()); // Expire them immediately
            emailOtpRepository.save(previous);
        }

        // Generate 6 digit OTP
        String otp = generateOtp();
        
        EmailOtp emailOtp = EmailOtp.builder()
                .email(normalizedEmail)
                .otpHash(passwordEncoder.encode(otp))
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .attemptCount(0)
                .verified(false)
                .build();
                
        emailOtpRepository.save(emailOtp);

        emailService.sendVerificationOtp(normalizedEmail, otp);
        return otp;
    }

    @Transactional
    public String resendEmailOtp(String email) {
        // Find latest OTP to check cooldown, but it's optional
        String normalizedEmail = email.trim().toLowerCase();
        Optional<EmailOtp> latestOtpOpt = emailOtpRepository.findTopByEmailOrderByCreatedAtDesc(normalizedEmail);
        
        if (latestOtpOpt.isPresent()) {
            EmailOtp latest = latestOtpOpt.get();
            // Basic cooldown check: e.g. 30 seconds
            if (latest.getCreatedAt().plusSeconds(30).isAfter(LocalDateTime.now())) {
                throw new RuntimeException("Please wait before requesting a new OTP.");
            }
        }
        
        return sendEmailOtp(email);
    }

    @Transactional
    public void verifyEmailOtp(String email, String otp) {
        String normalizedEmail = email.trim().toLowerCase();

        EmailOtp emailOtp = emailOtpRepository.findTopByEmailOrderByCreatedAtDesc(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("No OTP requested for this email."));

        if (emailOtp.isVerified()) {
            throw new RuntimeException("OTP is already verified.");
        }

        if (emailOtp.getAttemptCount() >= 5) {
            throw new RuntimeException("Temporarily blocked due to too many failed attempts. Please request a new OTP.");
        }

        if (LocalDateTime.now().isAfter(emailOtp.getExpiresAt())) {
            throw new RuntimeException("OTP expired. Please request a new OTP.");
        }

        if (!passwordEncoder.matches(otp, emailOtp.getOtpHash())) {
            emailOtp.setAttemptCount(emailOtp.getAttemptCount() + 1);
            emailOtpRepository.save(emailOtp);
            throw new RuntimeException("Invalid OTP.");
        }

        // Success
        emailOtp.setVerified(true);
        emailOtp.setUsedAt(LocalDateTime.now());
        emailOtpRepository.save(emailOtp);
        
        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setEmailVerified(true);
            user.setEmailVerifiedAt(LocalDateTime.now());
            userRepository.save(user);
        }
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
