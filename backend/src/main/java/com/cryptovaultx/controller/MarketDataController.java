package com.cryptovaultx.controller;

import com.cryptovaultx.dto.MarketDataDTO;
import com.cryptovaultx.service.MarketDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/market")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MarketDataController {

    @Autowired
    private MarketDataService marketDataService;

    @GetMapping("/top")
    public ResponseEntity<List<MarketDataDTO>> getTopMarketData() {
        return ResponseEntity.ok(marketDataService.getTopMarketData());
    }

    @GetMapping("/{symbol}")
    public ResponseEntity<MarketDataDTO> getMarketDataForSymbol(@PathVariable String symbol) {
        return ResponseEntity.ok(marketDataService.getMarketDataForSymbol(symbol));
    }
}
