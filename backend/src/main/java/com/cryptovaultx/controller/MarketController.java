package com.cryptovaultx.controller;

import com.cryptovaultx.entity.Market;
import com.cryptovaultx.service.MarketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/markets")
@RequiredArgsConstructor
public class MarketController {

    private final MarketService marketService;

    @GetMapping
    public ResponseEntity<List<Market>> getMarkets() {
        return ResponseEntity.ok(marketService.getAllActiveMarkets());
    }

    @GetMapping("/{symbol}")
    public ResponseEntity<Market> getMarketBySymbol(@PathVariable String symbol) {
        return ResponseEntity.ok(marketService.getMarketBySymbol(symbol));
    }
}
