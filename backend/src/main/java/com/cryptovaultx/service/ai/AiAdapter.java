package com.cryptovaultx.service.ai;

public interface AiAdapter {
    String generateResponse(String prompt);
    String getProviderName();
}
