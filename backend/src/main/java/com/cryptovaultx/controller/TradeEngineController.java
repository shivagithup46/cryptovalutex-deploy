package com.cryptovaultx.controller;

import com.cryptovaultx.entity.OrderSide;
import com.cryptovaultx.entity.Trade;
import com.cryptovaultx.security.UserDetailsImpl;
import com.cryptovaultx.service.MarketDataService;
import com.cryptovaultx.service.OrderService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/trade")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class TradeEngineController {

    private final OrderService orderService;
    private final MarketDataService marketDataService;

    @PostMapping("/buy")
    public ResponseEntity<?> executeBuy(@RequestBody TradeEngineRequest request, Authentication authentication) {
        try {
            String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
            BigDecimal currentPrice = BigDecimal.valueOf(marketDataService.getMarketDataForSymbol(request.getSymbol()).getCurrentPrice());
            Trade trade = orderService.executeInstantTrade(userId, request.getSymbol(), OrderSide.BUY, request.getQuantity(), currentPrice);
            return ResponseEntity.ok(Map.of("message", "BUY SUCCESSFUL", "trade", trade));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/sell")
    public ResponseEntity<?> executeSell(@RequestBody TradeEngineRequest request, Authentication authentication) {
        try {
            String userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
            BigDecimal currentPrice = BigDecimal.valueOf(marketDataService.getMarketDataForSymbol(request.getSymbol()).getCurrentPrice());
            Trade trade = orderService.executeInstantTrade(userId, request.getSymbol(), OrderSide.SELL, request.getQuantity(), currentPrice);
            return ResponseEntity.ok(Map.of("message", "SELL SUCCESSFUL", "trade", trade));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

@Data
class TradeEngineRequest {
    private String symbol; // e.g., BTC_INR
    private BigDecimal quantity;
}
