package com.cryptovaultx.repository;

import com.cryptovaultx.entity.EmailOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailOtpRepository extends JpaRepository<EmailOtp, Long> {
    Optional<EmailOtp> findTopByEmailOrderByCreatedAtDesc(String email);
    
    // Additional method to invalidate older OTPs
    java.util.List<EmailOtp> findByEmailAndVerifiedFalse(String email);
}
