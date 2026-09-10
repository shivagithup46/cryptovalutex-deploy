package com.cryptovaultx.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class MarketDataWebSocketHandler {

    private final SimpMessagingTemplate messagingTemplate;
    private final Random random = new Random();

    // Mocking real-time market data updates for Phase 3
    @Scheduled(fixedRate = 2000)
    public void broadcastMarketUpdates() {
        Map<String, Object> update = new HashMap<>();
        update.put("symbol", "BTC_INR");
        update.put("price", new BigDecimal("5500000").add(new BigDecimal(random.nextInt(1000) - 500)));
        update.put("volume24h", new BigDecimal("1200.5"));
        update.put("change24h", "+2.5%");

        messagingTemplate.convertAndSend("/topic/market/BTC_INR", update);
        
        Map<String, Object> ethUpdate = new HashMap<>();
        ethUpdate.put("symbol", "ETH_INR");
        ethUpdate.put("price", new BigDecimal("250000").add(new BigDecimal(random.nextInt(200) - 100)));
        ethUpdate.put("volume24h", new BigDecimal("5400.2"));
        ethUpdate.put("change24h", "-0.8%");

        messagingTemplate.convertAndSend("/topic/market/ETH_INR", ethUpdate);
    }
}
