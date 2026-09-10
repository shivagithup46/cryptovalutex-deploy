package com.cryptovaultx.repository;

import com.cryptovaultx.entity.RewardHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardHistoryRepository extends JpaRepository<RewardHistory, String> {
    List<RewardHistory> findByUserId(String userId);
}
