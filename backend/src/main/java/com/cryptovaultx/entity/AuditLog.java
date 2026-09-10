package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String userId; // Can be null if anonymous action
    
    @Column(nullable = false)
    private String action; // e.g. "LOGIN", "PROFILE_UPDATE", "KYC_SUBMIT"
    
    @Column(columnDefinition = "TEXT")
    private String details;
    
    private String ipAddress;
    private String device;
    private String browser;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime timestamp;
}
