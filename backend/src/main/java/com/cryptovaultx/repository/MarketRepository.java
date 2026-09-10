package com.cryptovaultx.repository;

import com.cryptovaultx.entity.Market;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MarketRepository extends JpaRepository<Market, String> {
    Optional<Market> findBySymbol(String symbol);
}
