package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "login_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String ipAddress;
    private String userAgent;
    private String location;
    
    @Column(nullable = false)
    private boolean isSuccess;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime loginTime;
}
