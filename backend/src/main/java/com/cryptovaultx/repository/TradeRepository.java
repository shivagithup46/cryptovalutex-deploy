package com.cryptovaultx.repository;

import com.cryptovaultx.entity.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TradeRepository extends JpaRepository<Trade, String> {
    List<Trade> findByMarketIdOrderByCreatedAtDesc(String marketId);
}
