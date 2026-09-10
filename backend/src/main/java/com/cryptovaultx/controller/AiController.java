package com.cryptovaultx.controller;

import com.cryptovaultx.service.AiAssistantService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiAssistantService aiAssistantService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String response = aiAssistantService.getTradingAdvice(request.getPrompt());
        return ResponseEntity.ok(new ChatResponse(response));
    }
    
    @GetMapping("/trending")
    public ResponseEntity<List<String>> getTrending() {
        return ResponseEntity.ok(aiAssistantService.getTrendingCoins());
    }
}

@Data
class ChatRequest {
    private String prompt;
}

@Data
@RequiredArgsConstructor
class ChatResponse {
    private final String answer;
}
