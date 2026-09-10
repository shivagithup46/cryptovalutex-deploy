package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bank_accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankAccount extends AuditableEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String accountHolderName;

    @Column(nullable = false)
    private String accountNumber;

    @Column(nullable = false)
    private String ifscCode;

    private String bankName;
    
    private String upiId;

    @Column(nullable = false)
    private boolean isVerified = false;

    @Column(nullable = false, precision = 19, scale = 4)
    private java.math.BigDecimal balance = java.math.BigDecimal.ZERO;

    @Column(nullable = false)
    private String currency = "INR";

    @Column(nullable = false)
    private String status = "ACTIVE";
}
