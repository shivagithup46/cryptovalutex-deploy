package com.cryptovaultx.repository;

import com.cryptovaultx.entity.RiskScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RiskScoreRepository extends JpaRepository<RiskScore, String> {
    Optional<RiskScore> findByUserId(String userId);
}
