package com.cryptovaultx.service.ai;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiProviderFactory {

    @Autowired
    private List<AiAdapter> adapters;

    @Value("${ai.provider.active:OPENAI}")
    private String activeProvider;

    public AiAdapter getActiveAdapter() {
        return adapters.stream()
                .filter(adapter -> adapter.getProviderName().equalsIgnoreCase(activeProvider))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No active AI provider found for: " + activeProvider));
    }
}
