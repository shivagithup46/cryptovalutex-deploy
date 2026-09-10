package com.cryptovaultx.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MarketDataDTO {
    private String symbol;
    private double currentPrice;
    private double priceChange24h;
    private double priceChangePercentage24h;
    private double volume24h;
    private double marketCap;
    private double high24h;
    private double low24h;
    private String name;
    private String image;
    private double circulatingSupply;
    private double totalSupply;
}
