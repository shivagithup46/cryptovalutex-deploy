package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(unique = true)
    private String phone;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private boolean isEmailVerified = false;

    @Column(nullable = false)
    private boolean isPhoneVerified = false;

    @Column(nullable = false)
    private boolean isTwoFactorEnabled = false;

    @Column(nullable = false)
    private boolean hasClaimedDemoFunds = false;

    private LocalDateTime lastLogin;

    // Phone Verification Fields
    private String otpHash;
    private LocalDateTime otpCreatedAt;
    private LocalDateTime otpExpiry;
    private LocalDateTime phoneVerifiedAt;
    
    // Email Verification Fields
    private LocalDateTime emailVerifiedAt;
    
    @Column(nullable = false, columnDefinition = "integer default 0")
    @Builder.Default
    private int phoneVerificationAttempts = 0;
    
    @Column(nullable = false, columnDefinition = "integer default 0")
    @Builder.Default
    private int phoneVerificationResends = 0;
}
