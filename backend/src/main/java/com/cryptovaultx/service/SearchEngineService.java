package com.cryptovaultx.service;

import lombok.Data;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class SearchEngineService {

    public List<SearchResult> globalSearch(String query) {
        // Mock global search across users, coins, and orders
        return Arrays.asList(
            new SearchResult("User", "John Doe", "/admin/users/1"),
            new SearchResult("Coin", "Bitcoin (BTC)", "/trade?symbol=BTC_INR"),
            new SearchResult("Order", "Order #4421", "/admin/orders/4421")
        );
    }
}

@Data
class SearchResult {
    private final String type;
    private final String title;
    private final String link;
}
