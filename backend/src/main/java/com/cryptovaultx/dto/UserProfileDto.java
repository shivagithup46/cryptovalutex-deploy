package com.cryptovaultx.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileDto {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private boolean isEmailVerified;
    private boolean isTwoFactorEnabled;
}
