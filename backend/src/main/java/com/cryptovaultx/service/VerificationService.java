package com.cryptovaultx.service;

import com.cryptovaultx.entity.User;
import com.cryptovaultx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class VerificationService {

    private final UserRepository userRepository;
    private final SmsService smsService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${sms.provider:development}")
    private String smsProvider;

    @Transactional
    public String sendPhoneOtp(String userId, String phoneNumber) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isPhoneVerified() && user.getPhone() != null && user.getPhone().equals(phoneNumber)) {
            throw new RuntimeException("Phone number is already verified");
        }
        
        // Ensure no other user is using this phone number
        Optional<User> existingPhone = userRepository.findFirstByPhoneOrderByIdAsc(phoneNumber);
        if (existingPhone.isPresent() && !existingPhone.get().getId().equals(userId) && existingPhone.get().isPhoneVerified()) {
            throw new RuntimeException("This phone number is already registered and verified by another user");
        }

        // Check resend limits
        if (user.getPhoneVerificationResends() >= 3) {
            if (user.getOtpExpiry() != null && LocalDateTime.now().isBefore(user.getOtpExpiry().plusHours(24))) {
                throw new RuntimeException("Maximum resend attempts reached. Try again in 24 hours.");
            } else {
                user.setPhoneVerificationResends(0);
                user.setPhoneVerificationAttempts(0);
            }
        }

        // Generate 6 digit OTP
        String otp = generateOtp();
        
        user.setPhone(phoneNumber);
        user.setOtpHash(passwordEncoder.encode(otp));
        user.setOtpCreatedAt(LocalDateTime.now());
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        user.setPhoneVerificationResends(user.getPhoneVerificationResends() + 1);
        
        userRepository.save(user);

        smsService.sendOtp(phoneNumber, otp);

        // For development, we return the OTP in the response (as requested by instructions)
        if ("development".equalsIgnoreCase(smsProvider)) {
            return otp;
        }
        
        return "OTP sent successfully";
    }

    @Transactional
    public void verifyPhoneOtp(String userId, String phoneNumber, String otp) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isPhoneVerified() && user.getPhone().equals(phoneNumber)) {
            throw new RuntimeException("Phone is already verified");
        }

        if (!phoneNumber.equals(user.getPhone())) {
            throw new RuntimeException("Phone number mismatch");
        }

        if (user.getPhoneVerificationAttempts() >= 5) {
            throw new RuntimeException("Temporarily blocked due to too many failed attempts. Please request a new OTP.");
        }

        if (user.getOtpExpiry() == null || LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            throw new RuntimeException("OTP expired. Please resend.");
        }

        if (!passwordEncoder.matches(otp, user.getOtpHash())) {
            user.setPhoneVerificationAttempts(user.getPhoneVerificationAttempts() + 1);
            userRepository.save(user);
            throw new RuntimeException("Invalid OTP.");
        }

        // Success
        user.setPhoneVerified(true);
        user.setPhoneVerifiedAt(LocalDateTime.now());
        user.setOtpHash(null);
        user.setOtpCreatedAt(null);
        user.setOtpExpiry(null);
        user.setPhoneVerificationAttempts(0);
        user.setPhoneVerificationResends(0);

        userRepository.save(user);
    }



    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
