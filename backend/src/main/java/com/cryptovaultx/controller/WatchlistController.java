package com.cryptovaultx.controller;

import com.cryptovaultx.security.UserDetailsImpl;
import com.cryptovaultx.service.WatchlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class WatchlistController {

    private final WatchlistService watchlistService;

    @GetMapping
    public ResponseEntity<List<String>> getWatchlist(Authentication authentication) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return ResponseEntity.ok(watchlistService.getUserWatchlistSymbols(userId));
    }

    @PostMapping("/{symbol}")
    public ResponseEntity<Void> addToWatchlist(Authentication authentication, @PathVariable String symbol) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        watchlistService.addToWatchlist(userId, symbol);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{symbol}")
    public ResponseEntity<Void> removeFromWatchlist(Authentication authentication, @PathVariable String symbol) {
        String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        watchlistService.removeFromWatchlist(userId, symbol);
        return ResponseEntity.ok().build();
    }
}
