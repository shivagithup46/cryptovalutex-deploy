package com.cryptovaultx.service;

import com.cryptovaultx.entity.Market;
import com.cryptovaultx.entity.User;
import com.cryptovaultx.entity.Watchlist;
import com.cryptovaultx.repository.MarketRepository;
import com.cryptovaultx.repository.UserRepository;
import com.cryptovaultx.repository.WatchlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final UserRepository userRepository;
    private final MarketRepository marketRepository;

    @Transactional(readOnly = true)
    public List<String> getUserWatchlistSymbols(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return watchlistRepository.findByUserId(user.getId()).stream()
                .map(w -> w.getMarket().getSymbol())
                .collect(Collectors.toList());
    }

    @Transactional
    public void addToWatchlist(String username, String symbol) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Market market = marketRepository.findBySymbol(symbol)
                .orElseThrow(() -> new RuntimeException("Market not found"));

        if (!watchlistRepository.existsByUserIdAndMarketId(user.getId(), market.getId())) {
            Watchlist watchlist = Watchlist.builder()
                    .user(user)
                    .market(market)
                    .build();
            watchlistRepository.save(watchlist);
        }
    }

    @Transactional
    public void removeFromWatchlist(String username, String symbol) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Market market = marketRepository.findBySymbol(symbol)
                .orElseThrow(() -> new RuntimeException("Market not found"));

        watchlistRepository.deleteByUserIdAndMarketId(user.getId(), market.getId());
    }
}
