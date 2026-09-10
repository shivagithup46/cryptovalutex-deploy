package com.cryptovaultx.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class AiAssistantService {

    public String getTradingAdvice(String prompt) {
        String lowerPrompt = prompt.toLowerCase();
        
        if (lowerPrompt.contains("portfolio")) {
            return "Based on your current holdings, you are heavily exposed to BTC (65%). Consider diversifying into Layer 1 altcoins like SOL or ETH to optimize your Sharpe ratio.";
        } else if (lowerPrompt.contains("bullish") || lowerPrompt.contains("trend")) {
            return "The MACD for BTC crossed above the signal line on the 4H chart. Historically, this indicates a bullish momentum continuation. Key resistance is at $72,000.";
        } else if (lowerPrompt.contains("candlestick")) {
            return "A 'Doji' candlestick represents market indecision. When found after an extended downtrend, it often signals a potential reversal. Look for volume confirmation on the next candle.";
        }
        
        return "I can analyze your portfolio, explain technical indicators, or provide market trends. What would you like to know?";
    }
    
    public List<String> getTrendingCoins() {
        return Arrays.asList("BTC", "SOL", "PEPE", "INJ");
    }
}
