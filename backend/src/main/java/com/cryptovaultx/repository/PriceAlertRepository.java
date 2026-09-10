package com.cryptovaultx.repository;

import com.cryptovaultx.entity.PriceAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriceAlertRepository extends JpaRepository<PriceAlert, String> {
    List<PriceAlert> findByUserId(String userId);
    List<PriceAlert> findByMarketIdAndIsActiveTrue(String marketId);
}
