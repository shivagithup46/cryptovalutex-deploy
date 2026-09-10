package com.cryptovaultx.service.ai;

import org.springframework.stereotype.Service;

@Service
public class GeminiAdapter implements AiAdapter {
    
    @Override
    public String generateResponse(String prompt) {
        return "Gemini Response (Mock): " + prompt;
    }

    @Override
    public String getProviderName() {
        return "GEMINI";
    }
}
