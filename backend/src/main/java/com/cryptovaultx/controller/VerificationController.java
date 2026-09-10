package com.cryptovaultx.controller;

import com.cryptovaultx.security.UserDetailsImpl;
import com.cryptovaultx.service.VerificationService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;

    @PostMapping("/send-phone-otp")
    public ResponseEntity<?> sendPhoneOtp(Authentication authentication, @RequestBody SendOtpRequest request) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        try {
            String response = verificationService.sendPhoneOtp(userId, request.getPhoneNumber());
            Map<String, String> result = new HashMap<>();
            result.put("message", "OTP sent successfully");
            
            // If development mode returns the OTP
            if (!response.equals("OTP sent successfully")) {
                result.put("developmentOtp", response);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            String errorMsg = e.getMessage() != null ? e.getMessage() : "An internal server error occurred";
            return ResponseEntity.badRequest().body(Map.of("error", errorMsg));
        }
    }

    @PostMapping("/verify-phone-otp")
    public ResponseEntity<?> verifyPhoneOtp(Authentication authentication, @RequestBody VerifyOtpRequest request) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        try {
            verificationService.verifyPhoneOtp(userId, request.getPhoneNumber(), request.getOtp());
            return ResponseEntity.ok(Map.of("message", "Phone verified successfully"));
        } catch (Exception e) {
            String errorMsg = e.getMessage() != null ? e.getMessage() : "An internal server error occurred";
            return ResponseEntity.badRequest().body(Map.of("error", errorMsg));
        }
    }
    @Data
    public static class SendOtpRequest {
        private String phoneNumber;
    }

    @Data
    public static class VerifyOtpRequest {
        private String phoneNumber;
        private String otp;
    }

}
