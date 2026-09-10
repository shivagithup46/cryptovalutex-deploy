package com.cryptovaultx.repository;

import com.cryptovaultx.entity.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, String> {
    List<Watchlist> findByUserId(String userId);
    boolean existsByUserIdAndMarketId(String userId, String marketId);
    void deleteByUserIdAndMarketId(String userId, String marketId);
}
