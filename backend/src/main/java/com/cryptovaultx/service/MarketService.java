package com.cryptovaultx.service;

import com.cryptovaultx.entity.Market;
import com.cryptovaultx.entity.Token;
import com.cryptovaultx.repository.MarketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MarketService {

    private final MarketRepository marketRepository;
    private final com.cryptovaultx.repository.TokenRepository tokenRepository;

    public List<Market> getAllActiveMarkets() {
        return marketRepository.findAll().stream().filter(Market::isActive).toList();
    }

    public Market getMarket(String marketId) {
        return marketRepository.findById(marketId).orElseThrow(() -> new RuntimeException("Market not found"));
    }
    
    public Market getMarketBySymbol(String symbol) {
        return marketRepository.findBySymbol(symbol).orElseGet(() -> createMarket(symbol));
    }
    
    private Market createMarket(String symbol) {
        String[] parts = symbol.split("_");
        if (parts.length != 2) {
            throw new RuntimeException("Invalid market symbol format. Expected format: BASE_QUOTE (e.g., BTC_USDT)");
        }
        
        Token baseToken = tokenRepository.findBySymbol(parts[0]).orElseGet(() -> createToken(parts[0]));
        Token quoteToken = tokenRepository.findBySymbol(parts[1]).orElseGet(() -> createToken(parts[1]));
        
        Market market = Market.builder()
                .symbol(symbol)
                .baseToken(baseToken)
                .quoteToken(quoteToken)
                .baseMinSize(new java.math.BigDecimal("0.0001"))
                .baseMaxSize(new java.math.BigDecimal("1000000"))
                .quoteTickSize(new java.math.BigDecimal("0.01"))
                .baseTickSize(new java.math.BigDecimal("0.0001"))
                .makerFeeRate(new java.math.BigDecimal("0.001"))
                .takerFeeRate(new java.math.BigDecimal("0.001"))
                .isActive(true)
                .build();
                
        return marketRepository.save(market);
    }
    
    private Token createToken(String symbol) {
        Token token = Token.builder()
                .symbol(symbol)
                .name(symbol)
                .currentPrice(java.math.BigDecimal.ONE)
                .isActive(true)
                .build();
        return tokenRepository.save(token);
    }
}
