package com.cryptovaultx.service.ai;

import org.springframework.stereotype.Service;

@Service
public class OpenAiAdapter implements AiAdapter {
    
    // In production, inject OPENAI_API_KEY from environment variables
    // private String apiKey = System.getenv("OPENAI_API_KEY");

    @Override
    public String generateResponse(String prompt) {
        return "OpenAI Response (Mock): " + prompt;
    }

    @Override
    public String getProviderName() {
        return "OPENAI";
    }
}
