package com.cryptovaultx.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExchangeAnalyticsDTO {
    private double totalMarketCapUsd;
    private double totalVolume24hUsd;
    private double btcDominancePercentage;
    private int fearAndGreedIndex;
    private String fearAndGreedClassification;
}
