package com.cryptovaultx.repository;

import com.cryptovaultx.entity.StakingPosition;
import com.cryptovaultx.entity.StakingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StakingPositionRepository extends JpaRepository<StakingPosition, String> {
    List<StakingPosition> findByUserId(String userId);
    List<StakingPosition> findByStatus(StakingStatus status);
}
