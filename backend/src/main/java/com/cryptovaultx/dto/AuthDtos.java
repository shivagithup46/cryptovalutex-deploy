package com.cryptovaultx.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class AuthDtos {

    @Data
    public static class RefreshTokenRequest {
        @NotBlank
        private String refreshToken;
    }

    @Data
    public static class LogoutRequest {
        @NotBlank
        private String token;
    }

    @Data
    public static class ForgotPasswordRequest {
        @NotBlank
        @Email
        private String email;
    }

    @Data
    public static class ResetPasswordRequest {
        @NotBlank
        private String email;
        
        @NotBlank
        private String otp;
        
        @NotBlank
        @com.cryptovaultx.validation.StrongPassword
        private String newPassword;
    }
    
    @Data
    public static class VerifyEmailRequest {
        @NotBlank
        private String email;
        
        @NotBlank
        private String otp;
    }
}
