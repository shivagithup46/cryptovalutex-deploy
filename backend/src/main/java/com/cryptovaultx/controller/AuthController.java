package com.cryptovaultx.controller;

import com.cryptovaultx.dto.AuthDtos.*;
import com.cryptovaultx.dto.LoginRequest;
import com.cryptovaultx.dto.RegisterRequest;
import com.cryptovaultx.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final com.cryptovaultx.service.OtpService otpService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        authService.register(signUpRequest);
        return ResponseEntity.ok(java.util.Map.of("message", "User registered successfully! Please check your email for OTP."));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@Valid @RequestBody LogoutRequest request) {
        authService.logout(request);
        return ResponseEntity.ok(java.util.Map.of("message", "Log out successful!"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(java.util.Map.of("message", "If the email exists, an OTP has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(java.util.Map.of("message", "Password reset successfully!"));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        authService.verifyEmail(request);
        return ResponseEntity.ok(java.util.Map.of("message", "Email verified successfully!"));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody SendOtpRequest request) {
        try {
            String otp = otpService.sendEmailOtp(request.getEmail());
            return ResponseEntity.ok(java.util.Map.of(
                "success", true,
                "message", "OTP sent successfully",
                "developmentOtp", otp
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                "success", false,
                "message", e.getMessage() != null ? e.getMessage() : "Failed to send OTP"
            ));
        }
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody SendOtpRequest request) {
        try {
            String otp = otpService.resendEmailOtp(request.getEmail());
            return ResponseEntity.ok(java.util.Map.of(
                "success", true,
                "message", "OTP resent successfully",
                "developmentOtp", otp
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                "success", false,
                "message", e.getMessage() != null ? e.getMessage() : "Failed to resend OTP"
            ));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        try {
            otpService.verifyEmailOtp(request.getEmail(), request.getOtp());
            return ResponseEntity.ok(java.util.Map.of(
                "success", true,
                "message", "Email verified successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                "success", false,
                "message", e.getMessage() != null ? e.getMessage() : "Invalid OTP"
            ));
        }
    }

    @lombok.Data
    public static class SendOtpRequest {
        private String email;
    }

    @lombok.Data
    public static class VerifyOtpRequest {
        private String email;
        private String otp;
    }
}
