package com.cryptovaultx.service;

import com.cryptovaultx.entity.NewsArticle;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class NewsService {

    public List<NewsArticle> getLatestNews() {
        // Mock news data
        return Arrays.asList(
            NewsArticle.builder()
                .title("Bitcoin Surges Past Key Resistance")
                .summary("BTC broke out above $70k today amid strong institutional demand.")
                .source("CryptoInsider")
                .publishedAt(LocalDateTime.now())
                .build(),
            NewsArticle.builder()
                .title("Ethereum Layer 2 TVL Hits New High")
                .summary("Total Value Locked across ETH rollups reaches $45B.")
                .source("DeFiDaily")
                .publishedAt(LocalDateTime.now().minusHours(2))
                .build()
        );
    }
}
